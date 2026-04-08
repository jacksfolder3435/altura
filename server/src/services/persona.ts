/**
 * Data-driven persona engine.
 *
 * Given the real X profile + Altura holder snapshot, assign the correct
 * archetype per the Lunar brief. Priority order (rarest first):
 *
 *   Vault titles (checked in order, first match wins):
 *     1. Altura OG            — first deposit ≤ Dec 30, 2025
 *     2. Epoch 0 Survivor     — first deposit between Dec 29, 2025 – Jan 30, 2026
 *     3. Altura Gigachad      — costBasis > $5k
 *     4. Baby Whale           — $1k ≤ costBasis ≤ $5k
 *     5. Diamond Hands        — any deposit, no withdrawals (transferCount proxy)
 *
 *   Dropped per latest Altura team feedback:
 *     - 80%+ APY Legend       (no APY history endpoint, won't be added)
 *     - Pendle LP Degen       (no Pendle position data available)
 *
 *   X activity titles (only if no vault title applied):
 *     - Hyperliquid Maxi
 *     - InfoFi Enjooooyor
 *     - Bro Stop Posting About Memecoins
 *     - Airdrop Hunter
 *     - Thread Guy
 *     - Based Take Merchant
 *     - Quote Tweet Warrior
 *
 *   Fallback:
 *     - NPC
 */

// === Altura Vault timeline ==============================================
// Vault opened: 2025-12-23. First 7 days = OG (deposited by 2025-12-30).
// Epoch 0 ran: 2025-12-29 → 2026-01-30.
const ALTURA_OG_CUTOFF_MS = Date.UTC(2025, 11, 30, 23, 59, 59); // Dec 30, 2025
const EPOCH_0_START_MS = Date.UTC(2025, 11, 29, 0, 0, 0);       // Dec 29, 2025
const EPOCH_0_END_MS = Date.UTC(2026, 0, 30, 23, 59, 59);       // Jan 30, 2026
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
  og: {
    key: "altura_og",
    name: "Altura OG",
    emoji: "🏛️",
    description:
      "DEPOSITED IN THE FIRST WEEK. YOU BELIEVED BEFORE THERE WAS PROOF. RESPECT.",
    source: "vault",
  },
  epoch0: {
    key: "epoch_0_survivor",
    name: "Epoch 0 Survivor",
    emoji: "⚔️",
    description:
      "WAS IN YIELDRUN FROM DAY ONE. BATTLE-TESTED AND STILL STANDING.",
    source: "vault",
  },
  gigachad: {
    key: "gigachad",
    name: "Altura Gigachad",
    emoji: "💎",
    description:
      "> $5K DEPOSITED IN VAULT OR AVLT ON PENDLE. YOU DON'T JUST TALK THE TALK — YOUR WALLET BACKS IT UP.",
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
  diamond: {
    key: "diamond",
    name: "Diamond Hands",
    emoji: "🤲",
    description:
      "HAS NEVER WITHDRAWN. JUST SITS AND COMPOUNDS. YOUR PATIENCE IS YOUR SUPERPOWER.",
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
  const firstDeposit = altura.firstDepositTimestampMs;

  // 1. Altura OG — first deposit in vault's first 7 days (≤ Dec 30, 2025)
  //    We can only confirm this when transferCount === 1 (so first == last).
  //    Multi-deposit users are skipped here until Altura adds a
  //    `firstDepositTimestamp` field.
  if (firstDeposit && firstDeposit <= ALTURA_OG_CUTOFF_MS) {
    return { archetype: VAULT.og!, trigger: "vault:altura_og" };
  }

  // 2. Epoch 0 Survivor — first deposit during Dec 29 → Jan 30
  if (
    firstDeposit &&
    firstDeposit >= EPOCH_0_START_MS &&
    firstDeposit <= EPOCH_0_END_MS
  ) {
    return { archetype: VAULT.epoch0!, trigger: "vault:epoch_0_survivor" };
  }

  // 3. Altura Gigachad — > $5k deposited
  if (deposited > 5000) {
    return { archetype: VAULT.gigachad!, trigger: "vault:gigachad" };
  }

  // 4. Baby Whale — $1k to $5k deposited
  if (deposited >= 1000 && deposited <= 5000) {
    return { archetype: VAULT.babyWhale!, trigger: "vault:baby_whale" };
  }

  // 5. Diamond Hands — any deposit, no withdrawals.
  //    Proxy until Altura exposes a withdraw count: any user with a positive
  //    balance qualifies (since the campaign is for current holders, anyone
  //    holding the vault token hasn't withdrawn the full position).
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
