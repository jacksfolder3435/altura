import { config } from "../config.js";

export interface AlturaChainEntry {
  balance: string;
  balanceFormatted: string;
  avgPricePerShare?: string;
  avgPricePerShareFormatted?: string;
  sharesReceived?: string;
  /** Number of vault deposit transactions on this chain. */
  transferCount?: number;
  /** Unix timestamp (seconds) of the most recent vault tx on this chain.
   *  NOTE: this is the LATEST activity, not the first deposit. */
  lastUpdatedTimestamp?: string;
}

export interface AlturaHolderResponse {
  twitterUsername: string;
  walletAddress: string;
  holder: {
    address: string;
    totalBalance: string;
    totalBalanceFormatted: string;
    chains: Record<string, AlturaChainEntry>;
    portfolioValue: string;
    costAnalysis: {
      overall: {
        avgPricePerShareFormatted: string;
        costBasis: string;
        currentValue: string;
        unrealizedPnL: string;
      };
    };
  };
}

export interface AlturaHolderError {
  error: string;
}

export interface AlturaSummary {
  isHolder: boolean;
  /** Cost basis in USD — the total amount deposited (Altura `costBasis`). */
  totalDepositedUSD: number;
  /** Current portfolio value in USD (Altura `currentValue` / `portfolioValue`). */
  currentValueUSD: number;
  /** Exact unrealized PnL in USD, taken directly from Altura's `unrealizedPnL`
   *  field (which is in raw 6-decimal token units). */
  pnlUSD: number;
  /** Percentage gain/loss = pnlUSD / costBasis * 100. */
  pnlPercent: number;
  /** Annualized return — null if Altura doesn't expose APY (currently the case;
   *  Altura's snapshot endpoint only gives a point-in-time PnL, not APY). */
  apy: number | null;
  /** Total balance of vault tokens (Altura `totalBalanceFormatted`). */
  vaultTokenBalance: number;
  /** Total number of vault deposit transactions across all chains. */
  transferCount: number;
  /** Most recent vault tx timestamp across chains, in ms (or null). */
  lastUpdatedTimestampMs: number | null;
  /** Best-effort first deposit timestamp in ms.
   *  - When `transferCount === 1`, this equals `lastUpdatedTimestampMs`
   *    (it's the only deposit so it must also be the first).
   *  - When `transferCount > 1`, this is `null` because the snapshot
   *    endpoint doesn't expose the first-deposit timestamp.
   *  TODO(altura): request a `firstDepositTimestamp` field on the snapshot
   *  endpoint so we can resolve OG / Epoch 0 for multi-deposit users.
   */
  firstDepositTimestampMs: number | null;
  /** On-chain wallet address. */
  walletAddress: string;
  /** Raw passthrough of the Altura snapshot for debugging / future use. */
  raw: {
    costBasis: string;
    currentValue: string;
    unrealizedPnL: string;
    portfolioValue: string;
    avgPricePerShareFormatted: string;
  };
}

/**
 * Altura's `unrealizedPnL` is returned in raw 6-decimal token units (USDC-style).
 * Convert to a JS number in USD.
 */
function parseUnrealizedPnL(raw: string): number {
  const n = Number(raw);
  if (!Number.isFinite(n)) return 0;
  return n / 1_000_000;
}

export async function fetchAlturaHolder(
  username: string,
): Promise<AlturaSummary | null> {
  const cleaned = username.replace(/^@/, "").trim();
  if (!cleaned) return null;

  const url = `${config.altura.apiUrl}/api/holder/x/${encodeURIComponent(cleaned)}`;
  const res = await fetch(url, {
    headers: { "x-api-key": config.altura.apiKey },
  });

  if (!res.ok) {
    // 404 / "No Privy user found" → not a holder, not an error
    if (res.status === 404 || res.status === 400) return null;
    const body = await res.text().catch(() => "");
    if (body.includes("No Privy user found")) return null;
    throw new Error(`Altura API error ${res.status}: ${body}`);
  }

  const data = (await res.json()) as AlturaHolderResponse | AlturaHolderError;
  if ("error" in data) return null;

  const overall = data.holder.costAnalysis.overall;
  const costBasis = Number(overall.costBasis);
  const currentValue = Number(overall.currentValue);

  // EXACT PnL straight from Altura's `unrealizedPnL` field. Falls back to
  // currentValue - costBasis if (for some reason) the field is missing.
  const exactPnl = overall.unrealizedPnL
    ? parseUnrealizedPnL(overall.unrealizedPnL)
    : currentValue - costBasis;

  const pnlPct = costBasis > 0 ? (exactPnl / costBasis) * 100 : 0;

  // Aggregate transfer activity across chains.
  let totalTransferCount = 0;
  let mostRecentTsSec = 0;
  for (const chain of Object.values(data.holder.chains)) {
    if (typeof chain.transferCount === "number") {
      totalTransferCount += chain.transferCount;
    }
    if (chain.lastUpdatedTimestamp) {
      const t = Number(chain.lastUpdatedTimestamp);
      if (t > mostRecentTsSec) mostRecentTsSec = t;
    }
  }
  const lastUpdatedTimestampMs =
    mostRecentTsSec > 0 ? mostRecentTsSec * 1000 : null;

  // Best-effort first deposit:
  // - exactly 1 transfer → first == last
  // - more than 1         → unknown (snapshot doesn't expose it)
  const firstDepositTimestampMs =
    totalTransferCount === 1 && lastUpdatedTimestampMs
      ? lastUpdatedTimestampMs
      : null;

  return {
    isHolder: true,
    totalDepositedUSD: costBasis,
    currentValueUSD: currentValue,
    pnlUSD: exactPnl,
    pnlPercent: pnlPct,
    apy: null, // Altura snapshot does not expose APY
    vaultTokenBalance: Number(data.holder.totalBalanceFormatted),
    transferCount: totalTransferCount,
    lastUpdatedTimestampMs,
    firstDepositTimestampMs,
    walletAddress: data.walletAddress,
    raw: {
      costBasis: overall.costBasis,
      currentValue: overall.currentValue,
      unrealizedPnL: overall.unrealizedPnL,
      portfolioValue: data.holder.portfolioValue,
      avgPricePerShareFormatted: overall.avgPricePerShareFormatted,
    },
  };
}
