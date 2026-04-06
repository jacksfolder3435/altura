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
  totalDepositedUSD: number;
  currentValueUSD: number;
  pnlUSD: number;
  pnlPercent: number;
  walletAddress: string;
}

export interface ProfileResponse {
  username: string;
  x: { user: XUser; tweets: XTweet[] } | null;
  altura: AlturaSummary | null;
  cardType: "standard" | "platinum";
  xConfigured: boolean;
}

const BACKEND_URL =
  (import.meta.env.VITE_BACKEND_URL as string | undefined) ??
  "http://localhost:8787";

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
