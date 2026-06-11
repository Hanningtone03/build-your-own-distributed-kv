# Build Your Own Distributed KV Store

A distributed key-value store built from scratch in Node.js; data written to one node replicates automatically across all nodes in the cluster.

## How it works

Distributed databases replicate data across multiple nodes so there is no single point of failure. This project implements that from scratch:

- Each node runs an HTTP server that accepts read and write requests
- Writes are replicated immediately to all peer nodes
- New nodes sync their state from peers on startup
- Version numbers resolve conflicts when nodes receive out-of-order updates
- Each node tracks its peers and replicates independently

Extends the concepts from [build-your-own-redis](https://github.com/Hanningtone03/build-your-own-redis); start there to understand the single-node foundation.

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

Start three nodes in separate terminals:

```bash
node src/cluster.js 4001
node src/cluster.js 4002
node src/cluster.js 4003
```

Write to one node:

```bash
curl -X POST http://localhost:4001/set/name -d '{"value":"Hanningtone"}' -H "Content-Type: application/json"
```

Read from another:

```bash
curl http://localhost:4002/get/name
curl http://localhost:4003/get/name
```

Check cluster status:

```bash
curl http://localhost:4001/status
```

## API

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/set/:key` | Write a value |
| GET | `/get/:key` | Read a value |
| DELETE | `/delete/:key` | Delete a key |
| GET | `/status` | Node status |
| GET | `/sync` | Full state dump |

## Tech

- Node.js
- `http` module
- No external dependencies
