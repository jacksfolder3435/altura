const phase1 = [
  { price: "$15,000", suffix: "", title: "GTM Strategy", details: "Narrative framework · Audience segmentation · Competitor analysis · Launch timeline" },
  { price: "$7,500", suffix: "/mo", title: "Social Media", details: "25 X posts + 4 animated · 1 promo video · Profile optimization · KPI reporting" },
  { price: "$10,000", suffix: "", title: "Content Creators", details: "$5k fee + $5k creator budget · Strategy · Curated list · Management · Report" },
  { price: "$5,000", suffix: "", title: "PR", details: "2 T1 articles · 1 interview · 1 research paper · Post media follow-up" },
];

const phase2 = [
  { price: "$7,500", suffix: "/mo", title: "Social Media", details: "Continued calendar · 25 posts + 4 animated · 1 promo video · Growth campaigns" },
  { price: "$55,000", suffix: "", title: "Content Creators", details: "$5k fee + $50k creator budget · Full Creator Wire activation · Campaign results" },
  { price: "$5,000", suffix: "", title: "Design Studio", details: "1 promo video · GIF animations · Social banners · Ongoing creative support" },
];

const BudgetInfographic = () => {
  return (
    <div className="space-y-7 mb-4">
      <div>
        <div className="font-mono text-[0.65rem] tracking-[0.2em] uppercase text-[#1800AC]/40 mb-3">
          Phase 1 — Kick Off
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {phase1.map((item, i) => (
            <div key={i} className="p-5 rounded-xl bg-white/55 hover:bg-white/75 transition-colors duration-200">
              <div className="font-display text-2xl font-bold text-[#1800AC] leading-none mb-1.5">
                {item.price}
                {item.suffix && <span className="text-sm font-mono text-[#1800AC]/50 ml-0.5">{item.suffix}</span>}
              </div>
              <div className="font-mono text-sm font-medium text-[#1800AC] mb-2">{item.title}</div>
              <div className="text-xs text-[#1800AC]/55 leading-relaxed">{item.details}</div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="font-mono text-[0.65rem] tracking-[0.2em] uppercase text-[#1800AC]/40 mb-3">
          Phase 2 — Momentum
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
          {phase2.map((item, i) => (
            <div key={i} className="p-5 rounded-xl bg-white/55 hover:bg-white/75 transition-colors duration-200">
              <div className="font-display text-2xl font-bold text-[#1800AC] leading-none mb-1.5">
                {item.price}
                {item.suffix && <span className="text-sm font-mono text-[#1800AC]/50 ml-0.5">{item.suffix}</span>}
              </div>
              <div className="font-mono text-sm font-medium text-[#1800AC] mb-2">{item.title}</div>
              <div className="text-xs text-[#1800AC]/55 leading-relaxed">{item.details}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="p-6 rounded-2xl bg-[#1800AC] flex items-center justify-between shadow-[0_4px_24px_rgba(24,0,172,0.25)]">
        <div className="font-mono text-xs tracking-[0.2em] uppercase text-white/60">
          Total Investment
        </div>
        <div className="font-display text-3xl font-bold text-white">
          $105,000
        </div>
      </div>
    </div>
  );
};

export default BudgetInfographic;
