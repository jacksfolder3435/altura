import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const BRAND = "#1800ad";

const STEPS = [
  { text: "Connecting to X API...", duration: 600 },
  { text: "Fetching your recent posts...", duration: 800 },
  { text: "Scanning content patterns...", duration: 900 },
  { text: "Mapping your personality signals...", duration: 900 },
  { text: "Identifying your archetype...", duration: 800 },
  { text: "Generating your persona card...", duration: 700 },
];

export default function AnalysisLoader({ username, onComplete }: { username: string; onComplete: () => void }) {
  const [stepIndex, setStepIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let current = 0;
    let totalElapsed = 0;
    const totalDuration = STEPS.reduce((a, s) => a + s.duration, 0);

    const runStep = () => {
      if (current >= STEPS.length) {
        setProgress(100);
        setTimeout(onComplete, 300);
        return;
      }
      setStepIndex(current);
      const stepDuration = STEPS[current].duration;
      const startElapsed = totalElapsed;

      const interval = setInterval(() => {
        totalElapsed = startElapsed + stepDuration;
        setProgress(Math.min(100, Math.round((totalElapsed / totalDuration) * 100)));
      }, 50);

      setTimeout(() => {
        clearInterval(interval);
        totalElapsed = STEPS.slice(0, current + 1).reduce((a, s) => a + s.duration, 0);
        setProgress(Math.round((totalElapsed / totalDuration) * 100));
        current++;
        runStep();
      }, stepDuration);
    };

    runStep();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center min-h-[380px] w-full max-w-md mx-auto px-4"
      style={{ fontFamily: "'Neue Haas Unica', 'Helvetica Neue', Helvetica, Arial, sans-serif" }}
    >
      {/* Animated X logo */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        className="w-14 h-14 rounded-full mb-8 flex items-center justify-center"
        style={{ background: BRAND }}
      >
        <svg viewBox="0 0 24 24" className="w-7 h-7 fill-white">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.259 5.63L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      </motion.div>

      <p
        className="text-xs font-mono tracking-widest mb-5"
        style={{ color: BRAND, opacity: 0.45 }}
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
            style={{ color: BRAND, fontWeight: 300 }}
          >
            {STEPS[stepIndex]?.text}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Progress bar */}
      <div
        className="w-full rounded-full h-px overflow-hidden mb-3"
        style={{ background: `rgba(24,0,173,0.12)` }}
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
        style={{ color: BRAND, opacity: 0.3 }}
      >
        {progress}%
      </span>
    </motion.div>
  );
}
