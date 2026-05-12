export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const PIXEL_ID = '1348713502744731';
  const TOKEN    = process.env.META_CAPI_TOKEN;

  if (!TOKEN) {
    return res.status(500).json({ error: 'Token not configured' });
  }

  try {
    const response = await fetch(
      `https://graph.facebook.com/v19.0/${PIXEL_ID}/events?access_token=${TOKEN}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req.body)
      }
    );
    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to send event' });
  }
}
