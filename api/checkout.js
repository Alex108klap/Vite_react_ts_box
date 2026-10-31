import { handleCheckout } from '../checkout-handler.js';

export default async function checkout(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch {
      return res.status(400).json({ error: 'Invalid JSON.' });
    }
  }

  const result = await handleCheckout(body, {
    env: process.env,
    origin: req.headers.origin || '',
    ip: req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket.remoteAddress || 'unknown',
  });
  return res.status(result.status).json(result.body);
}
