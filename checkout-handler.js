import { createClient } from '@sanity/client';

const rateLimitWindowMs = 10 * 60 * 1000;
const rateLimitMax = 10;
const requestsByIp = new Map();
let emailQueue = Promise.resolve();
let lastEmailSentAt = 0;
const emailIntervalMs = 1100;

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

function getAllowedOrigins(env) {
  const origins = new Set(
    (env.CORS_ORIGINS || 'http://localhost:5173,http://127.0.0.1:5173')
      .split(',')
      .map((origin) => origin.trim())
      .filter(Boolean),
  );

  for (const host of [env.VERCEL_URL, env.VERCEL_PROJECT_PRODUCTION_URL]) {
    if (host) origins.add(host.startsWith('http') ? host : `https://${host}`);
  }
  if (env.EMAILJS_SOURCE_ORIGIN) origins.add(env.EMAILJS_SOURCE_ORIGIN);
  return origins;
}

function takeRateLimit(ip) {
  const now = Date.now();
  const entry = requestsByIp.get(ip);

  if (!entry || now - entry.startedAt >= rateLimitWindowMs) {
    requestsByIp.set(ip, { startedAt: now, count: 1 });
    return true;
  }
  if (entry.count >= rateLimitMax) return false;

  entry.count += 1;
  if (requestsByIp.size > 5000) {
    for (const [key, value] of requestsByIp) {
      if (now - value.startedAt >= rateLimitWindowMs) requestsByIp.delete(key);
    }
  }
  return true;
}

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
      const errorText = await response.text().catch(() => 'EmailJS request failed');
      console.error('EmailJS request failed:', response.status, errorText);
      throw new Error(`EmailJS request failed (${response.status})`);
    }
  });

  emailQueue = sendTask.catch(() => undefined);
  return sendTask;
}

export async function handleCheckout(body, { env = process.env, origin = '', ip = 'unknown' } = {}) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return { status: 400, body: { error: 'Invalid order data.' } };
  }

  const allowedOrigins = getAllowedOrigins(env);
  if (origin && !allowedOrigins.has(origin)) {
    return { status: 403, body: { error: 'Origin is not allowed.' } };
  }
  if (!takeRateLimit(ip)) {
    return { status: 429, body: { error: 'Too many order requests. Please try again later.' } };
  }

  const honeypot = cleanText(body.website ?? '', 200);
  if (honeypot === null) return { status: 400, body: { error: 'Invalid order data.' } };
  if (honeypot) return { status: 200, body: { success: true, confirmationEmailSent: false } };

  const name = cleanText(body.name, 100);
  const phone = cleanText(body.phone, 30);
  const address = cleanText(body.address ?? '', 300);
  const customerEmail = cleanText(body.customerEmail ?? '', 254);
  const paymentMethod = body.paymentMethod;
  const requestedItems = body.items;

  if (name === null || phone === null || address === null || customerEmail === null) {
    return { status: 400, body: { error: 'One or more order fields are invalid.' } };
  }
  const phoneDigits = phone.replace(/\D/g, '');
  if (!/^[0-9 +()\-]+$/.test(phone) || phoneDigits.length < 9 || phoneDigits.length > 15) {
    return { status: 400, body: { error: 'Enter a valid phone number.' } };
  }
  if (customerEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)) {
    return { status: 400, body: { error: 'Enter a valid email address.' } };
  }
  if (!Object.hasOwn(paymentLabels, paymentMethod)) {
    return { status: 400, body: { error: 'Select a valid payment method.' } };
  }
  if (!Array.isArray(requestedItems) || requestedItems.length === 0 || requestedItems.length > 50) {
    return { status: 400, body: { error: 'The cart is empty or contains too many products.' } };
  }

  const itemIds = [];
  const quantitiesById = new Map();
  for (const item of requestedItems) {
    if (!item || typeof item !== 'object' || Array.isArray(item)) {
      return { status: 400, body: { error: 'Invalid cart item.' } };
    }
    const id = cleanText(item.id, 128);
    const quantity = item.quantity;
    if (!id || !/^[A-Za-z0-9._-]+$/.test(id) || !Number.isInteger(quantity) || quantity < 1 || quantity > 99) {
      return { status: 400, body: { error: 'Invalid cart item.' } };
    }
    if (quantitiesById.has(id)) return { status: 400, body: { error: 'Duplicate cart item.' } };
    itemIds.push(id);
    quantitiesById.set(id, quantity);
  }

  const config = {
    serviceId: env.EMAILJS_SERVICE_ID || env.VITE_EMAILJS_SERVICE_ID,
    adminTemplateId: env.EMAILJS_ADMIN_TEMPLATE_ID || env.VITE_EMAILJS_TEMPLATE_ID || env.VITE_EMAILJS_ADMIN_TEMPLATE_ID,
    clientTemplateId: env.EMAILJS_CLIENT_TEMPLATE_ID || env.VITE_EMAILJS_CLIENT_TEMPLATE_ID || 'template_nn77thc',
    publicKey: env.EMAILJS_PUBLIC_KEY || env.VITE_EMAILJS_PUBLIC_KEY,
    privateKey: env.EMAILJS_PRIVATE_KEY,
    adminEmail: env.EMAILJS_ADMIN_EMAIL || env.VITE_EMAILJS_ADMIN_EMAIL || 'kunica108@gmail.com',
    sourceOrigin: origin || env.EMAILJS_SOURCE_ORIGIN || [...allowedOrigins][0],
  };
  if ([config.serviceId, config.adminTemplateId, config.clientTemplateId, config.publicKey, config.adminEmail, config.sourceOrigin].some((value) => !value)) {
    console.error('EmailJS server configuration is incomplete.');
    return { status: 503, body: { error: 'Order email service is not configured.' } };
  }

  try {
    const sanityClient = createClient({
      projectId: env.SANITY_PROJECT_ID || 'bz8msak0',
      dataset: env.SANITY_DATASET || 'production',
      apiVersion: '2023-05-03',
      useCdn: true,
    });
    const products = await sanityClient.fetch(
      '*[_type == "product" && _id in $ids]{ _id, name, price, discount }',
      { ids: itemIds },
    );
    if (!Array.isArray(products) || products.length !== itemIds.length) {
      return { status: 400, body: { error: 'One or more products are no longer available.' } };
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
        await sendEmailJs(config.clientTemplateId, {
          ...templateParams,
          to_email: customerEmail,
          user_email: customerEmail,
        }, config);
        confirmationEmailSent = true;
      } catch (error) {
        console.error('Customer confirmation email could not be sent.');
      }
    }

    return { status: 200, body: { success: true, confirmationEmailSent } };
  } catch (error) {
    console.error('Order processing failed:', error instanceof Error ? error.message : 'Unknown error');
    return { status: 502, body: { error: 'The order could not be sent. Please try again later.' } };
  }
}
