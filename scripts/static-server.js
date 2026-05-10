const http = require("http");
const fs = require("fs");
const path = require("path");
const { proxyStrapiProducts } = require("../lib/strapi-products-proxy");

const rootDir = path.resolve(__dirname, "..");
const port = Number(process.env.PORT || 3000);

const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".gif": "image/gif",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".webp": "image/webp",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

function send(res, statusCode, headers, body) {
  res.writeHead(statusCode, headers);
  res.end(body);
}

function loadLocalEnv() {
  const envPath = path.join(rootDir, ".env.local");

  if (!fs.existsSync(envPath)) {
    return;
  }

  const source = fs.readFileSync(envPath, "utf8");
  const lines = source.split(/\r?\n/);

  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const separatorIndex = trimmed.indexOf("=");

    if (separatorIndex === -1) {
      continue;
    }

    const key = trimmed.slice(0, separatorIndex).trim();
    let value = trimmed.slice(separatorIndex + 1).trim();

    if (!key || process.env[key]) {
      continue;
    }

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    process.env[key] = value;
  }
}

function resolveRequestPath(urlPath) {
  const decodedPath = decodeURIComponent(urlPath.split("?")[0]);
  const safePath = path.normalize(decodedPath).replace(/^(\.\.[/\\])+/, "");
  const relativePath = safePath === "/" ? "/index.html" : safePath;

  const candidates = [relativePath];

  if (!path.extname(relativePath) && !relativePath.endsWith("/")) {
    candidates.push(`${relativePath}.html`);
    candidates.push(path.join(relativePath, "index.html"));
  }

  if (relativePath.endsWith("/")) {
    candidates.push(path.join(relativePath, "index.html"));
  }

  for (const candidate of candidates) {
    const absolutePath = path.resolve(rootDir, `.${candidate}`);

    if (!absolutePath.startsWith(rootDir)) {
      continue;
    }

    if (fs.existsSync(absolutePath) && fs.statSync(absolutePath).isFile()) {
      return absolutePath;
    }
  }

  return path.join(rootDir, "index.html");
}

async function handleStrapiProxy(req, res) {
  const upstream = await proxyStrapiProducts({
    host: req.headers.host,
    method: req.method,
    url: req.url,
  });

  const headers = { ...upstream.headers };

  if (req.method !== "HEAD") {
    headers["Content-Length"] = Buffer.byteLength(upstream.body);
  }

  send(res, upstream.status, headers, req.method === "HEAD" ? "" : upstream.body);
}

loadLocalEnv();

const server = http.createServer((req, res) => {
  if (!req.url) {
    send(res, 400, { "Content-Type": "text/plain; charset=utf-8" }, "Bad Request");
    return;
  }

  if (req.method !== "GET" && req.method !== "HEAD") {
    send(res, 405, { "Content-Type": "text/plain; charset=utf-8" }, "Method Not Allowed");
    return;
  }

  const pathname = new URL(req.url, "http://localhost").pathname;

  if (pathname === "/api/strapi-products") {
    handleStrapiProxy(req, res);
    return;
  }

  const filePath = resolveRequestPath(req.url);

  fs.readFile(filePath, (error, data) => {
    if (error) {
      send(res, 500, { "Content-Type": "text/plain; charset=utf-8" }, "Internal Server Error");
      return;
    }

    const extension = path.extname(filePath).toLowerCase();
    const contentType = contentTypes[extension] || "application/octet-stream";
    const headers = {
      "Content-Length": data.length,
      "Content-Type": contentType,
    };

    if (req.method === "HEAD") {
      res.writeHead(200, headers);
      res.end();
      return;
    }

    send(res, 200, headers, data);
  });
});

server.listen(port, () => {
  console.log(`Dev server listening on http://localhost:${port}`);
});
