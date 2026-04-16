import { config, isXConfigured } from "../config.js";

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

export interface XProfile {
  user: XUser;
  tweets: XTweet[];
}

const X_API_BASE = "https://api.twitter.com/2";

async function xFetch<T>(path: string): Promise<T> {
  if (!isXConfigured) {
    throw new Error("X_BEARER_TOKEN not configured");
  }
  const res = await fetch(`${X_API_BASE}${path}`, {
    headers: {
      Authorization: `Bearer ${config.xBearerToken}`,
    },
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`X API ${res.status}: ${body}`);
  }
  return (await res.json()) as T;
}

export async function fetchXProfile(username: string): Promise<XProfile> {
  const cleaned = username.replace(/^@/, "").trim();

  const userResp = await xFetch<{ data: XUser }>(
    `/users/by/username/${encodeURIComponent(cleaned)}` +
      `?user.fields=description,profile_image_url,public_metrics`,
  );
  const user = userResp.data;

  const tweetsResp = await xFetch<{ data?: XTweet[] }>(
    `/users/${user.id}/tweets` +
      `?max_results=20&exclude=retweets,replies&tweet.fields=public_metrics,created_at`,
  );

  return { user, tweets: tweetsResp.data ?? [] };
}
