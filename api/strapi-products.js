export default async function handler(req, res) {
    const STRAPI_URL = process.env.STRAPI_URL;
    const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

    const query = req.url.split('?')[1] || '';
    const strapiEndpoint = `${STRAPI_URL}/api/products?${query}`;

    try {
        const response = await fetch(strapiEndpoint, {
            headers: {
                'Authorization': `Bearer ${STRAPI_API_TOKEN}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            return res.status(response.status).json({ error: 'Strapi error' });
        }

        const data = await response.json();
        res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate');
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
