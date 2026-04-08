/**
 * Postgres pool + share-tracking helpers for the raffle.
 *
 * Uses node-postgres (`pg`) with a small pool. The pool lazily connects on
 * first query, so the backend boots fine even when DATABASE_URL is empty
 * (dev mode without a database).
 */
import pg from "pg";
import { config, isDatabaseConfigured } from "../config.js";

const { Pool } = pg;

let pool: pg.Pool | null = null;

function getPool(): pg.Pool {
  if (!isDatabaseConfigured) {
    throw new Error(
      "DATABASE_URL is not configured — share tracking is disabled.",
    );
  }
  if (!pool) {
    pool = new Pool({
      connectionString: config.databaseUrl,
      max: 5,
      idleTimeoutMillis: 30_000,
      connectionTimeoutMillis: 5_000,
    });
    pool.on("error", (err) => {
      console.error("[db] unexpected pool error:", err);
    });
  }
  return pool;
}

export interface ShareInsert {
  username: string;
  archetypeKey: string;
  archetypeName: string;
  archetypeSource: "vault" | "x" | "fallback";
  isHolder: boolean;
  pnlUSD: number | null;
  costBasisUSD: number | null;
  walletAddress: string | null;
  ipHash: string | null;
  userAgent: string | null;
  trigger: string | null;
}

/**
 * Logs a single share entry. Returns the inserted row id, or null if the
 * database isn't configured (dev mode).
 */
export async function recordShare(
  entry: ShareInsert,
): Promise<number | null> {
  if (!isDatabaseConfigured) return null;

  const result = await getPool().query<{ id: number }>(
    `INSERT INTO shares
      (username, archetype_key, archetype_name, archetype_source,
       is_holder, pnl_usd, cost_basis_usd, wallet_address,
       ip_hash, user_agent, trigger)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
     RETURNING id`,
    [
      entry.username,
      entry.archetypeKey,
      entry.archetypeName,
      entry.archetypeSource,
      entry.isHolder,
      entry.pnlUSD,
      entry.costBasisUSD,
      entry.walletAddress,
      entry.ipHash,
      entry.userAgent,
      entry.trigger,
    ],
  );
  return result.rows[0]?.id ?? null;
}

/** Return all shares ordered by `shared_at ASC` for CSV export. */
export async function listAllShares(): Promise<
  Array<{
    id: number;
    username: string;
    archetype_key: string;
    archetype_name: string;
    archetype_source: string;
    is_holder: boolean;
    pnl_usd: string | null;
    cost_basis_usd: string | null;
    wallet_address: string | null;
    trigger: string | null;
    shared_at: Date;
  }>
> {
  const result = await getPool().query(
    `SELECT id, username, archetype_key, archetype_name, archetype_source,
            is_holder, pnl_usd, cost_basis_usd, wallet_address, trigger,
            shared_at
       FROM shares
       ORDER BY shared_at ASC`,
  );
  return result.rows;
}

/**
 * Pick `n` distinct random share entries (one per username) for the raffle
 * draw. Each username only gets one ticket no matter how many times they
 * shared, to prevent farming.
 */
export async function drawWinners(n: number): Promise<
  Array<{
    username: string;
    archetype_name: string;
    wallet_address: string | null;
  }>
> {
  const result = await getPool().query(
    `SELECT DISTINCT ON (username)
            username, archetype_name, wallet_address
       FROM shares
       ORDER BY username, shared_at ASC`,
  );
  // Fisher–Yates shuffle then take first n
  const arr = result.rows;
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j]!, arr[i]!];
  }
  return arr.slice(0, n);
}

export async function shutdownPool(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
  }
}
