import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure data directory exists
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
}

const db = new Database(path.join(dataDir, 'database.sqlite'));
db.pragma('journal_mode = WAL');

// Initialize database schema
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS profiles (
    user_id INTEGER PRIMARY KEY,
    name TEXT,
    phone TEXT,
    bio TEXT,
    age INTEGER,
    gender TEXT,
    occupation TEXT,
    location_city TEXT,
    location_society TEXT,
    interests TEXT, -- Stored as JSON array string
    privacy_settings TEXT, -- Stored as JSON object string
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
  );
`);

export default db;
