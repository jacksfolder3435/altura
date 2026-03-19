import { motion } from "framer-motion";
import ClientLogos from "./ClientLogos";

const steps = ["GTM Strategy", "Social Media", "PR", "Creator Wire", "TGE"];

const Hero = () => {
  return (
    <section className="min-h-screen flex flex-col justify-center items-center text-center px-10 py-24 relative z-[5]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="font-mono text-xs tracking-[0.2em] uppercase text-muted-foreground mb-10"
      >
        Lunar Strategy // NESA Campaign Proposal
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.1 }}
        className="font-display text-[clamp(3.5rem,8vw,6.5rem)] font-bold leading-[1.02] tracking-tight mb-8"
      >
        <span className="text-foreground">NESA</span>{" "}
        <span className="text-muted-foreground font-mono text-[0.4em] align-middle">×</span>{" "}
        <span className="text-foreground">Lunar</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-base leading-relaxed text-muted-foreground max-w-[580px] mx-auto mb-12"
      >
        A full-funnel go-to-market campaign taking NESA from pre-TGE to a dominant onchain AI brand — through GTM strategy, social media, PR, and creator activation.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="flex flex-wrap gap-2.5 justify-center items-center mb-20"
      >
        {steps.map((step, i) => (
          <span key={step}>
            <span className="font-mono text-xs font-medium tracking-wide text-[#1800AC] px-5 py-2.5 bg-[#e3f0f9] rounded-full shadow-[0_2px_12px_rgba(24,0,172,0.08)] whitespace-nowrap">
              {step}
            </span>
            {i < steps.length - 1 && (
              <span className="text-[#1800AC]/30 text-sm mx-1.5">→</span>
            )}
          </span>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="font-mono text-xs text-muted-foreground tracking-[0.1em] uppercase"
      >
        NESA x Lunar Strategy // Rev 1.0 · 2026
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        <ClientLogos />
      </motion.div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 scroll-hint-anim">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M8 3v10M4 9l4 4 4-4" stroke="hsl(248 100% 34%)" strokeWidth="1.2" opacity="0.4" />
        </svg>
        <span className="font-mono text-[0.65em] tracking-[0.15em] uppercase text-muted-foreground">scroll</span>
      </div>
    </section>
  );
};

export default Hero;
