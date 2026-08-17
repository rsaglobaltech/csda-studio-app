import { createServer } from "node:http";
import type { Server } from "node:http";
import { createReadStream, existsSync, statSync } from "node:fs";
import { extname, join, normalize, resolve } from "node:path";

const MIME: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
};

/**
 * The plainest static file server that can exist.
 *
 * REQ-015 says a *plain static file server* must serve the build unchanged.
 * Testing that against a dev server with its own middleware would prove
 * nothing, so this deliberately does no rewriting, no SPA fallback and no
 * compression — if the build needs any of that, the requirement is not met.
 */
export function serveStatic(rootDir: string): Promise<{ server: Server; origin: string }> {
  const root = resolve(rootDir);

  const server = createServer((req, res) => {
    const requested = decodeURIComponent((req.url ?? "/").split("?")[0]);
    const relative = normalize(requested).replace(/^(\.\.[/\\])+/, "");
    let filePath = join(root, relative === "/" ? "index.html" : relative);

    // Never serve outside the build directory, whatever the request says.
    if (!resolve(filePath).startsWith(root)) {
      res.writeHead(403).end();
      return;
    }
    if (existsSync(filePath) && statSync(filePath).isDirectory()) {
      filePath = join(filePath, "index.html");
    }
    if (!existsSync(filePath)) {
      res.writeHead(404, { "content-type": "text/plain" }).end("Not Found");
      return;
    }
    res.writeHead(200, { "content-type": MIME[extname(filePath)] ?? "application/octet-stream" });
    createReadStream(filePath).pipe(res);
  });

  return new Promise((resolvePromise) => {
    // Port 0 lets the OS pick a free one, so parallel runs never collide.
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      if (address === null || typeof address === "string") {
        throw new Error("static server did not bind to a TCP port");
      }
      resolvePromise({ server, origin: `http://127.0.0.1:${address.port}` });
    });
  });
}
