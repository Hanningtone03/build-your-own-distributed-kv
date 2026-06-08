const { KVNode } = require("./node");

const args = process.argv.slice(2);
const port = parseInt(args[0]) || 4001;

const allPorts = [4001, 4002, 4003];
const peers = allPorts
  .filter((p) => p !== port)
  .map((p) => ({ host: "127.0.0.1", port: p }));

const node = new KVNode(port, peers);
node.start();

console.log(`Starting KV node on port ${port} with peers: ${peers.map(p => p.port).join(", ")}`);