const http = require("http");
const { replicate } = require("./replication");

function createHttpServer(store, peers, port) {
  const server = http.createServer((req, res) => {
    const url = new URL(req.url, `http://localhost:${port}`);
    const key = url.pathname.replace("/", "").split("/")[1];

    res.setHeader("Content-Type", "application/json");

    if (req.method === "GET" && url.pathname.startsWith("/get/")) {
      const entry = store.get(key);
      if (!entry) {
        res.writeHead(404);
        res.end(JSON.stringify({ error: "Key not found" }));
      } else {
        res.writeHead(200);
        res.end(JSON.stringify(entry));
      }
      return;
    }

    if (req.method === "POST" && url.pathname.startsWith("/set/")) {
      let body = "";
      req.on("data", (chunk) => (body += chunk));
      req.on("end", () => {
        const { value } = JSON.parse(body);
        const entry = store.set(key, value);
        replicate(peers, key, value, entry.version);
        res.writeHead(200);
        res.end(JSON.stringify(entry));
      });
      return;
    }

    if (req.method === "DELETE" && url.pathname.startsWith("/delete/")) {
      const deleted = store.delete(key);
      res.writeHead(deleted ? 200 : 404);
      res.end(JSON.stringify({ deleted }));
      return;
    }

    if (req.method === "POST" && url.pathname === "/replicate") {
      let body = "";
      req.on("data", (chunk) => (body += chunk));
      req.on("end", () => {
        const { key, value, version } = JSON.parse(body);
        const existing = store.get(key);
        if (!existing || version > existing.version) {
          store.set(key, value);
        }
        res.writeHead(200);
        res.end(JSON.stringify({ ok: true }));
      });
      return;
    }

    if (req.method === "GET" && url.pathname === "/sync") {
      res.writeHead(200);
      res.end(JSON.stringify(store.getAll()));
      return;
    }

    if (req.method === "GET" && url.pathname === "/status") {
      res.writeHead(200);
      res.end(JSON.stringify({
        version: store.getVersion(),
        keys: Object.keys(store.getAll()).length,
        peers: peers.length,
      }));
      return;
    }

    res.writeHead(404);
    res.end(JSON.stringify({ error: "Not found" }));
  });

  server.listen(port, () => {
    console.log(`Node listening on port ${port}`);
  });

  return server;
}

module.exports = { createHttpServer };