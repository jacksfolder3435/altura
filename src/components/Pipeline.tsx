import lunarTeam from "@/assets/lunar_team.avif";
import PhaseCard from "./PhaseCard";
import GoalsInfographic from "./GoalsInfographic";
import StrategyInfographic from "./StrategyInfographic";
import SocialMediaInfographic from "./SocialMediaInfographic";
import PRInfographic from "./PRInfographic";
import CreatorsInfographic from "./CreatorsInfographic";
import BudgetInfographic from "./BudgetInfographic";

const phases = [
  {
    number: 1,
    title: "About Lunar Strategy",
    description: "An award-winning Web3 agency supporting crypto projects since 2019. Proven track record across PR, social media, influencer marketing, and ads.",
    items: [],
    special: "about",
    stats: [
      { name: "250+", desc: "Clients served including Polkadot, ICP, OKX, Solana, Cardano, MultiversX" },
      { name: "30+", desc: "Professionals in team across strategy, creative, PR, and community" },
      { name: "1000+", desc: "KOLs in network across YouTube and X, 6+ years in market" },
    ],
  },
  {
    number: 2,
    title: "Campaign Goals",
    description: "Four strategic objectives designed to take NESA from pre-TGE to a dominant, credible onchain AI brand.",
    items: [],
    special: "goals",
  },
  {
    number: 3,
    title: "Go-To-Market Strategy",
    tag: "Phase 1",
    description: "We begin every engagement with a deep dive into your project foundations. A 1-2 hour live Miro workshop with your core team follows to gather insights and clarify objectives.",
    items: [],
    special: "strategy",
  },
  {
    number: 4,
    title: "Social Media",
    tag: "Phase 2",
    description: "In crypto, your X account is your identity. It's not just a marketing channel — it's the front door to your project. Where users judge credibility, track updates, and connect emotionally.",
    items: [],
    special: "social",
  },
  {
    number: 5,
    title: "PR Activities",
    tag: "Credibility",
    description: "Thought leadership and market positioning initiative leveraging a mix of content formats in top-tier media to establish NESA as the definitive onchain AI infrastructure layer.",
    items: [],
    special: "pr",
  },
  {
    number: 6,
    title: "Content Creators",
    tag: "Creator Wire",
    description: "All creators vetted through Cookie3 analytics and Kaito Mindshare tracking. No shillers, no bots — only quality audiences with verified engagement and authentic reach.",
    items: [],
    special: "creators",
  },
  {
    number: 7,
    title: "Creator Wire Process",
    tag: "Operations",
    description: "A structured four-stage activation process ensuring every creator delivers narrative-aligned content on time and to brief.",
    items: [
      { name: "Onboarding", desc: "Create campaign brief, send onboarding form via Creator Wire, curate final creator list from responses" },
      { name: "Content Preparation", desc: "Prepare weekly content briefs, brief onboarded creators with campaign narrative and guidelines" },
      { name: "Campaign Live", desc: "Send weekly briefs per predetermined content cadence, collect creator content weekly" },
      { name: "Reporting", desc: "Weekly overview on content output plus final campaign performance report with all KPIs" },
    ],
  },
  {
    number: 8,
    title: "Budget Breakdown",
    tag: "Investment",
    description: "Phased across Kick Off and Momentum. Clear fees per service with defined deliverables.",
    items: [],
    special: "budget",
  },
  {
    number: 9,
    title: "Advisory Team",
    description: "The Lunar advisory leadership team has been at the forefront of Web3 marketing since 2019, with direct experience across 250+ project launches from seed to TGE.",
    items: [
      { name: "Tim Haldorsson", file: "CEO / Advisor", desc: "5+ years experience working with Polkadot, MultiversX, and 200+ more projects" },
      { name: "Jack Haldorsson", file: "CMO / Advisor", desc: "5+ years experience leading content strategy and brand positioning across 200+ projects" },
      { name: "Adam Westeren", file: "Strategy Advisory", desc: "5+ years delivering impactful go-to-market strategies across 100+ project launches" },
    ],
  },
];

const Pipeline = () => {
  return (
    <div className="w-full px-8 md:px-12 relative z-[5]">
      <section className="py-12 pb-24">
        <div className="font-mono text-[0.65rem] tracking-[0.25em] uppercase text-[#1800AC]/40 mb-12 ml-[60px]">
          Campaign Structure — 9 phases
        </div>
        <div className="relative">

          {phases.map((phase) => (
            <PhaseCard
              key={phase.number}
              number={phase.number}
              title={phase.title}
              tag={phase.tag}
              description={phase.description}
              items={phase.items}
            >
              {phase.special === "about" && phase.stats && (
                <div className="space-y-8">
                  <div className="relative rounded-2xl overflow-hidden aspect-[16/9]">
                    <img
                      src={lunarTeam}
                      alt="Lunar Strategy team"
                      className="w-full h-full object-cover object-center"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#e3f0f9] via-transparent to-transparent opacity-50" />
                  </div>
                  <div className="grid grid-cols-3 gap-6">
                    {phase.stats.map((stat, i) => (
                      <div key={i} className="text-center space-y-2 p-5 rounded-xl bg-white/55">
                        <div className="font-display text-4xl font-bold text-[#1800AC] tracking-tight">{stat.name}</div>
                        <div className="text-xs leading-relaxed text-[#1800AC]/55 max-w-[200px] mx-auto">{stat.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {phase.special === "goals" && <GoalsInfographic />}
              {phase.special === "strategy" && <StrategyInfographic />}
              {phase.special === "social" && <SocialMediaInfographic />}
              {phase.special === "pr" && <PRInfographic />}
              {phase.special === "creators" && <CreatorsInfographic />}
              {phase.special === "budget" && <BudgetInfographic />}
            </PhaseCard>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Pipeline;
