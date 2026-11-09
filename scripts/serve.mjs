import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";

const root = fileURLToPath(new URL("../", import.meta.url));
const port = Number(process.env.PORT || 5174);
const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".ico": "image/x-icon",
  ".pdf": "application/pdf",
};

const server = http.createServer(async (request, response) => {
  if (!["GET", "HEAD"].includes(request.method)) {
    response.writeHead(405, { Allow: "GET, HEAD" });
    response.end("Method not allowed");
    return;
  }
  try {
    const pathname = decodeURIComponent(new URL(request.url, "http://localhost").pathname);
    const relative = pathname === "/" ? "index.html" : pathname.replace(/^\/+/, "");
    const target = path.resolve(root, relative);
    const withinRoot = path.relative(root, target);
    if (withinRoot.startsWith("..") || path.isAbsolute(withinRoot) || relative.split(/[\\/]/).some((part) => part.startsWith("."))) {
      response.writeHead(403);
      response.end("Forbidden");
      return;
    }
    const extension = path.extname(target).toLowerCase();
    const info = await stat(target);
    if (!info.isFile() || !types[extension]) {
      response.writeHead(404);
      response.end("Not found");
      return;
    }
    response.writeHead(200, { "Content-Type": types[extension], "Content-Length": info.size, "Cache-Control": "no-store" });
    if (request.method === "HEAD") response.end();
    else createReadStream(target).pipe(response);
  } catch (error) {
    response.writeHead(error instanceof URIError ? 400 : 404);
    response.end(error instanceof URIError ? "Bad request" : "Not found");
  }
});
server.on("error", (error) => {
  console.error(error.code === "EADDRINUSE" ? `Port ${port} is already in use. Set PORT to another number and try again.` : error.message);
  process.exitCode = 1;
});
server.listen(port, "127.0.0.1", () => {
  console.log(`Academic homepage: http://localhost:${port}`);
  console.log("Edit site.config.js, save, and refresh the browser. Press Ctrl+C to stop.");
});
