const outputStats = [
  { num: "25", label: "X Posts", sub: "static, GIFs, video" },
  { num: "4", label: "Animated", sub: "motion posts" },
  { num: "1", label: "Promo Video", sub: "30–40 sec" },
  { num: "1", label: "KPI Report", sub: "monthly tracking" },
];

const pillars = [
  {
    title: "Consistency",
    desc: "Daily presence with a structured content calendar — every post mapped to the NESA narrative",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.4" opacity="0.9" />
        <path d="M10 6v4l3 2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "Credibility",
    desc: "Founder-led content, thought leadership threads, and X profile optimisation that builds trust",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M10 2L12.5 7.5H18L13.5 11L15.5 17L10 13.5L4.5 17L6.5 11L2 7.5H7.5L10 2Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: "Community",
    desc: "Reply guy, AMAs, Galxe quests and incentive campaigns that grow and retain the base",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M3 10c0-3.9 3.1-7 7-7s7 3.1 7 7-3.1 7-7 7-7-3.1-7-7z" stroke="currentColor" strokeWidth="1.4" />
        <path d="M10 6v4M10 14h.01" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    ),
  },
];

const contentMix = [
  { name: "Educational", pct: 75 },
  { name: "Culture / Memes", pct: 55 },
  { name: "Product Updates", pct: 45 },
  { name: "Founder Threads", pct: 35 },
];

const SocialMediaInfographic = () => {
  return (
    <div className="mt-1">
      {/* Monthly Output */}
      <div className="font-mono text-[0.65rem] tracking-[0.2em] uppercase text-[#1800AC]/40 mb-3">
        Monthly Output
      </div>
      <div className="grid grid-cols-4 gap-3">
        {outputStats.map((s, i) => (
          <div key={i} className="bg-white/55 rounded-xl p-5 flex flex-col gap-1.5">
            <div className="font-display text-3xl font-bold text-[#1800AC] leading-none">{s.num}</div>
            <div className="font-mono text-xs font-medium text-[#1800AC]">{s.label}</div>
            <div className="text-xs text-[#1800AC]/50">{s.sub}</div>
          </div>
        ))}
      </div>

      <div className="h-px bg-[#1800AC]/10 my-6" />

      {/* Three Pillars */}
      <div className="font-mono text-[0.65rem] tracking-[0.2em] uppercase text-[#1800AC]/40 mb-3">
        Three Pillars
      </div>
      <div className="grid grid-cols-3 gap-3">
        {pillars.map((p, i) => (
          <div key={i} className="p-5 rounded-xl bg-white/50 hover:bg-white/75 transition-colors duration-200 flex flex-col gap-2.5 text-[#1800AC]">
            <div className="w-10 h-10 rounded-xl bg-[#1800AC]/10 flex items-center justify-center">
              {p.icon}
            </div>
            <div className="font-mono text-sm font-medium text-[#1800AC]">{p.title}</div>
            <div className="text-sm text-[#1800AC]/55 leading-snug">{p.desc}</div>
          </div>
        ))}
      </div>

      <div className="h-px bg-[#1800AC]/10 my-6" />

      {/* Content Mix */}
      <div className="font-mono text-[0.65rem] tracking-[0.2em] uppercase text-[#1800AC]/40 mb-3">
        Content Mix
      </div>
      <div className="flex flex-col gap-3">
        {contentMix.map((item, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="font-mono text-sm text-[#1800AC]/55 w-[130px] shrink-0">{item.name}</div>
            <div className="flex-1 h-1.5 bg-[#1800AC]/10 rounded-full overflow-hidden">
              <div className="h-full bg-[#1800AC] rounded-full" style={{ width: `${item.pct}%`, opacity: 0.7 - i * 0.1 }} />
            </div>
            <div className="font-mono text-xs text-[#1800AC]/45 w-10 text-right shrink-0">{item.pct}%</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SocialMediaInfographic;
