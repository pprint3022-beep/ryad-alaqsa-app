// Storage abstraction layer: JSON file (prototype) ↔ PostgreSQL (production)
// Provides a unified interface for data access, enabling migration without changing business logic.

const fs = require('fs');
const path = require('path');

const DATA_PATH = path.join(__dirname, 'data.json');

class JsonStorage {
  constructor() { this.path = DATA_PATH; }
  load() { return JSON.parse(fs.readFileSync(this.path, 'utf8')); }
  save(db) { fs.writeFileSync(this.path, JSON.stringify(db, null, 2), 'utf8'); }
  type() { return 'json_file'; }
}

// PostgreSQL adapter (production) — to be activated with pg module
// Usage: set STORAGE_TYPE=postgres and DATABASE_URL in environment
class PostgresStorage {
  constructor() {
    this.type = 'postgres';
    this.client = null;
    // In production: const { Pool } = require('pg'); this.pool = new Pool({ connectionString: process.env.DATABASE_URL });
  }
  async connect() {
    // In production: await this.pool.connect();
    throw new Error('PostgreSQL adapter not yet activated. Install pg module and set DATABASE_URL.');
  }
  async load() { throw new Error('PostgreSQL adapter not yet activated.'); }
  async save() { throw new Error('PostgreSQL adapter not yet activated.'); }
  type() { return 'postgres'; }
}

function createStorage() {
  const type = process.env.STORAGE_TYPE || 'json';
  if (type === 'postgres') return new PostgresStorage();
  return new JsonStorage();
}

module.exports = { createStorage, JsonStorage, PostgresStorage };
