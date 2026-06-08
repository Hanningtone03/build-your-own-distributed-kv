class Store {
  constructor() {
    this.data = {};
    this.version = 0;
  }

  set(key, value) {
    this.data[key] = { value, version: ++this.version, timestamp: Date.now() };
    return this.data[key];
  }

  get(key) {
    return this.data[key] || null;
  }

  delete(key) {
    if (this.data[key]) {
      delete this.data[key];
      this.version++;
      return true;
    }
    return false;
  }

  getAll() {
    return this.data;
  }

  getVersion() {
    return this.version;
  }

  merge(incoming) {
    for (const [key, entry] of Object.entries(incoming)) {
      if (!this.data[key] || entry.version > this.data[key].version) {
        this.data[key] = entry;
        if (entry.version > this.version) {
          this.version = entry.version;
        }
      }
    }
  }
}

module.exports = { Store };