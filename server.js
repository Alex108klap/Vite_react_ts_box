import express from 'express';
import cors from 'cors';
import { createClient } from '@sanity/client';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const envPath = fileURLToPath(new URL('./.env', import.meta.url));
if (existsSync(envPath)) process.loadEnvFile(envPath);

const app = express();
const port = Number(process.env.PORT) || 5000;
const allowedOrigins = new Set(
  (process.env.CORS_ORIGINS || 'http://localhost:5173,http://127.0.0.1:5173')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean),
);

app.use(cors({
  origin(origin, callback) {
    callback(null, !origin || allowedOrigins.has(origin));
  },
  methods: ['POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
}));
app.use(express.json({ limit: '16kb' }));

const rateLimitWindowMs = 10 * 60 * 1000;
const rateLimitMax = 10;
const requestsByIp = new Map();

function limitApiRequests(req, res, next) {
  const origin = req.get('origin');
  if (origin && !allowedOrigins.has(origin)) {
    return res.status(403).json({ error: 'Origin is not allowed.' });
  }

  const now = Date.now();
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  const entry = requestsByIp.get(ip);

  if (!entry || now - entry.startedAt >= rateLimitWindowMs) {
    requestsByIp.set(ip, { startedAt: now, count: 1 });
  } else if (entry.count >= rateLimitMax) {
    res.set('Retry-After', String(Math.ceil((rateLimitWindowMs - (now - entry.startedAt)) / 1000)));
    return res.status(429).json({ error: 'Too many order requests. Please try again later.' });
  } else {
    entry.count += 1;
  }

  if (requestsByIp.size > 5000) {
    for (const [key, value] of requestsByIp) {
      if (now - value.startedAt >= rateLimitWindowMs) requestsByIp.delete(key);
    }
  }

  next();
}

app.use('/api', limitApiRequests);

const sanityClient = createClient({
  projectId: process.env.SANITY_PROJECT_ID || 'bz8msak0',
  dataset: process.env.SANITY_DATASET || 'production',
  apiVersion: '2023-05-03',
  useCdn: true,
});

const cleanText = (value, maxLength) => {
  if (typeof value !== 'string') return null;
  const cleaned = value.replace(/[\u0000-\u001f\u007f]/g, ' ').trim();
  return cleaned.length <= maxLength ? cleaned : null;
};

const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (character) => ({
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
})[character]);

const paymentLabels = {
  card: 'Карта',
  cash: 'Наличные',
  sbp: 'Электронный перевод / СБП',
};

let emailQueue = Promise.resolve();
let lastEmailSentAt = 0;
const emailIntervalMs = 1100;

function sendEmailJs(templateId, templateParams, config) {
  const sendTask = emailQueue.then(async () => {
    const waitMs = Math.max(0, emailIntervalMs - (Date.now() - lastEmailSentAt));
    if (waitMs > 0) await new Promise((resolve) => setTimeout(resolve, waitMs));
    lastEmailSentAt = Date.now();

    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Origin: config.sourceOrigin },
      body: JSON.stringify({
        service_id: config.serviceId,
        template_id: templateId,
        user_id: config.publicKey,
        ...(config.privateKey ? { accessToken: config.privateKey } : {}),
        template_params: templateParams,
      }),
      signal: AbortSignal.timeout(15000),
    });

    if (!response.ok) {
      console.error('EmailJS request failed with status:', response.status);
      throw new Error('EmailJS request failed');
    }
  });

  emailQueue = sendTask.catch(() => undefined);
  return sendTask;
}

app.post('/api/checkout', async (req, res) => {
  const body = req.body;
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return res.status(400).json({ error: 'Invalid order data.' });
  }

  const honeypot = cleanText(body.website, 200);
  if (honeypot === null && body.website !== undefined) {
    return res.status(400).json({ error: 'Invalid order data.' });
  }
  if (honeypot) return res.status(200).json({ success: true, confirmationEmailSent: false });

  const name = cleanText(body.name, 100);
  const phone = cleanText(body.phone, 30);
  const address = cleanText(body.address ?? '', 300);
  const customerEmail = cleanText(body.customerEmail ?? '', 254);
  const paymentMethod = body.paymentMethod;
  const requestedItems = body.items;

  if (name === null || phone === null || address === null || customerEmail === null) {
    return res.status(400).json({ error: 'One or more order fields are invalid.' });
  }
  const phoneDigits = phone.replace(/\D/g, '');
  if (!/^[0-9 +()\-]+$/.test(phone) || phoneDigits.length < 9 || phoneDigits.length > 15) {
    return res.status(400).json({ error: 'Enter a valid phone number.' });
  }
  if (customerEmail && (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail) || customerEmail.length > 254)) {
    return res.status(400).json({ error: 'Enter a valid email address.' });
  }
  if (!Object.hasOwn(paymentLabels, paymentMethod)) {
    return res.status(400).json({ error: 'Select a valid payment method.' });
  }
  if (!Array.isArray(requestedItems) || requestedItems.length === 0 || requestedItems.length > 50) {
    return res.status(400).json({ error: 'The cart is empty or contains too many products.' });
  }

  const itemIds = [];
  const quantitiesById = new Map();
  for (const item of requestedItems) {
    if (!item || typeof item !== 'object' || Array.isArray(item)) {
      return res.status(400).json({ error: 'Invalid cart item.' });
    }
    const id = cleanText(item.id, 128);
    const quantity = item.quantity;
    if (!id || !/^[A-Za-z0-9._-]+$/.test(id) || !Number.isInteger(quantity) || quantity < 1 || quantity > 99) {
      return res.status(400).json({ error: 'Invalid cart item.' });
    }
    if (quantitiesById.has(id)) return res.status(400).json({ error: 'Duplicate cart item.' });
    itemIds.push(id);
    quantitiesById.set(id, quantity);
  }

  const config = {
    serviceId: process.env.EMAILJS_SERVICE_ID,
    adminTemplateId: process.env.EMAILJS_ADMIN_TEMPLATE_ID,
    clientTemplateId: process.env.EMAILJS_CLIENT_TEMPLATE_ID,
    publicKey: process.env.EMAILJS_PUBLIC_KEY,
    privateKey: process.env.EMAILJS_PRIVATE_KEY,
    adminEmail: process.env.EMAILJS_ADMIN_EMAIL,
    sourceOrigin: process.env.EMAILJS_SOURCE_ORIGIN || [...allowedOrigins][0],
  };
  if ([config.serviceId, config.adminTemplateId, config.clientTemplateId, config.publicKey, config.adminEmail].some((value) => !value)) {
    console.error('EmailJS server configuration is incomplete.');
    return res.status(503).json({ error: 'Order email service is not configured.' });
  }

  try {
    const products = await sanityClient.fetch(
      '*[_type == "product" && _id in $ids]{ _id, name, price, discount }',
      { ids: itemIds },
    );
    if (!Array.isArray(products) || products.length !== itemIds.length) {
      return res.status(400).json({ error: 'One or more products are no longer available.' });
    }

    let total = 0;
    const itemsList = products.map((product) => {
      if (typeof product.name !== 'string' || !Number.isFinite(product.price) || product.price < 0) {
        throw new Error('Invalid product data in catalog');
      }
      const discount = Number.isFinite(product.discount) && product.discount > 0 && product.discount <= 100
        ? product.discount
        : 0;
      const price = discount ? Math.round(product.price * (1 - discount / 100)) : product.price;
      const quantity = quantitiesById.get(product._id);
      total += price * quantity;
      return `- ${escapeHtml(product.name)} x ${quantity} шт. (${price * quantity} $)`;
    }).join('\n');

    const templateParams = {
      to_email: config.adminEmail,
      user_email: customerEmail || 'Не указан',
      user_name: escapeHtml(name || 'Не указано'),
      user_phone: escapeHtml(phone),
      user_address: escapeHtml(address || 'Не указан'),
      payment_method: paymentLabels[paymentMethod],
      items_list: itemsList,
      total_price: `${total} $`,
    };

    await sendEmailJs(config.adminTemplateId, templateParams, config);

    let confirmationEmailSent = false;
    if (customerEmail) {
      try {
        await sendEmailJs(config.clientTemplateId, templateParams, config);
        confirmationEmailSent = true;
      } catch (error) {
        console.error('Customer confirmation email could not be sent.');
      }
    }

    return res.status(200).json({ success: true, confirmationEmailSent });
  } catch (error) {
    console.error('Order processing failed:', error instanceof Error ? error.message : 'Unknown error');
    return res.status(502).json({ error: 'The order could not be sent. Please try again later.' });
  }
});

app.use((error, req, res, next) => {
  if (res.headersSent) return next(error);
  if (error?.type === 'entity.too.large') return res.status(413).json({ error: 'Request is too large.' });
  if (error instanceof SyntaxError && 'body' in error) return res.status(400).json({ error: 'Invalid JSON.' });
  console.error('Unhandled API error:', error instanceof Error ? error.message : 'Unknown error');
  return res.status(500).json({ error: 'Internal server error.' });
});

app.listen(port, () => {
  console.log(`Order API listening on port ${port}.`);
});