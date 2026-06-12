![CI](https://github.com/Hanningtone03/build-your-own-distributed-kv/actions/workflows/ci.yml/badge.svg)

# Build Your Own Distributed KV Store

A distributed key-value store in Node.js; write to one node, read from any.

## How it works

Each node runs an HTTP server. Writes replicate immediately to all peers. New nodes sync state on startup. Version numbers handle out-of-order updates.

Extends the concepts from [build-your-own-redis](https://github.com/Hanningtone03/build-your-own-redis); start there for the single-node foundation.

## Project structure

```
src/
├── cluster.js
├── node.js
├── store.js
├── replication.js
└── http.js
```

## Running locally

```bash
node src/cluster.js 4001
node src/cluster.js 4002
node src/cluster.js 4003
```

```bash
curl -X POST http://localhost:4001/set/name -d '{"value":"Hanningtone"}' -H "Content-Type: application/json"
curl http://localhost:4002/get/name
```

## Tech

- Node.js
- `http` module
- No external dependencies
