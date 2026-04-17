/**
 * Data-driven persona engine — v1.1.
 *
 * Decision tree (rarest first wins):
 *
 *   Vault titles (only if user is a holder):
 *     1. Altura OG            — first deposit ≤ 2025-12-30
 *     2. Epoch 0 Survivor     — first deposit between 2025-12-29 and 2026-01-30
 *     3. Altura Gigachad      — costBasis > $5k
 *     4. Baby Whale           — $1k ≤ costBasis ≤ $5k
 *     5. Diamond Hands        — any deposit, no withdrawals (transferCount proxy)
 *
 *   X activity titles (only if no vault title applied):
 *     6. Hyperliquid Maxi          (1 mention)
 *     7. InfoFi Enjooooyor         (1 mention)
 *     8. Bro Stop Posting About Memecoins (2 mentions)
 *     9. Airdrop Hunter            (1 mention)
 *     10. Thread Guy               (1 tweet)
 *     11. Based Take Merchant      (2 mentions)
 *     12. Quote Tweet Warrior      (2 short reaction tweets)
 *     13. Crypto Native            (1 mention) — broad safety net for crypto users
 *
 *   Fallback:
 *     14. Normie                   — no DeFi, no crypto signal at all
 *
 * v1.1 changes vs v1.0:
 *   - X API tweet sample 10 → 20
 *   - All keyword lists massively expanded; thresholds lowered
 *   - New: Crypto Native (catches anyone tweeting about crypto without a vault)
 *   - Renamed: NPC → Normie
 *   - Better word-boundary matching: handles $-prefixed tickers, hyphenated
 *     terms, multi-word phrases.
 *
 * Dropped (per Altura team):
 *   - 80%+ APY Legend (no APY history endpoint)
 *   - Pendle LP Degen (no Pendle position data)
 *   - CT Lurker (extra X API cost for low value)
 */
import type { AlturaSummary } from "./altura.js";
import type { XProfile, XTweet } from "./x.js";

export interface Archetype {
  key: string;
  name: string;
  emoji: string;
  description: string;
  /** "vault" titles render Platinum card; "x"/"crypto"/"fallback" render Standard */
  source: "vault" | "x" | "fallback";
}

export interface PersonaResolution {
  archetype: Archetype;
  /** true when the title was derived from real data; false for fallback. */
  dataDriven: boolean;
  /** Short debug signal of what matched, e.g. "vault:gigachad", "x:memecoins". */
  trigger: string;
}

// === Altura Vault timeline ==============================================
// Vault opened: 2025-12-23. First 7 days = OG (deposited by 2025-12-30).
// Epoch 0 ran: 2025-12-29 → 2026-01-30.
const ALTURA_OG_CUTOFF_MS = Date.UTC(2025, 11, 30, 23, 59, 59);
const EPOCH_0_START_MS = Date.UTC(2025, 11, 29, 0, 0, 0);
const EPOCH_0_END_MS = Date.UTC(2026, 0, 30, 23, 59, 59);

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
  infofi: {
    key: "infofi",
    name: "InfoFi Enjooooyor",
    emoji: "📡",
    description:
      "STILL TWEETING ABOUT INFOFI. IT'S BEEN DEAD FOR 3 MONTHS. SOMEONE TELL THEM.",
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
  basedTake: {
    key: "based_take",
    name: "Based Take Merchant",
    emoji: "🔥",
    description:
      "DROPS TAKES THAT GET RATIOED AT FIRST BUT AGE LIKE FINE WINE.",
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
  cryptoNative: {
    key: "crypto_native",
    name: "Crypto Native",
    emoji: "🌐",
    description:
      "YOU'VE BEEN IN THE TRENCHES LONG ENOUGH. NO ALTURA VAULT POSITION THOUGH?",
    source: "x",
  },
};

const NORMIE: Archetype = {
  key: "normie",
  name: "Normie",
  emoji: "🤖",
  description:
    "ZERO ONCHAIN FOOTPRINT. ALTURA'S VAULT IS A GOOD PLACE TO START.",
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
  //    Only triggers when transferCount === 1 (first == last); multi-deposit
  //    users are skipped until Altura adds a `firstDepositTimestamp` field.
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

  // 5. Diamond Hands — any deposit, no withdrawals (proxy: positive balance)
  if (deposited > 0) {
    return { archetype: VAULT.diamond!, trigger: "vault:diamond_hands" };
  }

  return null;
}

// ---------- X content classifier ----------------------------------------

/**
 * Count occurrences of any term inside `text`, with smart boundaries:
 *   - $-prefixed tickers ($hype, $arb, ...)         → match exact token
 *   - hyphenated/dotted/multiword phrases           → match as literal phrase
 *   - plain words                                    → match with word boundaries
 *
 * All matching is case-insensitive. Boundaries use lookaround for "not a
 * letter or digit" so we don't get false partials inside other words.
 */
function hasAny(text: string, terms: string[]): number {
  const lower = text.toLowerCase();
  let total = 0;
  for (const raw of terms) {
    const term = raw.toLowerCase();
    // Escape regex metas.
    const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    // (?<![a-z0-9]) ... (?![a-z0-9]) → "surrounded by non-alphanum or string ends"
    // Works for $hype, info-fi, kaito connect, airdrop, doge, etc.
    const pattern = new RegExp(`(?<![a-z0-9])${escaped}(?![a-z0-9])`, "g");
    const matches = lower.match(pattern);
    if (matches) total += matches.length;
  }
  return total;
}

// === Keyword catalogs (v1.1, all case-insensitive) =====================

const KW_HYPERLIQUID = [
  "hyperliquid",
  "hype",
  "$hype",
  "hyperevm",
  "hypercore",
  "hypurr",
  "hypurrscan",
  "jeff yan",
  "hlp",
  "perps",
  "$purr",
  "purr",
  "hyperlaunch",
  "hyperliquid l1",
  "hfun",
  "hyperliquidity",
  "builder codes",
  "hyper",
  "hyperps",
  "pip",
];

const KW_INFOFI = [
  "infofi",
  "info-fi",
  "kaito",
  "$kaito",
  "yaps",
  "yappers",
  "yapping",
  "yap-to-earn",
  "mindshare",
  "gkaito",
  "skaito",
  "kaito connect",
  "kaito pro",
  "cookie.fun",
  "$cookie",
  "$loud",
  "proof-of-attention",
  "yapper leaderboard",
  "attention economy",
  "smart followers",
];

const KW_MEMECOINS = [
  "memecoin",
  "memecoins",
  "doge",
  "$doge",
  "shib",
  "$shib",
  "pepe",
  "$pepe",
  "wif",
  "$wif",
  "bonk",
  "$bonk",
  "popcat",
  "$popcat",
  "trenches",
  "pumpfun",
  "pump.fun",
  "$trump",
  "$brett",
  "$mog",
  "$mother",
  "$daddy",
  "$floki",
  "$wojak",
  "$turbo",
  "$milady",
  "$myro",
  "$wen",
  "$bome",
  "$giga",
  "$toshi",
  "rugpull",
  "rug pull",
  "honeypot",
  "stealth launch",
  "fair launch",
  "bonding curve",
  "moonshot",
  "memecoin szn",
  "degen mint",
  "jeet",
];

const KW_AIRDROPS = [
  "airdrop",
  "testnet",
  "points",
  "season",
  "$arb",
  "$op",
  "$zro",
  "farming",
  "$strk",
  "$jup",
  "eligibility",
  "claim",
  "snapshot",
  "tge",
  "allocation",
  "retroactive",
  "retrodrop",
  "sybil",
  "point farming",
  "$eigen",
  "$blast",
  "$scroll",
  "$zk",
  "$linea",
  "$layer3",
  "galxe",
  "zealy",
  "quest farming",
  "testnet faucet",
  "bridging",
  "daily check-in",
  "early adopter",
  "genesis drop",
  "claim window",
  "token claim",
  "points meta",
  "fdv",
];

const KW_BASED_TAKES = [
  "based",
  "ngmi",
  "wagmi",
  "cope",
  "copium",
  "hopium",
  "gigachad",
  "chad",
  "beta",
  "alpha",
  "ser",
  "anon",
  "fren",
  "bullish",
  "bearish",
  "rekt",
  "lfg",
  "gm",
  "probably nothing",
  "few",
  "have fun staying poor",
  "midcurve",
  "touch grass",
  "iykyk",
  "up only",
  "degen",
];

// Trimmed: dropped gas, mint, pump, dump, wallet, bridge, yield, whale
// (too ambiguous in non-crypto contexts). Threshold bumped 1 → 2.
const KW_CRYPTO_NATIVE = [
  "bitcoin",
  "btc",
  "ethereum",
  "eth",
  "solana",
  "sol",
  "defi",
  "nft",
  "web3",
  "blockchain",
  "dao",
  "staking",
  "dex",
  "cex",
  "tokenomics",
  "altcoin",
  "layer 2",
  "l2",
  "liquidity",
  "tvl",
  "onchain",
  "on-chain",
  "hodl",
  "fud",
  "maxi",
  "hodler",
  "binance",
  "coinbase",
  "metamask",
  "phantom",
  "ledger",
  "rollup",
  "zk",
];

// Thread Guy patterns: matches the BEGINNING or content of each tweet.
function countThreadSignals(tweets: XTweet[]): number {
  let n = 0;
  for (const t of tweets) {
    const text = t.text;
    const trimmed = text.trim();
    if (/^\s*1\s*\//.test(trimmed)) n++;
    else if (/^\s*🧵/.test(trimmed)) n++;
    else if (/\bthread\b/i.test(text)) n++;
    else if (/\(\s*1\s*\//.test(text)) n++;
    else if (/^\s*■/.test(trimmed)) n++;
  }
  return n;
}

// Quote Tweet Warrior heuristic: short reaction tweets with no link.
function countQTLikePosts(tweets: XTweet[]): number {
  let n = 0;
  for (const t of tweets) {
    const trimmed = t.text.trim();
    if (
      trimmed.length > 0 &&
      trimmed.length < 50 &&
      !/https?:\/\//.test(trimmed)
    ) {
      n++;
    }
  }
  return n;
}

interface TweetSignals {
  hyperliquid: number;
  infofi: number;
  memecoins: number;
  airdrops: number;
  threads: number;
  basedTakes: number;
  quoteTweets: number;
  cryptoNative: number;
}

function analyzeTweets(tweets: XTweet[]): TweetSignals {
  const joined = tweets.map((t) => t.text).join("\n");
  return {
    hyperliquid: hasAny(joined, KW_HYPERLIQUID),
    infofi: hasAny(joined, KW_INFOFI),
    memecoins: hasAny(joined, KW_MEMECOINS),
    airdrops: hasAny(joined, KW_AIRDROPS),
    threads: countThreadSignals(tweets),
    basedTakes: hasAny(joined, KW_BASED_TAKES),
    quoteTweets: countQTLikePosts(tweets),
    cryptoNative: hasAny(joined, KW_CRYPTO_NATIVE),
  };
}

/**
 * Score-based X title selection (v1.2).
 *
 * Instead of first-match-wins (which skews toward rules higher in the list),
 * we compute a score for every rule and pick the one with the highest score.
 *
 *   score = matches / threshold
 *
 * A rule qualifies only when score >= 1 (threshold met). Among qualifying
 * rules, the highest score wins — the user gets the title they match the
 * *most*, not the one that happened to be checked first.
 *
 * Example: user mentions `hype` once and `memecoin` 5 times.
 *   Old engine: Hyperliquid Maxi (first match)
 *   New engine: Memecoins (score 5/2=2.5 > 1/1=1.0 — stronger signal)
 */
interface XRule {
  archetype: Archetype;
  trigger: string;
  /** Number of matches the user produced for this rule. */
  matches: number;
  /** Minimum matches required to qualify. */
  threshold: number;
}

function classifyX(xProfile: XProfile | null): {
  archetype: Archetype;
  trigger: string;
} | null {
  if (!xProfile || xProfile.tweets.length === 0) return null;

  const s = analyzeTweets(xProfile.tweets);

  // Define all rules with their thresholds.
  const rules: XRule[] = [
    { archetype: X_TITLES.hyperliquidMaxi!, trigger: "x:hyperliquid",    matches: s.hyperliquid,  threshold: 1 },
    { archetype: X_TITLES.infofi!,          trigger: "x:infofi",         matches: s.infofi,       threshold: 1 },
    { archetype: X_TITLES.memecoins!,       trigger: "x:memecoins",      matches: s.memecoins,    threshold: 2 },
    { archetype: X_TITLES.airdropHunter!,   trigger: "x:airdrop_hunter", matches: s.airdrops,     threshold: 1 },
    { archetype: X_TITLES.threadGuy!,       trigger: "x:thread_guy",     matches: s.threads,      threshold: 1 },
    { archetype: X_TITLES.basedTake!,       trigger: "x:based_take",     matches: s.basedTakes,   threshold: 2 },
    { archetype: X_TITLES.quoteTweetWarrior!, trigger: "x:qt_warrior",   matches: s.quoteTweets,  threshold: 2 },
    // Crypto Native is the broad safety net — always checked last by
    // giving it a slightly lower score when tied (threshold is 1 so any
    // match qualifies, but a specific title with the same raw count wins
    // because its threshold is higher → lower score fraction).
    { archetype: X_TITLES.cryptoNative!,    trigger: "x:crypto_native",  matches: s.cryptoNative, threshold: 2 },
  ];

  // Filter to qualifying rules (score >= 1), then pick highest score.
  let best: XRule | null = null;
  let bestScore = 0;

  for (const rule of rules) {
    if (rule.matches < rule.threshold) continue;
    const score = rule.matches / rule.threshold;
    if (score > bestScore) {
      bestScore = score;
      best = rule;
    }
  }

  if (best) {
    return { archetype: best.archetype, trigger: best.trigger };
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

  // 2) Otherwise an X activity title (specific → Crypto Native net)
  const x = classifyX(xProfile);
  if (x) {
    return { ...x, dataDriven: true };
  }

  // 3) Fallback — Normie
  return { archetype: NORMIE, trigger: "fallback:normie", dataDriven: false };
}
