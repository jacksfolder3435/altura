const goals = [
  {
    label: "AI Agent Narrative",
    text: "Connect NESA to the AI agents / OpenClaw conversation. Build a creator army and thought leader network amplifying across all socials.",
  },
  {
    label: "TGE Momentum",
    text: "Bring NESA AI to market with momentum. Leverage strong visuals and video to generate buzz and excitement on social media.",
  },
  {
    label: "Market Credibility",
    text: "Establish NESA.ai as a trusted AI infrastructure partner via the Onchain AI Council — leaders building on top of NESA validating the tech.",
  },
  {
    label: "Pre-TGE Investment",
    text: "Targeted VC outreach to bring credible capital into the final pre-TGE round. Narrative and materials crafted to resonate with institutional buyers.",
  },
];

const GoalsInfographic = () => {
  return (
    <div className="flex flex-col gap-2.5">
      {goals.map((goal, i) => (
        <div key={i} className="flex items-center gap-0 relative">
          <div className="w-12 h-12 rounded-xl bg-white/60 flex items-center justify-center shrink-0 relative z-[2]">
            <span className="font-mono text-sm font-medium text-[#1800AC]">
              {String(i + 1).padStart(2, "0")}
            </span>
          </div>
          <div className="w-5 h-px shrink-0 bg-[#1800AC]/15" />
          <div className="flex-1 p-4 rounded-xl bg-white/50 hover:bg-white/75 transition-colors duration-200">
            <div className="font-mono text-xs font-medium tracking-[0.08em] uppercase mb-1.5 text-[#1800AC]/50">
              {String(i + 1).padStart(2, "0")} / {goal.label}
            </div>
            <div className="text-sm text-[#1800AC]/60 leading-relaxed">{goal.text}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default GoalsInfographic;
