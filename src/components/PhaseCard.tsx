import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

interface SubItem {
  name: string;
  file?: string;
  desc: string;
}

interface PhaseCardProps {
  number: number;
  title: string;
  tag?: string;
  description: string;
  items: SubItem[];
  children?: React.ReactNode;
}

const PhaseCard = ({ number, title, tag, description, items, children }: PhaseCardProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-15% 0px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      className="relative mb-4 z-[2] flex items-stretch gap-5"
    >
      {/* Timeline column */}
      <div className="flex flex-col items-center flex-shrink-0 w-10">
        <div className="w-10 h-10 rounded-full bg-[#1800AC] flex items-center justify-center text-white font-bold text-sm shadow-[0_4px_16px_rgba(24,0,172,0.35)] flex-shrink-0">
          {number}
        </div>
        <div className="w-px flex-1 bg-[#1800AC]/10 mt-3" />
      </div>

      {/* Card */}
      <div className="flex-1 bg-[#e3f0f9] rounded-2xl p-8 shadow-[0_2px_20px_rgba(24,0,172,0.07)] hover:shadow-[0_8px_40px_rgba(24,0,172,0.13)] transition-all duration-300 mb-4">
        <div className="flex items-center gap-3 mb-2.5 flex-wrap">
          <h2 className="font-display text-xl font-bold text-[#1800AC] leading-tight">
            {title}
          </h2>
          {tag && (
            <span className="font-mono text-[0.6rem] font-medium px-3 py-1 rounded-full bg-[#1800AC]/10 text-[#1800AC] tracking-widest uppercase">
              {tag}
            </span>
          )}
        </div>

        <p className="text-sm leading-relaxed text-[#1800AC]/55 mb-7">{description}</p>

        {children}

        {items.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-2">
            {items.map((item, i) => (
              <div
                key={i}
                className="p-5 rounded-xl bg-white/55 hover:bg-white/80 transition-colors duration-200"
              >
                <div className="flex items-baseline gap-2 mb-1.5">
                  <span className="font-display text-base font-bold text-[#1800AC] tracking-tight leading-none">
                    {item.name}
                  </span>
                  {item.file && (
                    <span className="font-mono text-[0.65rem] text-[#1800AC]/45 tracking-wide">
                      {item.file}
                    </span>
                  )}
                </div>
                <span className="text-sm text-[#1800AC]/55 leading-snug block">
                  {item.desc}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default PhaseCard;
