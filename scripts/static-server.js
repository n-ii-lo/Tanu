const path = require("path");
const http = require("http");
const fs = require("fs");

// Що віддаємо: за замовчуванням корінь репозиторію,
// або папку з аргументу — `node scripts/static-server.js dist`
const rootDir = process.argv[2]
  ? path.resolve(process.cwd(), process.argv[2])
  : path.resolve(__dirname, "..");
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

const server = http.createServer((req, res) => {
  if (!req.url) {
    send(res, 400, { "Content-Type": "text/plain; charset=utf-8" }, "Bad Request");
    return;
  }

  if (req.method !== "GET" && req.method !== "HEAD") {
    send(res, 405, { "Content-Type": "text/plain; charset=utf-8" }, "Method Not Allowed");
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
