function errorPayload(status, name, message) {
  return JSON.stringify({
    data: null,
    error: { status, name, message },
  });
}

async function proxyStrapiProducts({ host, method, url }) {
  const base = process.env.STRAPI_URL && String(process.env.STRAPI_URL).replace(/\/$/, "");
  const token = process.env.STRAPI_API_TOKEN;

  if (!base || !token) {
    return {
      status: 500,
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: errorPayload(
        500,
        "ConfigurationError",
        "Missing STRAPI_URL or STRAPI_API_TOKEN on the server"
      ),
    };
  }

  try {
    const incoming = new URL(url || "/", `http://${host || "localhost"}`);
    const targetUrl = `${base}/api/products${incoming.search || ""}`;
    const upstream = await fetch(targetUrl, {
      method: method === "HEAD" ? "HEAD" : "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });

    return {
      status: upstream.status,
      headers: {
        "Content-Type": upstream.headers.get("content-type") || "application/json; charset=utf-8",
      },
      body: method === "HEAD" ? "" : await upstream.text(),
    };
  } catch (error) {
    console.error("[strapi-products proxy]", error);

    return {
      status: 502,
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: errorPayload(502, "BadGateway", "Upstream Strapi request failed"),
    };
  }
}

module.exports = {
  proxyStrapiProducts,
};
