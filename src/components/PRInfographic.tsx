const formats = [
  { num: "01", title: "Leadership Interview", desc: "Founding team vision and expertise. Builds trust and authority in the space." },
  { num: "02", title: "Deep-Dive Article", desc: "Problem, solution, and value proposition. Educates users and investors at top of funnel." },
  { num: "03", title: "Opinion Editorial", desc: "Positions NESA within AI privacy and onchain inference trends. Clear differentiation." },
  { num: "04", title: "Press Releases", desc: "Partnerships, milestones, and ecosystem growth to maintain media momentum at TGE." },
];

const outlets = ["CoinTelegraph", "CoinDesk", "The Block", "Forbes", "The Defiant", "Crypto Banter", "BeInCrypto", "CryptoSlate"];

const deliverables = [
  { num: "2", label: "T1 Articles" },
  { num: "1", label: "Interview" },
  { num: "1", label: "Research Paper" },
  { num: "1", label: "Follow-Up" },
];

const PRInfographic = () => {
  return (
    <div className="mt-1">
      <div className="font-mono text-[0.65rem] tracking-[0.2em] uppercase text-[#1800AC]/40 mb-3">
        Content Formats
      </div>
      <div className="flex flex-col">
        {formats.map((f, i) => (
          <div key={i}>
            <div className="flex items-start gap-4 py-3.5">
              <div className="font-mono text-xs font-medium text-[#1800AC]/40 w-[22px] shrink-0 pt-0.5">{f.num}</div>
              <div>
                <div className="font-mono text-sm font-medium text-[#1800AC] mb-1">{f.title}</div>
                <div className="text-sm text-[#1800AC]/55 leading-snug">{f.desc}</div>
              </div>
            </div>
            {i < formats.length - 1 && (
              <div className="h-px bg-[#1800AC]/10 ml-9" />
            )}
          </div>
        ))}
      </div>

      <div className="h-px bg-[#1800AC]/10 my-6" />

      <div className="font-mono text-[0.65rem] tracking-[0.2em] uppercase text-[#1800AC]/40 mb-3">
        Target Outlets
      </div>
      <div className="flex flex-wrap gap-2">
        {outlets.map((o) => (
          <div key={o} className="font-mono text-xs px-3.5 py-2 rounded-full bg-white/60 text-[#1800AC]/65 hover:bg-white/85 hover:text-[#1800AC] transition-colors duration-200 cursor-default">
            {o}
          </div>
        ))}
      </div>

      <div className="h-px bg-[#1800AC]/10 my-6" />

      <div className="font-mono text-[0.65rem] tracking-[0.2em] uppercase text-[#1800AC]/40 mb-3">
        Phase Deliverables
      </div>
      <div className="grid grid-cols-4 gap-3">
        {deliverables.map((d, i) => (
          <div key={i} className="bg-white/55 rounded-xl p-5 flex flex-col gap-1.5">
            <div className="font-display text-3xl font-bold text-[#1800AC] leading-none">{d.num}</div>
            <div className="font-mono text-xs text-[#1800AC]/50">{d.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PRInfographic;
