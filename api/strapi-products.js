/**
 * Server-side proxy: adds Strapi API token from env (never exposed to the browser).
 * GET /api/strapi-products?<same query as Strapi /api/products>
 */
module.exports = async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.status(405).setHeader('Allow', 'GET, HEAD').json({
      data: null,
      error: { status: 405, name: 'MethodNotAllowed', message: 'Method Not Allowed' },
    });
    return;
  }

  const base = process.env.STRAPI_URL && String(process.env.STRAPI_URL).replace(/\/$/, '');
  const token = process.env.STRAPI_API_TOKEN;

  if (!base || !token) {
    res.status(500).json({
      data: null,
      error: {
        status: 500,
        name: 'ConfigurationError',
        message: 'Missing STRAPI_URL or STRAPI_API_TOKEN on the server',
      },
    });
    return;
  }

  try {
    const host = req.headers.host || 'localhost';
    const incoming = new URL(req.url || '/', `http://${host}`);
    const forwardQs = incoming.search || '';
    const targetUrl = `${base}/api/products${forwardQs}`;

    const upstream = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    });

    const text = await upstream.text();
    const ct = upstream.headers.get('content-type') || 'application/json';
    res.status(upstream.status).setHeader('Content-Type', ct).send(text);
  } catch (err) {
    console.error('[strapi-products proxy]', err);
    res.status(502).json({
      data: null,
      error: {
        status: 502,
        name: 'BadGateway',
        message: 'Upstream Strapi request failed',
      },
    });
  }
};
