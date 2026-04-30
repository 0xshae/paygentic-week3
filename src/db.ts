import Database, { type Database as DatabaseType } from "better-sqlite3";
import path from "path";

const DB_PATH = path.resolve(process.cwd(), "agentcred.db");

const db: DatabaseType = new Database(DB_PATH);
db.pragma("journal_mode = WAL");

// ── Schema ──────────────────────────────────────────

db.exec(`
  CREATE TABLE IF NOT EXISTS agents (
    wallet          TEXT PRIMARY KEY,
    stake_balance   REAL NOT NULL DEFAULT 0,
    successful_calls INTEGER NOT NULL DEFAULT 0,
    failed_calls    INTEGER NOT NULL DEFAULT 0,
    total_spent     REAL NOT NULL DEFAULT 0,
    created_at      INTEGER NOT NULL,
    updated_at      INTEGER NOT NULL
  );
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS call_log (
    id               INTEGER PRIMARY KEY AUTOINCREMENT,
    wallet           TEXT NOT NULL,
    endpoint         TEXT,
    status_code      INTEGER,
    cost             REAL,
    reputation_before REAL,
    reputation_after  REAL,
    balance_before   REAL,
    balance_after    REAL,
    created_at       INTEGER NOT NULL
  );
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS locus_sessions (
    session_id TEXT PRIMARY KEY,
    wallet     TEXT NOT NULL,
    amount     REAL NOT NULL,
    status     TEXT NOT NULL DEFAULT 'PENDING',
    created_at INTEGER NOT NULL
  );
`);

// ── Types ───────────────────────────────────────────

export interface AgentRecord {
  wallet: string;
  stake_balance: number;
  successful_calls: number;
  failed_calls: number;
  total_spent: number;
  created_at: number;
  updated_at: number;
}

export interface CallLogRecord {
  id: number;
  wallet: string;
  endpoint: string;
  status_code: number;
  cost: number;
  reputation_before: number;
  reputation_after: number;
  balance_before: number;
  balance_after: number;
  created_at: number;
}

export interface LocusSessionRecord {
  session_id: string;
  wallet: string;
  amount: number;
  status: string;
  created_at: number;
}

// ── Prepared Statements ─────────────────────────────

const _getAgent = db.prepare("SELECT * FROM agents WHERE wallet = ?");

const _upsertAgent = db.prepare(`
  INSERT INTO agents (wallet, stake_balance, successful_calls, failed_calls, total_spent, created_at, updated_at)
  VALUES (?, 0, 0, 0, 0, ?, ?)
  ON CONFLICT(wallet) DO UPDATE SET updated_at = excluded.updated_at
`);

const _addStake = db.prepare(`
  UPDATE agents SET stake_balance = stake_balance + ?, updated_at = ? WHERE wallet = ?
`);

const _deductCost = db.prepare(`
  UPDATE agents SET stake_balance = stake_balance - ?, total_spent = total_spent + ?, updated_at = ? WHERE wallet = ?
`);

const _incrementSuccess = db.prepare(`
  UPDATE agents SET successful_calls = successful_calls + 1, updated_at = ? WHERE wallet = ?
`);

const _incrementFailure = db.prepare(`
  UPDATE agents SET failed_calls = failed_calls + 1, updated_at = ? WHERE wallet = ?
`);

const _getTopAgents = db.prepare(`
  SELECT * FROM agents ORDER BY stake_balance DESC, successful_calls DESC LIMIT 50
`);

const _getAllAgents = db.prepare("SELECT * FROM agents ORDER BY created_at DESC");

const _insertCallLog = db.prepare(`
  INSERT INTO call_log (wallet, endpoint, status_code, cost, reputation_before, reputation_after, balance_before, balance_after, created_at)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

const _getCallLog = db.prepare(
  "SELECT * FROM call_log WHERE wallet = ? ORDER BY created_at DESC LIMIT 100"
);

const _getRecentCalls = db.prepare(
  "SELECT * FROM call_log ORDER BY created_at DESC LIMIT 50"
);

const _saveLocusSession = db.prepare(`
  INSERT INTO locus_sessions (session_id, wallet, amount, status, created_at)
  VALUES (?, ?, ?, 'PENDING', ?)
`);

const _updateLocusSession = db.prepare(`
  UPDATE locus_sessions SET status = ? WHERE session_id = ?
`);

const _getLocusSession = db.prepare(
  "SELECT * FROM locus_sessions WHERE session_id = ?"
);

// ── Exported Functions ──────────────────────────────

export function getAgent(wallet: string): AgentRecord | undefined {
  return _getAgent.get(wallet) as AgentRecord | undefined;
}

export function ensureAgent(wallet: string): AgentRecord {
  const now = Date.now();
  _upsertAgent.run(wallet, now, now);
  return _getAgent.get(wallet) as AgentRecord;
}

export function addStake(wallet: string, amount: number): void {
  _addStake.run(amount, Date.now(), wallet);
}

export function deductCost(wallet: string, cost: number): void {
  _deductCost.run(cost, cost, Date.now(), wallet);
}

export function incrementSuccess(wallet: string): void {
  _incrementSuccess.run(Date.now(), wallet);
}

export function incrementFailure(wallet: string): void {
  _incrementFailure.run(Date.now(), wallet);
}

export function getTopAgents(): AgentRecord[] {
  return _getTopAgents.all() as AgentRecord[];
}

export function getAllAgents(): AgentRecord[] {
  return _getAllAgents.all() as AgentRecord[];
}

export function recordCall(log: {
  wallet: string;
  endpoint: string;
  statusCode: number;
  cost: number;
  reputationBefore: number;
  reputationAfter: number;
  balanceBefore: number;
  balanceAfter: number;
}): void {
  _insertCallLog.run(
    log.wallet,
    log.endpoint,
    log.statusCode,
    log.cost,
    log.reputationBefore,
    log.reputationAfter,
    log.balanceBefore,
    log.balanceAfter,
    Date.now()
  );
}

export function getCallLog(wallet: string): CallLogRecord[] {
  return _getCallLog.all(wallet) as CallLogRecord[];
}

export function getRecentCalls(): CallLogRecord[] {
  return _getRecentCalls.all() as CallLogRecord[];
}

export function saveLocusSession(sessionId: string, wallet: string, amount: number): void {
  _saveLocusSession.run(sessionId, wallet, amount, Date.now());
}

export function updateLocusSession(sessionId: string, status: string): void {
  _updateLocusSession.run(status, sessionId);
}

export function getLocusSession(sessionId: string): LocusSessionRecord | undefined {
  return _getLocusSession.get(sessionId) as LocusSessionRecord | undefined;
}

export function getAgentStats(): { totalAgents: number; totalCalls: number; totalUsdcCollected: number; avgReputation: number } {
  const agents = getAllAgents();
  const totalCalls = agents.reduce((sum, a) => sum + a.successful_calls + a.failed_calls, 0);
  const totalUsdcCollected = agents.reduce((sum, a) => sum + a.total_spent, 0);

  // Import getReputation dynamically to avoid circular deps
  const { getReputation } = require("./reputation");
  const scores = agents.map((a) => getReputation(a.wallet));
  const avgReputation = scores.length > 0 ? scores.reduce((s: number, v: number) => s + v, 0) / scores.length : 0;

  return {
    totalAgents: agents.length,
    totalCalls,
    totalUsdcCollected: Math.round(totalUsdcCollected * 10000) / 10000,
    avgReputation: Math.round(avgReputation * 10) / 10,
  };
}

export default db;
