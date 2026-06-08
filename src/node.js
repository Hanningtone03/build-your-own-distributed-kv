const { Store } = require("./store");
const { createHttpServer } = require("./http");
const { syncFromPeer } = require("./replication");

class KVNode {
  constructor(port, peers = []) {
    this.port = port;
    this.peers = peers;
    this.store = new Store();
  }

  async start() {
    createHttpServer(this.store, this.peers, this.port);
    setTimeout(async () => {
      for (const peer of this.peers) {
        const synced = await syncFromPeer(peer, this.store);
        if (synced) {
          console.log(`Synced from ${peer.host}:${peer.port}`);
          break;
        }
      }
    }, 1000);
  }
}

module.exports = { KVNode };