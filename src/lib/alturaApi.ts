/**
 * Frontend client for the Altura backend.
 * The backend proxies both X (Twitter) and Altura snapshot APIs so that
 * API keys never reach the browser.
 */

export interface XTweet {
  id: string;
  text: string;
  created_at?: string;
  public_metrics?: {
    like_count: number;
    retweet_count: number;
    reply_count: number;
    impression_count: number;
  };
}

export interface XUser {
  id: string;
  name: string;
  username: string;
  description?: string;
  profile_image_url?: string;
  public_metrics?: {
    followers_count: number;
    following_count: number;
    tweet_count: number;
    listed_count: number;
  };
}

export interface AlturaSummary {
  isHolder: boolean;
  /** Cost basis in USD — total amount deposited (Altura `costBasis`). */
  totalDepositedUSD: number;
  /** Current portfolio value in USD (Altura `currentValue`/`portfolioValue`). */
  currentValueUSD: number;
  /** Exact unrealized PnL in USD, taken directly from Altura's
   *  `unrealizedPnL` field. */
  pnlUSD: number;
  /** Percentage gain = pnlUSD / costBasis * 100. */
  pnlPercent: number;
  /** Annualized return — null because Altura's snapshot endpoint doesn't
   *  expose APY. */
  apy: number | null;
  /** Vault token balance (Altura `totalBalanceFormatted`). */
  vaultTokenBalance: number;
  /** On-chain wallet address. */
  walletAddress: string;
  /** Raw Altura values for debugging. */
  raw?: {
    costBasis: string;
    currentValue: string;
    unrealizedPnL: string;
    portfolioValue: string;
    avgPricePerShareFormatted: string;
  };
}

/** Archetype resolved by the backend persona engine. */
export interface BackendArchetype {
  key: string;
  name: string;
  emoji: string;
  description: string;
  source: "vault" | "x" | "fallback";
}

export interface BackendPersonaResolution {
  archetype: BackendArchetype;
  dataDriven: boolean;
  trigger: string;
}

export interface ProfileResponse {
  username: string;
  x: { user: XUser; tweets: XTweet[] } | null;
  altura: AlturaSummary | null;
  persona: BackendPersonaResolution;
  cardType: "standard" | "platinum";
  xConfigured: boolean;
}

/**
 * In production the backend is reverse-proxied behind the same origin under
 * `/api/*`, so we just call relative URLs. In dev, set VITE_BACKEND_URL in
 * `.env.local` to e.g. `http://localhost:8787` to bypass the proxy.
 */
const BACKEND_URL =
  (import.meta.env.VITE_BACKEND_URL as string | undefined) ?? "";

export async function fetchProfile(username: string): Promise<ProfileResponse> {
  const cleaned = username.replace(/^@/, "").trim();
  const res = await fetch(
    `${BACKEND_URL}/api/profile/${encodeURIComponent(cleaned)}`,
  );
  if (!res.ok) {
    throw new Error(`Profile fetch failed (${res.status}): ${await res.text()}`);
  }
  return (await res.json()) as ProfileResponse;
}

/** Body for POST /api/share — logs a raffle entry. */
export interface ShareEntry {
  username: string;
  archetype: { key: string; name: string; source: "vault" | "x" | "fallback" };
  trigger?: string;
  isHolder: boolean;
  pnlUSD?: number | null;
  costBasisUSD?: number | null;
  walletAddress?: string | null;
}

/**
 * Records a raffle entry. Called when the user clicks "Share on X".
 * Failures are non-fatal — the user always gets to share even if the
 * backend is unreachable, we just won't count them in the raffle.
 */
export async function recordShare(entry: ShareEntry): Promise<void> {
  try {
    await fetch(`${BACKEND_URL}/api/share`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(entry),
      keepalive: true, // survives the page navigation when X intent opens
    });
  } catch (e) {
    console.warn("[share] failed to record raffle entry:", e);
  }
}
