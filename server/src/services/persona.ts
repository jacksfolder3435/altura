/**
 * Data-driven persona engine — v2.0.
 *
 * Decision tree:
 *
 *   VAULT titles (only if user is an Altura holder, rarest wins):
 *     1. Altura OG            — first deposit ≤ 2025-12-30 (first 7 days)
 *     2. Epoch 0 Survivor     — first deposit between 2025-12-29 and 2026-01-30
 *     3. 80%+ APY Legend      — deposited ≥ 60 days ago (caught boosted era)
 *     4. Altura Gigachad      — costBasis > $5k
 *     5. Baby Whale           — $1k ≤ costBasis ≤ $5k
 *     6. Diamond Hands        — any deposit, no withdrawals (positive balance)
 *
 *   X ACTIVITY titles (only if no vault title applied, tiered evaluation):
 *     TIER 1 (specific — checked first):
 *       - Ethereum Maxi, Solana Maxi, Hyperliquid Maxi, InfoFi Enjoooyor,
 *         Perps Degen, Chart Guy, Ser Yield, Airdrop Hunter
 *     TIER 2 (medium specificity — only if no Tier 1 rule qualifies):
 *       - Responsible Degen, Bro Stop Posting About Memecoins, Thread Guy,
 *         Quote Tweet Warrior, CT Lurker, Based Take Merchant
 *     TIER 3 (broad catch-all — only if no Tier 1/2 rule qualifies):
 *       - Crypto Native
 *
 *   FALLBACK: Normie (no vault position and no crypto signal at all).
 *
 *   WITHIN each tier: score-based selection (`score = matches / threshold`),
 *   highest-scoring qualifying rule wins.
 *   BETWEEN tiers: the most specific tier with any qualifying rule wins, even
 *   if a lower-tier rule would have a higher raw score. This fixes the v1.2
 *   problem where a user qualifying for both Perps Degen (niche) AND Based
 *   Take Merchant (half of CT) could get Based Take Merchant by virtue of
 *   higher keyword density.
 *
 *   DESCRIPTIONS: every archetype now has 3 variants. A deterministic
 *   username-seeded hash picks one variant per user, so:
 *     - Two different users with the same title get different descriptions
 *       (more varied share cards, less copy-paste feel).
 *     - A single user's card stays stable across refreshes and sessions
 *       (no flickering, no "which version did I share?" surprises).
 *   Variant 0 is weighted slightly heavier (4/10 bucket vs 3/10 for the
 *   other two) — the feedback author flagged it as the preferred default.
 *
 * v2.0 changes vs v1.2:
 *   - Added 8 archetypes: 80%+ APY Legend, Ethereum Maxi, Solana Maxi,
 *     Chart Guy, Perps Degen, Ser Yield, CT Lurker, Responsible Degen.
 *   - Every archetype carries 3 description variants (picked deterministically
 *     per username) instead of a single fixed string.
 *   - X-title classifier replaced with tiered evaluation: specific titles
 *     always win over broad ones, score-based ranking only within a tier.
 *   - `resolvePersona()` now takes the username — it's required to seed the
 *     variant picker.
 */
import type { AlturaSummary } from "./altura.js";
import type { XProfile, XTweet, XUser } from "./x.js";

/** Full archetype definition in the catalog — carries all 3 description
 *  variants so the engine can pick one per user. */
export interface Archetype {
  key: string;
  name: string;
  emoji: string;
  /** Three description variants. The engine picks one based on username hash. */
  descriptions: readonly [string, string, string];
  /** "vault" titles render the holder layout; "x"/"fallback" render the
   *  "enter the vault" CTA. */
  source: "vault" | "x" | "fallback";
}

/** Archetype as returned to the frontend — the variant has already been
 *  picked, so it carries a single `description`. Shape matches the previous
 *  response contract (no frontend changes required). */
export interface ResolvedArchetype {
  key: string;
  name: string;
  emoji: string;
  description: string;
  source: "vault" | "x" | "fallback";
}

export interface PersonaResolution {
  archetype: ResolvedArchetype;
  /** true when the title was derived from real data; false for fallback. */
  dataDriven: boolean;
  /** Short debug signal of what matched, e.g. "vault:gigachad", "x:memecoins". */
  trigger: string;
}

// === Altura vault timeline ==============================================
// Vault opened: 2025-12-23. First 7 days = OG (deposited by 2025-12-30).
// Epoch 0 ran: 2025-12-29 → 2026-01-30.
const ALTURA_OG_CUTOFF_MS = Date.UTC(2025, 11, 30, 23, 59, 59);
const EPOCH_0_START_MS = Date.UTC(2025, 11, 29, 0, 0, 0);
const EPOCH_0_END_MS = Date.UTC(2026, 0, 30, 23, 59, 59);
const APY_LEGEND_MIN_AGE_MS = 60 * 24 * 60 * 60 * 1000; // 60 days

// ---------- Catalog ------------------------------------------------------

const VAULT: Record<string, Archetype> = {
  og: {
    key: "altura_og",
    name: "Altura OG",
    emoji: "🏛️",
    descriptions: [
      "Week one. You were here before the chatter started.",
      "First seven days. Not a lot of people can say that.",
      "Deposited when most people hadn't heard of Altura yet.",
    ],
    source: "vault",
  },
  epoch0: {
    key: "epoch_0_survivor",
    name: "Epoch 0 Survivor",
    emoji: "⚔️",
    descriptions: [
      "Day one in YieldRun. Nobody gave you a medal but we see you.",
      "Been here since epoch zero. The basis points added up.",
      "Survived epoch zero. Everyone catching up now owes you.",
    ],
    source: "vault",
  },
  apyLegend: {
    key: "apy_legend",
    name: "80%+ APY Legend",
    emoji: "📈",
    descriptions: [
      "Got in when the APY was silly. Probably insufferable about it, deservedly so.",
      "Deposited 60+ days ago when yields were wild. The math worked out.",
      "Caught the boosted era. Avoided the latecomer tax.",
    ],
    source: "vault",
  },
  gigachad: {
    key: "gigachad",
    name: "Altura Gigachad",
    emoji: "💎",
    descriptions: [
      "$5K+ in the vault. You're clearly not here for the vibes.",
      "Over $5K deposited. The number speaks for you.",
      "Gigachad-sized position. Everyone else coping.",
    ],
    source: "vault",
  },
  babyWhale: {
    key: "baby_whale",
    name: "Baby Whale",
    emoji: "🐋",
    descriptions: [
      "Solidly in the vault. Gigachad in training, we're lucky to have you.",
      "$1K–$5K in. Not small, not whale, very much here.",
      "Mid-range deposit, long-range conviction.",
    ],
    source: "vault",
  },
  diamond: {
    key: "diamond",
    name: "Diamond Hands",
    emoji: "🤲",
    descriptions: [
      "Deposited once. Never touched it. That's the whole play.",
      "Never pressed withdraw. Not even on the red days.",
      "Zero withdrawals. Either patient or forgot the password.",
    ],
    source: "vault",
  },
};

const X_TITLES: Record<string, Archetype> = {
  // --- Tier 1: specific ---
  ethereumMaxi: {
    key: "ethereum_maxi",
    name: "Ethereum Maxi",
    emoji: "Ξ",
    descriptions: [
      "Still bullish on ETH after all these cycles. Not a lot of people still are.",
      "ETH maxi since the merge. Ultrasound believer.",
      "Ethereum's your religion. The congregation's a bit smaller these days.",
    ],
    source: "x",
  },
  solanaMaxi: {
    key: "solana_maxi",
    name: "Solana Maxi",
    emoji: "◎",
    descriptions: [
      "SOL maxi through every outage. That's genuine conviction.",
      "Solana season, your season. You've been waiting.",
      "Banking on Solana when it was a punchline. Aging well.",
    ],
    source: "x",
  },
  hyperliquidMaxi: {
    key: "hyperliquid_maxi",
    name: "Hyperliquid Maxi",
    emoji: "⚡",
    descriptions: [
      "Tweeting $HYPE since before it was a household name. Still going.",
      "Hyperliquid's biggest fan. Jeff Yan might owe you a thank you note.",
      "Your timeline is 40% HYPE content. Minimum.",
    ],
    source: "x",
  },
  infofi: {
    key: "infofi",
    name: "InfoFi Enjoooyor",
    emoji: "📡",
    descriptions: [
      "Made real $$$ betting on InfoFi last year, but it's hard to let go.",
      "Yapping for mindshare before mindshare was meta.",
      "Kaito leaderboards know your handle better than your friends do.",
    ],
    source: "x",
  },
  perpsDegen: {
    key: "perps_degen",
    name: "Perps Degen",
    emoji: "🎰",
    descriptions: [
      "Longs, shorts, funding rates. You're in it.",
      "High leverage, higher conviction. Or lower. Depends on the day.",
      "Perps trader to the bone. Sleep is optional.",
    ],
    source: "x",
  },
  chartGuy: {
    key: "chart_guy",
    name: "Chart Guy",
    emoji: "📊",
    descriptions: [
      "Resistance broken, target hit. Your charts actually do age well.",
      "Every tweet has a chart. The pattern recognition is genuinely impressive.",
      "TA brain. You see setups where others see noise.",
    ],
    source: "x",
  },
  serYield: {
    key: "ser_yield",
    name: "Ser Yield",
    emoji: "🌾",
    descriptions: [
      "You call everyone ser and actually know what IL is. Not a given on CT.",
      "DeFi native since it was just called farming. The ser is earned.",
      "Ser this, ser that. Receipts attached though.",
    ],
    source: "x",
  },
  airdropHunter: {
    key: "airdrop_hunter",
    name: "Airdrop Hunter",
    emoji: "🎯",
    descriptions: [
      "Wallet full of claim buttons. The hunt beats the payout half the time.",
      "Every testnet, every points meta. You've probably got a spreadsheet.",
      "Season after season, still farming. Patient or broke. Maybe both.",
    ],
    source: "x",
  },
  // --- Tier 2: medium ---
  responsibleDegen: {
    key: "responsible_degen",
    name: "Responsible Degen",
    emoji: "🧪",
    descriptions: [
      "Always in the new shit, never rugged. Suspicious, honestly.",
      "In every mint, out before the dump. You might be cheating.",
      "Degen tendencies, risk-manager patience. Rare combo.",
    ],
    source: "x",
  },
  memecoins: {
    key: "memecoins",
    name: "Bro Stop Posting About Memecoins",
    emoji: "🛑",
    descriptions: [
      "Half of CT wishes they had your degen timing.",
      "You called $trump early. Still posting. Still winning.",
      "Your timeline is a bonding curve. Painful to scroll, occasionally lucrative.",
    ],
    source: "x",
  },
  threadGuy: {
    key: "thread_guy",
    name: "Thread Guy",
    emoji: "🧵",
    descriptions: [
      "Long-form on CT takes guts. You keep writing them anyway.",
      "1/47 threads and counting. Nobody reads them all. You post them anyway.",
      "You tweet in chapters. Someone had to.",
    ],
    source: "x",
  },
  quoteTweetWarrior: {
    key: "qt_warrior",
    name: "Quote Tweet Warrior",
    emoji: "⚔️",
    descriptions: [
      "Quote tweet game strong. Your replies get more engagement than most people's posts.",
      "Short, sharp, sometimes cruel. CT scrolls slower when you QT.",
      "Master of the one-line dunk. The timing sells it.",
    ],
    source: "x",
  },
  ctLurker: {
    key: "ct_lurker",
    name: "CT Lurker",
    emoji: "👀",
    descriptions: [
      "You read more than you tweet. Mogs 90% of CT.",
      "Barely post, see everything. Quiet alpha is still alpha.",
      "Likes everything, tweets nothing. The algorithm knows you well.",
    ],
    source: "x",
  },
  basedTake: {
    key: "based_take",
    name: "Based Take Merchant",
    emoji: "🔥",
    descriptions: [
      "Ratioed today, vindicated tomorrow. The takes age well.",
      "You post like the chart agrees later. And it usually does.",
      "Early, uncomfortable, right. That's the based trajectory.",
    ],
    source: "x",
  },
  // --- Tier 3: broad catch-all ---
  cryptoNative: {
    key: "crypto_native",
    name: "Crypto Native",
    emoji: "🌐",
    descriptions: [
      "You've been in the trenches long enough. No Altura vault position though?",
      "CT veteran, onchain since forever. Might be time to put it to work in Altura.",
      "You know the game. Only thing missing is an Altura position.",
    ],
    source: "x",
  },
};

const NORMIE: Archetype = {
  key: "normie",
  name: "Normie",
  emoji: "🤖",
  descriptions: [
    "Zero onchain footprint. Altura's vault is a good place to start.",
    "Nothing to show for it yet. Your Altura arc starts now.",
    "Blank slate. Your first move? The Altura vault.",
  ],
  source: "fallback",
};

// ---------- Variant picker ----------------------------------------------

/**
 * Deterministically pick one of the 3 description variants for a given user.
 * Hashing the lowercased username gives:
 *   - same user → same variant every time (stable across refreshes/sessions)
 *   - different users with same title → different variants (no copy-paste cards)
 *
 * Distribution is weighted 4/3/3 toward variant 0 — the feedback author flagged
 * variant #1 (index 0) as the preferred default, so we lean on it slightly
 * without ever excluding the others.
 */
function pickDescription(
  username: string,
  variants: readonly [string, string, string],
): string {
  const lower = username.toLowerCase();
  let hash = 5381;
  for (let i = 0; i < lower.length; i++) {
    // djb2 — cheap, decent distribution for short strings.
    hash = ((hash << 5) + hash + lower.charCodeAt(i)) | 0;
  }
  const bucket = Math.abs(hash) % 10;
  const idx = bucket < 4 ? 0 : bucket < 7 ? 1 : 2;
  return variants[idx]!;
}

function resolve(archetype: Archetype, username: string): ResolvedArchetype {
  return {
    key: archetype.key,
    name: archetype.name,
    emoji: archetype.emoji,
    description: pickDescription(username, archetype.descriptions),
    source: archetype.source,
  };
}

// ---------- Vault classifier --------------------------------------------

function classifyVault(altura: AlturaSummary | null): {
  archetype: Archetype;
  trigger: string;
} | null {
  if (!altura || !altura.isHolder) return null;

  const deposited = altura.totalDepositedUSD;
  const firstDeposit = altura.firstDepositTimestampMs;
  const lastUpdated = altura.lastUpdatedTimestampMs;

  // 1. Altura OG — first deposit in vault's first 7 days (≤ Dec 30, 2025)
  //    Only fires when we know the first deposit was actually in that window.
  //    `firstDepositTimestampMs` is only set when transferCount === 1 (see
  //    altura.ts) — multi-deposit users fall through. Fixable on Altura's side
  //    by exposing a real first-deposit timestamp on the snapshot response.
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

  // 3. 80%+ APY Legend — deposited ≥ 60 days ago ("rode the boosted era").
  //    We use firstDeposit when we have it, else fall back to lastUpdated as a
  //    safe lower bound: if the MOST RECENT deposit was ≥60 days ago, the FIRST
  //    deposit must have been too. The inverse isn't true (multi-deposit users
  //    who recently topped up an old position are missed), but that's the same
  //    trade-off OG/Epoch 0 already make.
  const effectiveDepositAge = firstDeposit ?? lastUpdated;
  if (
    effectiveDepositAge &&
    Date.now() - effectiveDepositAge >= APY_LEGEND_MIN_AGE_MS
  ) {
    return { archetype: VAULT.apyLegend!, trigger: "vault:apy_legend" };
  }

  // 4. Altura Gigachad — > $5k deposited
  if (deposited > 5000) {
    return { archetype: VAULT.gigachad!, trigger: "vault:gigachad" };
  }

  // 5. Baby Whale — $1k to $5k deposited
  if (deposited >= 1000 && deposited <= 5000) {
    return { archetype: VAULT.babyWhale!, trigger: "vault:baby_whale" };
  }

  // 6. Diamond Hands — any deposit, no withdrawals (proxy: positive balance)
  if (deposited > 0) {
    return { archetype: VAULT.diamond!, trigger: "vault:diamond_hands" };
  }

  return null;
}

// ---------- X content classifier (tiered + score-based) -----------------

/**
 * Count occurrences of any term inside `text`, with smart boundaries:
 *   - $-prefixed tickers ($hype, $arb, ...)         → match exact token
 *   - hyphenated/dotted/multiword phrases           → match as literal phrase
 *   - plain words                                    → match with word boundaries
 *
 * All matching is case-insensitive. Boundaries use lookaround for "not a
 * letter or digit" so we don't get false partials inside other words.
 */
function hasAny(text: string, terms: readonly string[]): number {
  const lower = text.toLowerCase();
  let total = 0;
  for (const raw of terms) {
    const term = raw.toLowerCase();
    const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const pattern = new RegExp(`(?<![a-z0-9])${escaped}(?![a-z0-9])`, "g");
    const matches = lower.match(pattern);
    if (matches) total += matches.length;
  }
  return total;
}

// === Keyword catalogs (v2.0, all case-insensitive) =====================

const KW_ETHEREUM = [
  "ethereum",
  "eth",
  "$eth",
  "vitalik",
  "ultrasound money",
  "ultrasound",
  "the merge",
  "merge",
  "ethcc",
  "devcon",
  "eip",
  "eip-1559",
  "ethereum mainnet",
  "erc-20",
  "erc20",
  "erc-721",
  "beacon chain",
];

const KW_SOLANA = [
  "solana",
  "sol",
  "$sol",
  "toly",
  "mert",
  "helius",
  "solana season",
  "solana summer",
  "breakpoint",
  "jito",
  "$jito",
  "$jto",
  "phantom wallet",
  "spl",
  "solana mainnet",
  "firedancer",
];

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

const KW_PERPS = [
  "perps",
  "perp",
  "perpetual",
  "leverage",
  "leveraged",
  "10x",
  "25x",
  "50x",
  "100x",
  "longed",
  "shorted",
  "liquidated",
  "liquidation",
  "funding rate",
  "funding rates",
  "open interest",
  "oi",
  "liq",
  "liqd",
  "got liq'd",
  "long squeeze",
  "short squeeze",
  "margin call",
  "isolated margin",
  "cross margin",
];

const KW_CHART = [
  "fib",
  "fibonacci",
  "resistance",
  "support",
  "rsi",
  "setup",
  "long",
  "short",
  "sl",
  "tp",
  "breakout",
  "breakdown",
  "double top",
  "double bottom",
  "head and shoulders",
  "elliott wave",
  "trendline",
  "trend line",
  "moving average",
  "ma200",
  "ma50",
  "ema",
  "macd",
  "wedge",
  "flag pattern",
  "bull flag",
  "bear flag",
  "retrace",
  "retracement",
  "pivot",
];

const KW_SER_YIELD = [
  "ser",
  "impermanent loss",
  "il",
  "pendle",
  "$pendle",
  "yearn",
  "$yfi",
  "convex",
  "$cvx",
  "curve",
  "$crv",
  "aave",
  "$aave",
  "compound",
  "$comp",
  "morpho",
  "$morpho",
  "ondo",
  "$ondo",
  "ethena",
  "$ena",
  "$usde",
  "yield farming",
  "liquidity mining",
  "yield farmer",
  "pt tokens",
  "yt tokens",
  "lp position",
  "lp pool",
  "liquidity pool",
  "autocompound",
  "auto-compound",
  "restaking",
  "eigenlayer",
  "$eigen",
  "lido",
  "$ldo",
  "rocket pool",
  "$rpl",
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

/** Discipline signal for Responsible Degen — paired with degen activity to
 *  distinguish "always chasing, no risk management" from "chases + survives". */
const KW_DISCIPLINE = [
  "took profit",
  "take profit",
  "took profits",
  "taking profits",
  "cashed out",
  "cash out",
  "sold half",
  "sold some",
  "trim",
  "trimming",
  "trimmed",
  "scaled out",
  "scale out",
  "scale in",
  "dyor",
  "due diligence",
  "risk management",
  "risk manage",
  "manage risk",
  "position size",
  "size in",
  "sized in",
  "size up",
  "stop loss",
  "stopped out",
  "cut losses",
  "cut loss",
  "cut my losses",
  "risk off",
  "risk-off",
  "not financial advice",
  "nfa",
  "derisk",
  "de-risk",
  "took the win",
  "booked profits",
];

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

/**
 * CT Lurker heuristic — based on user-level metrics, not tweet content.
 * A lurker has an audience but posts infrequently. We score:
 *   - strong lurker:    followers ≥ 1000 and tweet_count < 300       → 2.0
 *   - qualifying lurker: followers ≥ 200 and tweet_count < 500        → 1.2
 *   - otherwise:                                                        0.0
 *
 * Score is returned as the number-of-"matches" input to the score engine
 * (threshold 1). 1.2+ always qualifies; lower doesn't.
 */
function ctLurkerScore(user: XUser): number {
  const m = user.public_metrics;
  if (!m) return 0;
  const { followers_count, tweet_count } = m;
  if (followers_count >= 1000 && tweet_count < 300) return 2;
  if (followers_count >= 200 && tweet_count < 500) return 1.2;
  return 0;
}

interface TweetSignals {
  ethereum: number;
  solana: number;
  hyperliquid: number;
  infofi: number;
  perps: number;
  chart: number;
  serYield: number;
  airdrops: number;
  responsibleDegen: number;
  memecoins: number;
  threads: number;
  quoteTweets: number;
  basedTakes: number;
  cryptoNative: number;
}

function analyzeTweets(tweets: XTweet[]): TweetSignals {
  const joined = tweets.map((t) => t.text).join("\n");

  const memecoins = hasAny(joined, KW_MEMECOINS);
  const airdrops = hasAny(joined, KW_AIRDROPS);
  const perps = hasAny(joined, KW_PERPS);
  const discipline = hasAny(joined, KW_DISCIPLINE);

  // Responsible Degen = intersection of degen activity + discipline language.
  // Score is min(degen, discipline) so both sides must contribute, and the
  // rule gets a higher score the more balanced the user is.
  const degenActivity = memecoins + airdrops + perps;
  const responsibleDegen = Math.min(degenActivity, discipline);

  return {
    ethereum: hasAny(joined, KW_ETHEREUM),
    solana: hasAny(joined, KW_SOLANA),
    hyperliquid: hasAny(joined, KW_HYPERLIQUID),
    infofi: hasAny(joined, KW_INFOFI),
    perps,
    chart: hasAny(joined, KW_CHART),
    serYield: hasAny(joined, KW_SER_YIELD),
    airdrops,
    responsibleDegen,
    memecoins,
    threads: countThreadSignals(tweets),
    quoteTweets: countQTLikePosts(tweets),
    basedTakes: hasAny(joined, KW_BASED_TAKES),
    cryptoNative: hasAny(joined, KW_CRYPTO_NATIVE),
  };
}

interface XRule {
  archetype: Archetype;
  trigger: string;
  /** Number of matches the user produced for this rule. */
  matches: number;
  /** Minimum matches required to qualify. */
  threshold: number;
}

/**
 * Within a single tier: pick the rule with the highest `score = matches/threshold`,
 * where score ≥ 1 (i.e. threshold met). Returns null if no rule in the tier
 * qualifies.
 */
function bestInTier(rules: XRule[]): {
  archetype: Archetype;
  trigger: string;
} | null {
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
  return best ? { archetype: best.archetype, trigger: best.trigger } : null;
}

/**
 * Tiered X classification. Tier 1 (specific) always wins over Tier 2 (medium),
 * which always wins over Tier 3 (broad catch-all). Score is only used to
 * break ties within a tier.
 *
 * Previously (v1.2) we had a single flat score-based pick across all rules,
 * which meant a Perps Degen user whose tweets also hit 5 base-takes would get
 * Based Take Merchant — wrong flex. Tiering fixes that.
 */
function classifyX(xProfile: XProfile | null): {
  archetype: Archetype;
  trigger: string;
} | null {
  if (!xProfile || xProfile.tweets.length === 0) return null;

  const s = analyzeTweets(xProfile.tweets);
  const lurker = ctLurkerScore(xProfile.user);

  // Tier 1 — specific (most flex-worthy, check first)
  const tier1: XRule[] = [
    { archetype: X_TITLES.ethereumMaxi!,   trigger: "x:ethereum_maxi",   matches: s.ethereum,    threshold: 2 },
    { archetype: X_TITLES.solanaMaxi!,     trigger: "x:solana_maxi",     matches: s.solana,      threshold: 2 },
    { archetype: X_TITLES.hyperliquidMaxi!, trigger: "x:hyperliquid",    matches: s.hyperliquid, threshold: 1 },
    { archetype: X_TITLES.infofi!,         trigger: "x:infofi",          matches: s.infofi,      threshold: 1 },
    { archetype: X_TITLES.perpsDegen!,     trigger: "x:perps_degen",     matches: s.perps,       threshold: 2 },
    { archetype: X_TITLES.chartGuy!,       trigger: "x:chart_guy",       matches: s.chart,       threshold: 2 },
    { archetype: X_TITLES.serYield!,       trigger: "x:ser_yield",       matches: s.serYield,    threshold: 2 },
    { archetype: X_TITLES.airdropHunter!,  trigger: "x:airdrop_hunter",  matches: s.airdrops,    threshold: 1 },
  ];
  const t1 = bestInTier(tier1);
  if (t1) return t1;

  // Tier 2 — medium (check only if no Tier 1 qualifies)
  const tier2: XRule[] = [
    { archetype: X_TITLES.responsibleDegen!, trigger: "x:responsible_degen", matches: s.responsibleDegen, threshold: 1 },
    { archetype: X_TITLES.memecoins!,        trigger: "x:memecoins",         matches: s.memecoins,        threshold: 2 },
    { archetype: X_TITLES.threadGuy!,        trigger: "x:thread_guy",        matches: s.threads,          threshold: 1 },
    { archetype: X_TITLES.quoteTweetWarrior!, trigger: "x:qt_warrior",       matches: s.quoteTweets,      threshold: 2 },
    { archetype: X_TITLES.ctLurker!,         trigger: "x:ct_lurker",         matches: lurker,             threshold: 1 },
    { archetype: X_TITLES.basedTake!,        trigger: "x:based_take",        matches: s.basedTakes,       threshold: 2 },
  ];
  const t2 = bestInTier(tier2);
  if (t2) return t2;

  // Tier 3 — broad safety net
  const tier3: XRule[] = [
    { archetype: X_TITLES.cryptoNative!, trigger: "x:crypto_native", matches: s.cryptoNative, threshold: 2 },
  ];
  const t3 = bestInTier(tier3);
  if (t3) return t3;

  return null;
}

// ---------- Main entry ---------------------------------------------------

export function resolvePersona(
  xProfile: XProfile | null,
  altura: AlturaSummary | null,
  username: string,
): PersonaResolution {
  // 1) Vault title wins if present
  const vault = classifyVault(altura);
  if (vault) {
    return {
      archetype: resolve(vault.archetype, username),
      trigger: vault.trigger,
      dataDriven: true,
    };
  }

  // 2) Otherwise an X activity title (tiered: specific → broad)
  const x = classifyX(xProfile);
  if (x) {
    return {
      archetype: resolve(x.archetype, username),
      trigger: x.trigger,
      dataDriven: true,
    };
  }

  // 3) Fallback — Normie
  return {
    archetype: resolve(NORMIE, username),
    trigger: "fallback:normie",
    dataDriven: false,
  };
}
