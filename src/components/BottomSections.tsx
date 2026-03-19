import { motion } from "framer-motion";

const services = ["GTM Strategy", "Social Media", "PR + Credibility", "Content Creators", "Creator Wire", "Design Studio", "Podcast + X Spaces", "Marketing Advisory", "Events"];
const clients = ["Polkadot", "Solana", "ICP", "Cardano", "Supra", "MultiversX", "Aethir", "Privasea", "Cookie3", "OKX", "BitMEX", "Avalon", "Immutable"];

const cardClass = "bg-[#e3f0f9] rounded-2xl p-7 shadow-[0_2px_20px_rgba(24,0,172,0.07)] hover:shadow-[0_6px_32px_rgba(24,0,172,0.11)] transition-all duration-300";
const tagClass = "inline-block font-mono text-xs px-3 py-1.5 bg-white/60 rounded-full text-[#1800AC]/65 tracking-wide";

const BottomSections = () => {
  return (
    <div className="w-full px-8 md:px-12 relative z-[5]">
      <div className="h-px bg-gradient-to-r from-transparent via-[#1800AC]/15 to-transparent my-14" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 py-4 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={cardClass}
        >
          <h3 className="font-display text-base font-bold text-[#1800AC] mb-4">Services Offered</h3>
          <div className="flex flex-wrap gap-2">
            {services.map((s) => (
              <span key={s} className={tagClass}>{s}</span>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className={cardClass}
        >
          <h3 className="font-display text-base font-bold text-[#1800AC] mb-4">Ecosystem Clients</h3>
          <div className="flex flex-wrap gap-2">
            {clients.map((c) => (
              <span key={c} className={tagClass}>{c}</span>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className={cardClass}
        >
          <h3 className="font-display text-base font-bold text-[#1800AC] mb-5">Contact</h3>
          <div className="space-y-4">
            <div>
              <div className="font-mono text-sm font-medium text-[#1800AC] mb-0.5">Adam Westeren</div>
              <div className="font-mono text-xs text-[#1800AC]/50">adam@lunarstrategy.com</div>
            </div>
            <div>
              <div className="font-mono text-sm font-medium text-[#1800AC] mb-0.5">Website</div>
              <div className="font-mono text-xs text-[#1800AC]/50">www.lunarstrategy.com</div>
            </div>
            <div>
              <div className="font-mono text-sm font-medium text-[#1800AC] mb-0.5">Proposal</div>
              <div className="font-mono text-xs text-[#1800AC]/50">NESA x Lunar Strategy // Rev 1.0 · 2026</div>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="text-center py-12 pb-20 font-mono text-xs text-[#1800AC]/35 tracking-[0.15em] uppercase leading-8">
        NESA x Lunar Strategy // Rev 1.0<br />
        www.lunarstrategy.com // 2026
      </div>
    </div>
  );
};

export default BottomSections;
