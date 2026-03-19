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
    cmoScore: number;
    authority: number;
    clarity: number;
    influence: number;
    growth: number;
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
  { name: "The Category Creator", emoji: "🗺️", description: "You invented a market category nobody asked for and convinced a VC to fund it anyway." },
  { name: "The Narrative Architect", emoji: "🧱", description: "You've reframed three layoffs as 'strategic pivots.' The board believed you every time." },
  { name: "The Culture Vulture", emoji: "🦅", description: "You spotted the trend 6 months late, called it a campaign, and took credit for the moment." },
  { name: "The Growth Savage", emoji: "⚡", description: "You A/B test your out-of-office. Sleep is just an untested variable." },
  { name: "The Thought Leader", emoji: "🎤", description: "You've said 'content is king' unironically at a conference. You have a newsletter. Obviously." },
  { name: "The Contrarian Marketeer", emoji: "🔄", description: "Your entire go-to-market strategy is just 'everyone else is doing it wrong.' Somehow it works." },
  { name: "AI Slop Marketeer", emoji: "🤖", description: "Suspiciously polished takes, zero original thoughts — sir this is a Wendy's." },
  { name: "NPC Marketeer", emoji: "🪆", description: "Best practices. Industry standards. Proven frameworks. You are the content calendar." },
  { name: "Giga Brain Marketeer", emoji: "🧠", description: "You see 10 moves ahead. The strategy memo reads like a philosophy paper. Everyone's confused but the numbers are up." },
  { name: "Burger Flipper", emoji: "🍟", description: "The tools you ignored are now doing your job better. McDonald's is hiring. Your Slack is quiet. Very quiet." },
  { name: "Copy Pasta Marketeer", emoji: "📋", description: "Your strategy deck is a Frankenstein of three competitor playbooks and a McKinsey slide you found on LinkedIn." },
  { name: "Memecoin Warrior", emoji: "🚀", description: "Brand strategy? Vibes. Budget allocation? Moon or zero. You've used 'ser' in a press release." },
  { name: "Rick Rubin Vibe Marketeer", emoji: "🧘", description: "No slides. No KPIs. You sat in a barn for three weeks and came back with 'the brand needs to breathe.' It worked." },
];

const ALL_TRAITS = [
  "Authentic", "Strategic", "Analytical", "Creative", "Direct",
  "Empathetic", "Innovative", "Thoughtful", "Bold", "Precise",
  "Curious", "Resilient", "Collaborative", "Focused", "Transparent",
  "Persuasive", "Pragmatic", "Energetic", "Calm", "Witty",
];

const ALL_TOPICS = [
  "Tech & AI", "Startups", "Design", "Product Strategy", "Marketing",
  "Leadership", "Culture", "Finance", "Philosophy", "Science",
  "Health & Fitness", "Crypto / Web3", "VC & Investing", "Career Growth", "Writing",
  "Mental Models", "Future of Work", "Developer Tools", "Brand Building", "Geopolitics",
];

const ENGAGEMENT_STYLES = [
  "Long-form threads that go viral",
  "Hot takes that spark debate",
  "Quiet wisdom that ages well",
  "Tactical tips people screenshot",
  "Personal stories that build trust",
  "Data-backed insights that inform",
];

const AUDIENCE_TYPES = [
  "Founders & Builders",
  "Knowledge Workers",
  "Creative Professionals",
  "Investors & Operators",
  "Tech Enthusiasts",
  "Industry Insiders",
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
  jackhaldorsson: 9, // "Soon Working at McDonald's"
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

  const cmoScore = 52 + Math.floor(rand() * 43);
  const authority = 12 + Math.floor(rand() * 14);
  const clarity = 12 + Math.floor(rand() * 14);
  const influence = 12 + Math.floor(rand() * 14);
  const growth = 12 + Math.floor(rand() * 14);
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
    stats: { analyzed, engagement, reach, cmoScore, authority, clarity, influence, growth, voiceConsistency, engagementScore },
  };
}
