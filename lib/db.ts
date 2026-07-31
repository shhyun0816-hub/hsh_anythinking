import Database from "better-sqlite3";
import fs from "fs";
import path from "path";

// Vercel's serverless filesystem is read-only outside /tmp; fall back to it
// there. Data written to /tmp doesn't persist across deploys/cold starts.
const dataDir = process.env.VERCEL
  ? "/tmp"
  : path.join(process.cwd(), "data");
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

declare global {
  // eslint-disable-next-line no-var
  var __db: Database.Database | undefined;
}

const db = global.__db ?? new Database(path.join(dataDir, "app.db"));
if (process.env.NODE_ENV !== "production") {
  global.__db = db;
}

db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

db.exec(`
  CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    author_name TEXT NOT NULL,
    author_email TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    heart INTEGER NOT NULL DEFAULT 0,
    joy INTEGER NOT NULL DEFAULT 0,
    sad INTEGER NOT NULL DEFAULT 0,
    thumbs_up INTEGER NOT NULL DEFAULT 0,
    thumbs_down INTEGER NOT NULL DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    post_id INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    author_name TEXT NOT NULL,
    author_email TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE INDEX IF NOT EXISTS idx_comments_post_id ON comments(post_id);
`);

export type { Reaction, Post, Comment } from "@/lib/types";
export { REACTIONS } from "@/lib/types";

export default db;
