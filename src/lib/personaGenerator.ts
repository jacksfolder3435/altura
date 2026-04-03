export interface PersonaResult {
  username: string;
  archetype: { name: string; emoji: string; description: string };
  traits: string[];
  topics: string[];
  engagementStyle: string;
  audienceType: string;
  gradient: { from: string; mid: string; to: string; accent: string };
  stats: {
    analyzed: number;
    engagement: string;
    reach: string;
    analyticsScore: number;
    precision: number;
    depth: number;
    signal: number;
    scale: number;
    voiceConsistency: number;
    engagementScore: number;
  };
}

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

const ARCHETYPES = [
  // Vault Data profiles
  { name: "Altura Gigachad", emoji: "💎", description: ">$5K deposited in vault or AVLT on Pendle. You don't just talk the talk — your wallet backs it up." },
  { name: "Diamond Hands", emoji: "🤲", description: "Has never withdrawn. Just sits and compounds. Your patience is your superpower." },
  { name: "80%+ APY Legend", emoji: "📈", description: "Deposited 60+ days ago, rode the early boosted yields. You were here before it was cool." },
  { name: "Altura OG", emoji: "🏛️", description: "Deposited in the first week. You believed before there was proof. Respect." },
  { name: "Epoch 0 Survivor", emoji: "⚔️", description: "Was in YieldRun from day one. Battle-tested and still standing." },
  { name: "Baby Whale", emoji: "🐋", description: "$1K–$5K deposited. Not quite Gigachad yet. But you're on your way." },
  { name: "Pendle LP Degen", emoji: "🧪", description: "Providing liquidity on the Pendle pool, not just holding PT. You actually understand yield." },
  // X Activity profiles
  { name: "Hyperliquid Maxi", emoji: "⚡", description: "Tweets about HYPE non-stop. Stopped working after the airdrop, full-time X creator now." },
  { name: "Bro Stop Posting About Memecoins", emoji: "🛑", description: "Self-explanatory. Half of CT qualifies. Your timeline is 90% dog coins and regret." },
  { name: "InfoFi Enjooooyor", emoji: "📡", description: "Still tweeting about InfoFi. It's been dead for 3 months. Someone tell them." },
  { name: "CT Lurker", emoji: "👀", description: "Barely posts, likes everything. 90% likes and 10% 'gm.' The silent majority." },
  { name: "Airdrop Hunter", emoji: "🎯", description: "Tweets about every testnet and points program. 200 protocols, 0 airdrops." },
  { name: "Thread Guy", emoji: "🧵", description: "Posts 1/47 threads. Never finishes. The graveyard of unfinished alpha is vast." },
  { name: "Quote Tweet Warrior", emoji: "⚔️", description: "Ratio game strong. Original content nonexistent. You live to dunk." },
];

const ALL_TRAITS = [
  "Degen", "Diamond Hands", "Paper Hands", "Alpha Hunter", "Contrarian",
  "On-Chain Sleuth", "Thread Boi", "Yield Farmer", "Gas Optimizer", "Airdrop Hunter",
  "Whale Watcher", "Liquidity Sniper", "Governance Maxi", "Memetic", "Based",
  "Ngmi-Resistant", "Rug-Proof", "Conviction-Pilled", "Narratoor", "Exit Liquidity",
];

const ALL_TOPICS = [
  "DeFi Protocols", "NFT Culture", "Layer 2 Scaling", "MEV & Flashbots", "Tokenomics",
  "DAO Governance", "Zero-Knowledge Proofs", "Restaking", "Memecoin Meta", "On-Chain Analytics",
  "Airdrop Farming", "Liquid Staking", "Cross-Chain Bridges", "Perpetual DEXs", "Real World Assets",
  "Account Abstraction", "Modular Blockchains", "Intent-Based Trading", "Social Tokens", "AI x Crypto",
];

const ENGAGEMENT_STYLES = [
  "Mega-threads that go viral at 3am",
  "One-word replies that somehow get 1000 likes",
  "Contrarian takes that age like fine wine",
  "Charts with mysterious circles and arrows",
  "Deep-dive alpha that nobody reads",
  "Ratio-ing influencers for sport",
];

const AUDIENCE_TYPES = [
  "CT Degens & Shitposters",
  "DeFi Power Users",
  "NFT Collectors & Flippers",
  "Protocol Researchers",
  "Airdrop Farmers",
  "Crypto VCs & Fund Managers",
];

const GRADIENTS = [
  { from: "#0f0c29", mid: "#302b63", to: "#24243e", accent: "#7c3aed" },
  { from: "#000428", mid: "#004e92", to: "#000428", accent: "#0ea5e9" },
  { from: "#0f2027", mid: "#203a43", to: "#2c5364", accent: "#06b6d4" },
  { from: "#1a0533", mid: "#2d0a6e", to: "#0d0d2b", accent: "#a855f7" },
  { from: "#0a1628", mid: "#0d2137", to: "#051020", accent: "#3b82f6" },
  { from: "#1a0e00", mid: "#3d2000", to: "#1a0e00", accent: "#f97316" },
  { from: "#001a0a", mid: "#003d1a", to: "#001a0a", accent: "#10b981" },
  { from: "#1a0a14", mid: "#3d0a28", to: "#1a0a14", accent: "#ec4899" },
];

export function parseUsername(input: string): string {
  input = input.trim();
  const urlMatch = input.match(/(?:twitter\.com|x\.com)\/([^/?#\s]+)/);
  if (urlMatch) return urlMatch[1].toLowerCase();
  if (input.startsWith("@")) return input.slice(1).toLowerCase();
  return input.toLowerCase();
}

const EASTER_EGGS: Record<string, number> = {
  jackhaldorsson: 8, // The Signal Hunter
};

export function generatePersona(username: string): PersonaResult {
  const hash = hashString(username);
  const rand = seededRandom(hash);

  const forcedIdx = EASTER_EGGS[username.toLowerCase()];
  const archetype = forcedIdx !== undefined ? ARCHETYPES[forcedIdx] : ARCHETYPES[Math.floor(rand() * ARCHETYPES.length)];

  const traitPool = [...ALL_TRAITS];
  const traits: string[] = [];
  for (let i = 0; i < 3; i++) {
    const idx = Math.floor(rand() * traitPool.length);
    traits.push(traitPool.splice(idx, 1)[0]);
  }

  const topicPool = [...ALL_TOPICS];
  const topics: string[] = [];
  for (let i = 0; i < 3; i++) {
    const idx = Math.floor(rand() * topicPool.length);
    topics.push(topicPool.splice(idx, 1)[0]);
  }

  const engagementStyle = ENGAGEMENT_STYLES[Math.floor(rand() * ENGAGEMENT_STYLES.length)];
  const audienceType = AUDIENCE_TYPES[Math.floor(rand() * AUDIENCE_TYPES.length)];
  const gradient = GRADIENTS[Math.floor(rand() * GRADIENTS.length)];

  const analyzed = 200 + Math.floor(rand() * 2800);
  const engagement = (1 + rand() * 8).toFixed(1) + "%";
  const reach = Math.floor(rand() * 900 + 100) + "K";

  const analyticsScore = 52 + Math.floor(rand() * 43);
  const precision = 12 + Math.floor(rand() * 14);
  const depth = 12 + Math.floor(rand() * 14);
  const signal = 12 + Math.floor(rand() * 14);
  const scale = 12 + Math.floor(rand() * 14);
  const voiceConsistency = 58 + Math.floor(rand() * 39);
  const engagementScore = 55 + Math.floor(rand() * 41);

  return {
    username,
    archetype,
    traits,
    topics,
    engagementStyle,
    audienceType,
    gradient,
    stats: { analyzed, engagement, reach, analyticsScore, precision, depth, signal, scale, voiceConsistency, engagementScore },
  };
}
