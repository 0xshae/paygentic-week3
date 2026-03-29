import Database, { type Database as DatabaseType } from "better-sqlite3";
import path from "path";

const DB_PATH = path.resolve(process.cwd(), "agentic_checkout.db");

const db: DatabaseType = new Database(DB_PATH);
db.pragma("journal_mode = WAL");

// ── AgentKit usage tracking ─────────────────────────
db.exec(`
  CREATE TABLE IF NOT EXISTS agentkit_usage (
    endpoint   TEXT    NOT NULL,
    human_id   TEXT    NOT NULL,
    count      INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY (endpoint, human_id)
  );
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS agentkit_nonces (
    nonce TEXT PRIMARY KEY
  );
`);

// ── Transaction log (for /revoke + audit) ───────────
db.exec(`
  CREATE TABLE IF NOT EXISTS transactions (
    short_code      TEXT PRIMARY KEY,
    human_id        TEXT,
    amount          TEXT NOT NULL,
    currency        TEXT NOT NULL DEFAULT 'USDC',
    status          TEXT NOT NULL DEFAULT 'SETTLED',
    agent_id        TEXT,
    created_at      INTEGER NOT NULL,
    revoked         INTEGER NOT NULL DEFAULT 0
  );
`);

// ── AgentKitStorage impl (SQLite-backed) ────────────

const _getUsage = db.prepare(
  "SELECT count FROM agentkit_usage WHERE endpoint = ? AND human_id = ?"
);
const _tryIncrement = db.transaction((endpoint: string, humanId: string, limit: number) => {
  const row = _getUsage.get(endpoint, humanId) as { count: number } | undefined;
  const current = row?.count ?? 0;
  if (current >= limit) return false;
  db.prepare(`
    INSERT INTO agentkit_usage (endpoint, human_id, count)
    VALUES (?, ?, 1)
    ON CONFLICT(endpoint, human_id) DO UPDATE SET count = count + 1
  `).run(endpoint, humanId);
  return true;
});
const _hasNonce = db.prepare(
  "SELECT 1 FROM agentkit_nonces WHERE nonce = ?"
);
const _recordNonce = db.prepare(
  "INSERT OR IGNORE INTO agentkit_nonces (nonce) VALUES (?)"
);

/**
 * SQLite-backed AgentKitStorage for persistent usage tracking.
 * Implements the @worldcoin/agentkit AgentKitStorage interface.
 */
export class SqliteAgentKitStorage {
  async tryIncrementUsage(endpoint: string, humanId: string, limit: number): Promise<boolean> {
    return _tryIncrement(endpoint, humanId, limit);
  }

  async hasUsedNonce(nonce: string): Promise<boolean> {
    return !!_hasNonce.get(nonce);
  }

  async recordNonce(nonce: string): Promise<void> {
    _recordNonce.run(nonce);
  }
}

// ── Transaction helpers ─────────────────────────────

const _insertTx = db.prepare(`
  INSERT INTO transactions (short_code, human_id, amount, currency, status, agent_id, created_at)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`);

const _getTx = db.prepare("SELECT * FROM transactions WHERE short_code = ?");

const _getAllTxs = db.prepare("SELECT * FROM transactions ORDER BY created_at DESC");

const _revokeTx = db.prepare(
  "UPDATE transactions SET status = 'REVOKED', revoked = 1 WHERE short_code = ? AND revoked = 0"
);

export interface TransactionRecord {
  short_code: string;
  human_id: string | null;
  amount: string;
  currency: string;
  status: string;
  agent_id: string | null;
  created_at: number;
  revoked: number;
}

export function insertTransaction(tx: {
  shortCode: string;
  humanId: string | null;
  amount: string;
  agentId: string | null;
}): void {
  _insertTx.run(
    tx.shortCode,
    tx.humanId,
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

export function getAllTransactions(): TransactionRecord[] {
  return _getAllTxs.all() as TransactionRecord[];
}

export default db;
