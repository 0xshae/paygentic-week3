import Database, { type Database as DatabaseType } from "better-sqlite3";
import path from "path";

const DB_PATH = path.resolve(process.cwd(), "agentic_checkout.db");

const db: DatabaseType = new Database(DB_PATH);

// ── WAL mode for concurrent reads ───────────────────
db.pragma("journal_mode = WAL");

// ── Nullifier tracking (World ID Sybil Shield) ──────
db.exec(`
  CREATE TABLE IF NOT EXISTS nullifier_usage (
    nullifier_hash TEXT PRIMARY KEY,
    used_at        INTEGER NOT NULL
  );
`);

// ── Transaction log (for /revoke + audit) ───────────
db.exec(`
  CREATE TABLE IF NOT EXISTS transactions (
    short_code      TEXT PRIMARY KEY,
    nullifier_hash  TEXT,
    amount          TEXT NOT NULL,
    currency        TEXT NOT NULL DEFAULT 'USDC',
    status          TEXT NOT NULL DEFAULT 'SETTLED',
    agent_id        TEXT,
    created_at      INTEGER NOT NULL,
    revoked         INTEGER NOT NULL DEFAULT 0
  );
`);

// ── Nullifier helpers ───────────────────────────────

const _hasNullifier = db.prepare(
  "SELECT 1 FROM nullifier_usage WHERE nullifier_hash = ?"
);

const _insertNullifier = db.prepare(
  "INSERT OR IGNORE INTO nullifier_usage (nullifier_hash, used_at) VALUES (?, ?)"
);

export function hasNullifier(hash: string): boolean {
  return !!_hasNullifier.get(hash);
}

export function markNullifier(hash: string): void {
  _insertNullifier.run(hash, Date.now());
}

// ── Transaction helpers ─────────────────────────────

const _insertTx = db.prepare(`
  INSERT INTO transactions (short_code, nullifier_hash, amount, currency, status, agent_id, created_at)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`);

const _getTx = db.prepare("SELECT * FROM transactions WHERE short_code = ?");

const _revokeTx = db.prepare(
  "UPDATE transactions SET status = 'REVOKED', revoked = 1 WHERE short_code = ? AND revoked = 0"
);

export interface TransactionRecord {
  short_code: string;
  nullifier_hash: string | null;
  amount: string;
  currency: string;
  status: string;
  agent_id: string | null;
  created_at: number;
  revoked: number;
}

export function insertTransaction(tx: {
  shortCode: string;
  nullifierHash: string | null;
  amount: string;
  agentId: string | null;
}): void {
  _insertTx.run(
    tx.shortCode,
    tx.nullifierHash,
    tx.amount,
    "USDC",
    "SETTLED",
    tx.agentId,
    Date.now()
  );
}

export function getTransaction(shortCode: string): TransactionRecord | undefined {
  return _getTx.get(shortCode) as TransactionRecord | undefined;
}

export function revokeTransaction(shortCode: string): boolean {
  const result = _revokeTx.run(shortCode);
  return result.changes > 0;
}

export default db;
