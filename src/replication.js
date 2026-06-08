const http = require("http");

function replicate(peers, key, value, version) {
  for (const peer of peers) {
    const payload = JSON.stringify({ key, value, version });
    const options = {
      hostname: peer.host,
      port: peer.port,
      path: "/replicate",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(payload),
      },
    };

    const req = http.request(options, (res) => {
      res.resume();
    });

    req.on("error", () => {});
    req.write(payload);
    req.end();
  }
}

function syncFromPeer(peer, store) {
  return new Promise((resolve) => {
    const options = {
      hostname: peer.host,
      port: peer.port,
      path: "/sync",
      method: "GET",
    };

    const req = http.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try {
          const incoming = JSON.parse(data);
          store.merge(incoming);
          resolve(true);
        } catch {
          resolve(false);
        }
      });
    });

    req.on("error", () => resolve(false));
    req.end();
  });
}

module.exports = { replicate, syncFromPeer };