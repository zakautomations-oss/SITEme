import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, resolve, sep } from "node:path";
import { pathToFileURL } from "node:url";
import { promisify } from "node:util";
import { brotliCompress, constants, gzip } from "node:zlib";
import { canonicalPath } from "../src/config/routes.js";

const MIME = { ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript", ".svg": "image/svg+xml", ".png": "image/png", ".webp": "image/webp", ".avif": "image/avif", ".xml": "application/xml", ".txt": "text/plain", ".woff2": "font/woff2" };
const brotli = promisify(brotliCompress);
const compressGzip = promisify(gzip);

// Serve the generated site with clean URLs and real 404s for local review.
// API forwarding is explicit and optional; it never defaults to production.
export function createPreviewServer({ directory = resolve("dist"), apiOrigin = process.env.API_ORIGIN } = {}) {
  return createServer(async (request, response) => {
    const url = new URL(request.url, "http://localhost");
    let pathname;
    try { pathname = decodeURIComponent(url.pathname); } catch { response.writeHead(400).end("Bad request"); return; }
    response.setHeader("X-Content-Type-Options", "nosniff");
    response.setHeader("X-Frame-Options", "DENY");
    response.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
    if (pathname === "/api" || pathname.startsWith("/api/")) {
      if (!apiOrigin) {
        response.writeHead(503, { "Content-Type": "application/json", "Cache-Control": "no-store" }).end(JSON.stringify({ detail: "Local API is not running. Set API_ORIGIN to the local backend URL." }));
        return;
      }
      try {
        const upstream = await fetch(new URL(url.pathname + url.search, apiOrigin), {
          method: request.method,
          headers: { ...request.headers, host: new URL(apiOrigin).host },
          body: ["GET", "HEAD"].includes(request.method) ? undefined : request,
          duplex: "half",
          signal: AbortSignal.timeout(15000),
        });
        response.writeHead(upstream.status, Object.fromEntries([...upstream.headers].filter(([name]) => !["content-encoding", "content-length", "transfer-encoding"].includes(name))));
        response.end(Buffer.from(await upstream.arrayBuffer()));
      } catch {
        response.writeHead(502, { "Content-Type": "application/json", "Cache-Control": "no-store" }).end(JSON.stringify({ detail: "Local API is unavailable." }));
      }
      return;
    }
    if (!["GET", "HEAD"].includes(request.method)) {
      response.writeHead(405, { Allow: "GET, HEAD" }).end();
      return;
    }
    const cleanPath = pathname === "/index.html" ? "/" : pathname.replace(/\.html$/, "");
    const canonical = canonicalPath(cleanPath);
    if (canonical && pathname !== canonical) {
      response.writeHead(308, { Location: canonical + url.search }).end();
      return;
    }
    if (pathname !== "/" && pathname.endsWith("/")) {
      response.writeHead(308, { Location: pathname.replace(/\/+$/, "") + url.search }).end();
      return;
    }
    const relativeFile = canonical === "/" ? "index.html" : canonical ? `${canonical.slice(1)}.html` : pathname.slice(1);
    const file = resolve(directory, relativeFile);
    const safePath = file.startsWith(directory + sep);
    let exists = false;
    if (safePath) {
      try { exists = (await stat(file)).isFile(); } catch { /* Missing resources are 404s. */ }
    }
    const status = exists ? 200 : 404;
    const body = await readFile(exists ? file : resolve(directory, "404.html"));
    const contentType = MIME[extname(exists ? file : "404.html")] || "application/octet-stream";
    const compressible = /^(text\/|application\/xml|image\/svg\+xml)/.test(contentType);
    let encoding;
    let payload = body;
    if (compressible && body.length > 1024) {
      const accepted = new Map((request.headers["accept-encoding"] || "").split(",").map((part) => {
        const [name, quality = "q=1"] = part.trim().split(/;\s*/);
        return [name, Number(quality.replace("q=", ""))];
      }));
      if (accepted.get("br") > 0) {
        encoding = "br";
        payload = await brotli(body, { params: { [constants.BROTLI_PARAM_QUALITY]: 4 } });
      } else if (accepted.get("gzip") > 0) {
        encoding = "gzip";
        payload = await compressGzip(body);
      }
    }
    response.writeHead(status, {
      "Content-Type": contentType,
      "Content-Length": payload.length,
      "Cache-Control": status === 404 || canonical === "/admin" ? "no-store" : pathname.startsWith("/assets/") ? "public, max-age=31536000, immutable" : "no-cache",
      ...(compressible ? { Vary: "Accept-Encoding" } : {}),
      ...(encoding ? { "Content-Encoding": encoding } : {}),
      ...((canonical === "/admin" || status === 404) ? { "X-Robots-Tag": "noindex, nofollow" } : {}),
    });
    response.end(request.method === "HEAD" ? undefined : payload);
  });
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const portFlag = process.argv.indexOf("--port");
  const port = Number(portFlag >= 0 ? process.argv[portFlag + 1] : process.env.PORT || 4173);
  createPreviewServer().listen(port, "127.0.0.1", () => console.log(`Preview: http://127.0.0.1:${port}`));
}
