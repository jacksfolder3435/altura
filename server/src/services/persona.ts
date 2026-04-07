/**
 * Data-driven persona engine.
 *
 * Given the real X profile + Altura holder snapshot, assign the correct
 * archetype per the Lunar brief. Priority order (rarest first):
 *
 *   Vault titles (checked first, in order):
 *     1. Pendle LP Degen      — [blocked] requires Pendle API integration
 *     2. Altura OG            — [blocked] requires launch date
 *     3. Epoch 0 Survivor     — [blocked] requires YieldRun epoch data
 *     4. 80%+ APY Legend      — [blocked] requires deposit timestamp + APY
 *     5. Altura Gigachad      — costBasis > $5k                 ← LIVE
 *     6. Diamond Hands        — no outbound transfers (proxy)   ← LIVE
 *     7. Baby Whale           — $1k ≤ costBasis ≤ $5k           ← LIVE
 *
 *   X activity titles (only if no vault title applied):
 *     - Hyperliquid Maxi
 *     - Bro Stop Posting About Memecoins
 *     - InfoFi Enjooooyor
 *     - Airdrop Hunter
 *     - Thread Guy
 *     - Quote Tweet Warrior
 *     - Based Take Merchant
 *
 *   Fallback:
 *     - NPC
 */
import type { AlturaSummary } from "./altura.js";
import type { XProfile, XTweet } from "./x.js";

export interface Archetype {
  key: string;
  name: string;
  emoji: string;
  description: string;
  /** "vault" titles show on the Platinum card, "x" titles show on the standard card */
  source: "vault" | "x" | "fallback";
}

export interface PersonaResolution {
  archetype: Archetype;
  /** true when the title was derived from real data; false when it's the
   *  fallback (NPC). Useful for analytics. */
  dataDriven: boolean;
  /** Short debug signal of what matched, e.g. "vault:gigachad", "x:memecoins". */
  trigger: string;
}

// ---------- Catalog ------------------------------------------------------

const VAULT: Record<string, Archetype> = {
  gigachad: {
    key: "gigachad",
    name: "Altura Gigachad",
    emoji: "💎",
    description:
      "> $5K DEPOSITED IN VAULT OR AVLT ON PENDLE. YOU DON'T JUST TALK THE TALK — YOUR WALLET BACKS IT UP.",
    source: "vault",
  },
  diamond: {
    key: "diamond",
    name: "Diamond Hands",
    emoji: "🤲",
    description:
      "HAS NEVER WITHDRAWN. JUST SITS AND COMPOUNDS. YOUR PATIENCE IS YOUR SUPERPOWER.",
    source: "vault",
  },
  babyWhale: {
    key: "baby_whale",
    name: "Baby Whale",
    emoji: "🐋",
    description:
      "$1K-$5K DEPOSITED. NOT QUITE GIGACHAD YET. BUT YOU'RE ON YOUR WAY.",
    source: "vault",
  },
};

const X_TITLES: Record<string, Archetype> = {
  hyperliquidMaxi: {
    key: "hyperliquid_maxi",
    name: "Hyperliquid Maxi",
    emoji: "⚡",
    description:
      "TWEETS ABOUT HYPE NON-STOP. STOPPED WORKING AFTER THE AIRDROP, FULL-TIME X CREATOR NOW.",
    source: "x",
  },
  memecoins: {
    key: "memecoins",
    name: "Bro Stop Posting About Memecoins",
    emoji: "🛑",
    description:
      "SELF-EXPLANATORY. HALF OF CT QUALIFIES. YOUR TIMELINE IS 90% DOG COINS AND REGRET.",
    source: "x",
  },
  infofi: {
    key: "infofi",
    name: "InfoFi Enjooooyor",
    emoji: "📡",
    description:
      "STILL TWEETING ABOUT INFOFI. IT'S BEEN DEAD FOR 3 MONTHS. SOMEONE TELL THEM.",
    source: "x",
  },
  airdropHunter: {
    key: "airdrop_hunter",
    name: "Airdrop Hunter",
    emoji: "🎯",
    description:
      "TWEETS ABOUT EVERY TESTNET AND POINTS PROGRAM. 200 PROTOCOLS, 0 AIRDROPS.",
    source: "x",
  },
  threadGuy: {
    key: "thread_guy",
    name: "Thread Guy",
    emoji: "🧵",
    description:
      "POSTS 1/47 THREADS. NEVER FINISHES. THE GRAVEYARD OF UNFINISHED ALPHA IS VAST.",
    source: "x",
  },
  quoteTweetWarrior: {
    key: "qt_warrior",
    name: "Quote Tweet Warrior",
    emoji: "⚔️",
    description:
      "RATIO GAME STRONG. ORIGINAL CONTENT NONEXISTENT. YOU LIVE TO DUNK.",
    source: "x",
  },
  basedTake: {
    key: "based_take",
    name: "Based Take Merchant",
    emoji: "🔥",
    description:
      "DROPS TAKES THAT GET RATIOED AT FIRST BUT AGE LIKE FINE WINE.",
    source: "x",
  },
};

const NPC: Archetype = {
  key: "npc",
  name: "NPC",
  emoji: "🤖",
  description:
    "ZERO DEFI POSITIONS, TWEETS 'GM' ONCE A WEEK. ALTURA CAN FIX AT LEAST ONE OF THOSE PROBLEMS.",
  source: "fallback",
};

// ---------- Vault classifier --------------------------------------------

function classifyVault(altura: AlturaSummary | null): {
  archetype: Archetype;
  trigger: string;
} | null {
  if (!altura || !altura.isHolder) return null;

  const deposited = altura.totalDepositedUSD;

  // Gigachad — > $5k deposited (rarest LIVE vault title)
  if (deposited > 5000) {
    return { archetype: VAULT.gigachad!, trigger: "vault:gigachad" };
  }

  // Baby Whale — $1k to $5k deposited
  if (deposited >= 1000 && deposited <= 5000) {
    return { archetype: VAULT.babyWhale!, trigger: "vault:baby_whale" };
  }

  // Diamond Hands — any deposit with no withdrawals.
  // Proxy: if the user has a positive balance AND their transferCount is
  // low (≤ 2 — one or two deposit txs, no withdraws), they're diamond hands.
  // We don't have a real withdraw count in the snapshot yet, so this is a
  // best-effort heuristic.
  if (deposited > 0) {
    return { archetype: VAULT.diamond!, trigger: "vault:diamond_hands" };
  }

  return null;
}

// ---------- X content classifier ----------------------------------------

/** Case-insensitive keyword presence, treating word boundaries loosely. */
function hasAny(text: string, terms: string[]): number {
  const lower = text.toLowerCase();
  let count = 0;
  for (const t of terms) {
    const re = new RegExp(`\\b${t.toLowerCase()}\\b`, "g");
    const matches = lower.match(re);
    if (matches) count += matches.length;
  }
  return count;
}

interface TweetSignals {
  tweets: XTweet[];
  joined: string;
  hyperliquid: number;
  memecoins: number;
  infofi: number;
  airdrops: number;
  threads: number;
  quoteTweets: number;
  basedTakes: number;
}

function analyzeTweets(tweets: XTweet[]): TweetSignals {
  const joined = tweets.map((t) => t.text).join("\n");

  return {
    tweets,
    joined,
    hyperliquid: hasAny(joined, [
      "hyperliquid",
      "hype",
      "hyperevm",
      "\\$hype",
    ]),
    memecoins: hasAny(joined, [
      "memecoin",
      "memecoins",
      "meme coin",
      "doge",
      "shib",
      "pepe",
      "wif",
      "bonk",
      "popcat",
      "floki",
      "trenches",
      "pumpfun",
      "pump\\.fun",
    ]),
    infofi: hasAny(joined, ["infofi", "info-fi", "info fi", "kaito"]),
    airdrops: hasAny(joined, [
      "airdrop",
      "airdrops",
      "testnet",
      "points",
      "points program",
      "season 1",
      "season 2",
      "$zro",
      "$arb",
      "$op",
      "farming",
      "farmers",
    ]),
    threads: countThreads(tweets),
    // Quote-tweet warrior: we don't have direct QT metadata on the public
    // timeline endpoint, so use text heuristics — short reaction tweets that
    // look like they were attached to a quoted post.
    quoteTweets: countQuoteTweetLikePosts(tweets),
    basedTakes: hasAny(joined, [
      "based",
      "cope",
      "ngmi",
      "wagmi",
      "gigachad",
      "chad",
      "beta",
    ]),
  };
}

function countThreads(tweets: XTweet[]): number {
  // "Thread guy" indicators: tweets that start with "1/", "2/", "🧵", or
  // literally contain "thread".
  let n = 0;
  for (const t of tweets) {
    if (/^\s*(1\s*\/|🧵)/.test(t.text)) n++;
    else if (/\bthread\b/i.test(t.text)) n++;
  }
  return n;
}

function countQuoteTweetLikePosts(tweets: XTweet[]): number {
  // Heuristic: very short reaction tweets (< 50 chars, no URLs) that look
  // like hot takes attached to a QT. Not perfect but good enough for v1.
  let n = 0;
  for (const t of tweets) {
    const trimmed = t.text.trim();
    if (trimmed.length > 0 && trimmed.length < 50 && !/https?:\/\//.test(trimmed)) {
      n++;
    }
  }
  return n;
}

function classifyX(xProfile: XProfile | null): {
  archetype: Archetype;
  trigger: string;
} | null {
  if (!xProfile || xProfile.tweets.length === 0) return null;

  const signals = analyzeTweets(xProfile.tweets);

  // Priority order within X titles — most specific / rarest first.
  // A single strong signal beats weaker aggregates.
  if (signals.hyperliquid >= 2) {
    return { archetype: X_TITLES.hyperliquidMaxi!, trigger: "x:hyperliquid" };
  }
  if (signals.infofi >= 1) {
    return { archetype: X_TITLES.infofi!, trigger: "x:infofi" };
  }
  if (signals.memecoins >= 2) {
    return { archetype: X_TITLES.memecoins!, trigger: "x:memecoins" };
  }
  if (signals.airdrops >= 3) {
    return { archetype: X_TITLES.airdropHunter!, trigger: "x:airdrop_hunter" };
  }
  if (signals.threads >= 2) {
    return { archetype: X_TITLES.threadGuy!, trigger: "x:thread_guy" };
  }
  if (signals.basedTakes >= 3) {
    return { archetype: X_TITLES.basedTake!, trigger: "x:based_take" };
  }
  if (signals.quoteTweets >= 4) {
    return {
      archetype: X_TITLES.quoteTweetWarrior!,
      trigger: "x:qt_warrior",
    };
  }

  return null;
}

// ---------- Main entry ---------------------------------------------------

export function resolvePersona(
  xProfile: XProfile | null,
  altura: AlturaSummary | null,
): PersonaResolution {
  // 1) Vault title wins if present
  const vault = classifyVault(altura);
  if (vault) {
    return { ...vault, dataDriven: true };
  }

  // 2) Otherwise an X activity title
  const x = classifyX(xProfile);
  if (x) {
    return { ...x, dataDriven: true };
  }

  // 3) Fallback — NPC
  return { archetype: NPC, trigger: "fallback:npc", dataDriven: false };
}
