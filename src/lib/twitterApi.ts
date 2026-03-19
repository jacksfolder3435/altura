export interface XTweet {
  id: string;
  text: string;
  public_metrics?: {
    like_count: number;
    retweet_count: number;
    reply_count: number;
    impression_count: number;
  };
}

/**
 * Fetch up to 10 latest original tweets for a given X username.
 * Requires the Vite dev server proxy to be running (injects Bearer token server-side).
 * Falls back gracefully — callers should catch and handle errors.
 */
export async function fetchLatestTweets(username: string): Promise<XTweet[]> {
  // Step 1: resolve username → numeric user ID
  const userRes = await fetch(
    `/api/twitter/2/users/by/username/${encodeURIComponent(username)}`
  );
  if (!userRes.ok) {
    throw new Error(`User lookup failed (${userRes.status}): ${await userRes.text()}`);
  }
  const userData = await userRes.json();
  const userId: string | undefined = userData.data?.id;
  if (!userId) throw new Error(`User "@${username}" not found on X`);

  // Step 2: fetch 10 latest original tweets (no retweets, no replies)
  const tweetsRes = await fetch(
    `/api/twitter/2/users/${userId}/tweets` +
    `?max_results=10` +
    `&tweet.fields=public_metrics,created_at` +
    `&exclude=retweets,replies`
  );
  if (!tweetsRes.ok) {
    throw new Error(`Tweets fetch failed (${tweetsRes.status}): ${await tweetsRes.text()}`);
  }
  const tweetsData = await tweetsRes.json();
  return tweetsData.data ?? [];
}
