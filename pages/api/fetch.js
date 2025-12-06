const fetch = require('node-fetch');

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { url } = req.body || {};
  if (!url || typeof url !== 'string') return res.status(400).json({ error: 'Missing url' });

  try {
    if (!url.startsWith('http')) throw new Error('Invalid url');
    const extractorEndpoint = process.env.EXTRACTOR_ENDPOINT;
    if (!extractorEndpoint) {
      return res.status(500).json({ error: 'Extractor not configured. Set EXTRACTOR_ENDPOINT in environment.' });
    }
    const r = await fetch(extractorEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url })
    });
    if (!r.ok) throw new Error(`Extractor error: ${r.status}`);
    const payload = await r.json();
    return res.status(200).json(payload);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
}
