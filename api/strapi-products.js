const { proxyStrapiProducts } = require("../lib/strapi-products-proxy");

module.exports = async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.status(405).setHeader('Allow', 'GET, HEAD').json({
      data: null,
      error: { status: 405, name: 'MethodNotAllowed', message: 'Method Not Allowed' },
    });
    return;
  }

  const upstream = await proxyStrapiProducts({
    host: req.headers.host,
    method: req.method,
    url: req.url,
  });

  res.status(upstream.status);

  Object.entries(upstream.headers).forEach(([key, value]) => {
    res.setHeader(key, value);
  });

  if (req.method === 'HEAD') {
    res.end();
    return;
  }

  res.send(upstream.body);
};
