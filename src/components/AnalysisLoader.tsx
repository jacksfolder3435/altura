import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const BRAND = "#5EFFCA";

const STEPS = [
  { text: "Connecting to X API...", duration: 600 },
  { text: "Fetching your recent posts...", duration: 800 },
  { text: "Scanning on-chain patterns...", duration: 900 },
  { text: "Mapping your crypto signals...", duration: 900 },
  { text: "Building your digital defi profile...", duration: 800 },
  { text: "Generating your profile card...", duration: 700 },
];

const TOTAL_DURATION = STEPS.reduce((a, s) => a + s.duration, 0);

// Cumulative end time for each step
const STEP_END_TIMES = STEPS.reduce<number[]>((acc, s) => {
  acc.push((acc[acc.length - 1] ?? 0) + s.duration);
  return acc;
}, []);

export default function AnalysisLoader({ username, onComplete }: { username: string; onComplete: () => void }) {
  const [stepIndex, setStepIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  // onComplete must only fire once even if React's StrictMode runs the
  // effect twice in dev — use a ref guard.
  const completedRef = useRef(false);

  useEffect(() => {
    const start = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      if (elapsed >= TOTAL_DURATION) {
        setProgress(100);
        setStepIndex(STEPS.length - 1);
        clearInterval(interval);
        if (!completedRef.current) {
          completedRef.current = true;
          // Small delay so the user sees 100% briefly
          setTimeout(onComplete, 300);
        }
        return;
      }
      // Find which step we're in based on elapsed time
      let idx = 0;
      for (let i = 0; i < STEP_END_TIMES.length; i++) {
        if (elapsed < STEP_END_TIMES[i]!) {
          idx = i;
          break;
        }
      }
      setStepIndex(idx);
      setProgress(Math.min(99, Math.round((elapsed / TOTAL_DURATION) * 100)));
    }, 50);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center min-h-[380px] w-full max-w-md mx-auto px-4"
      style={{ fontFamily: "'Funnel Display', 'Helvetica Neue', Helvetica, Arial, sans-serif" }}
    >
      {/* Animated analytics icon */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        className="w-14 h-14 rounded-full mb-8 flex items-center justify-center"
        style={{ background: BRAND }}
      >
        <svg viewBox="0 0 24 24" className="w-7 h-7 fill-none stroke-black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 3v18h18" />
          <path d="M7 16l4-8 4 4 6-8" />
        </svg>
      </motion.div>

      <p
        className="text-xs font-mono tracking-widest mb-5"
        style={{ color: BRAND, opacity: 0.6 }}
      >
        analyzing @{username}
      </p>

      {/* Step text */}
      <div className="h-7 mb-8 flex items-center">
        <AnimatePresence mode="wait">
          <motion.p
            key={stepIndex}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className="text-base text-center"
            style={{ color: "#FAFAFA", fontWeight: 300 }}
          >
            {STEPS[stepIndex]?.text}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Progress bar */}
      <div
        className="w-full rounded-full h-px overflow-hidden mb-3"
        style={{ background: `rgba(94,255,202,0.15)` }}
      >
        <motion.div
          className="h-full rounded-full"
          style={{ background: BRAND }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        />
      </div>

      <span
        className="text-xs font-mono"
        style={{ color: BRAND, opacity: 0.4 }}
      >
        {progress}%
      </span>
    </motion.div>
  );
}
