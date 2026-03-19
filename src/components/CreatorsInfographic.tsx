const vettingSteps = [
  {
    label: "Cookie3 Audit",
    desc: "Audience authenticity score",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.3" />
        <path d="M6 9l2 2 4-4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: "Kaito Mindshare",
    desc: "Narrative alignment check",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M9 2l2 5h5l-4 3 1.5 5L9 12l-4.5 3L6 10 2 7h5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: "No Bots Policy",
    desc: "Zero shillers or fake reach",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <rect x="2" y="5" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.3" />
        <path d="M6 5V4a3 3 0 016 0v1" stroke="currentColor" strokeWidth="1.3" />
      </svg>
    ),
  },
  {
    label: "Approved",
    desc: "Added to Creator Wire",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M3 9l4 4 8-8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

const tiers = [
  { title: "Tier 1", badge: "Max Reach", names: "@Dubzy · @CryptoBanter · @AltcoinDaily · @CryptoLark · @KyleChasse · @MartiniGuyYT · @Ash Crypto" },
  { title: "DeFi Researchers", badge: "Credibility", names: "@Shahh · @Conorkenny · @CryptoGirlNova · @CryptoMichNL · @Ivanontech · @Nicholas_Merten" },
  { title: "Airdrop Creators", badge: "Community", names: "@jussy_world · @NDIDI_GRAM · @bloomstarbms · @alphabatcher · @0xChainMind · @farmercist_eth" },
];

const CreatorsInfographic = () => {
  return (
    <div className="mt-1">
      <div className="font-mono text-[0.65rem] tracking-[0.2em] uppercase text-[#1800AC]/40 mb-3">
        Vetting Process
      </div>
      <div className="flex items-start">
        {vettingSteps.map((step, i) => (
          <div key={i} className="contents">
            <div className="flex-1 flex flex-col items-center gap-2.5 text-center p-4 rounded-xl bg-white/50 hover:bg-white/75 transition-colors duration-200 text-[#1800AC]">
              <div className="w-10 h-10 rounded-xl bg-[#1800AC]/10 flex items-center justify-center">
                {step.icon}
              </div>
              <div className="font-mono text-xs font-medium text-[#1800AC]">{step.label}</div>
              <div className="text-xs text-[#1800AC]/55 leading-snug">{step.desc}</div>
            </div>
            {i < vettingSteps.length - 1 && (
              <div className="px-1.5 text-[#1800AC]/25 text-sm shrink-0 pt-10">→</div>
            )}
          </div>
        ))}
      </div>

      <div className="h-px bg-[#1800AC]/10 my-6" />

      <div className="font-mono text-[0.65rem] tracking-[0.2em] uppercase text-[#1800AC]/40 mb-3">
        Creator Tiers
      </div>
      <div className="flex flex-col gap-2">
        {tiers.map((tier, i) => (
          <div key={i} className="bg-white/55 rounded-xl p-4 flex flex-col gap-2 hover:bg-white/75 transition-colors duration-200">
            <div className="flex items-center gap-2.5">
              <div className="font-mono text-sm font-medium text-[#1800AC]">{tier.title}</div>
              <div className="font-mono text-xs px-2.5 py-0.5 rounded-full bg-[#1800AC]/10 text-[#1800AC]/65">
                {tier.badge}
              </div>
            </div>
            <div className="font-mono text-xs text-[#1800AC]/50 leading-relaxed">{tier.names}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CreatorsInfographic;
