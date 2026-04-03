import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface MeetingBooker {
  id: number;
  name: string;
  fullName: string;
  avatar: string;
  jan: number;
  feb: number;
  mar: number;
  q1Total: number;
  pctOfQ1: number;
  trend: "up" | "down" | "none";
}

const BOOKERS_DATA: MeetingBooker[] = [
  { id: 1, name: "Adam",  fullName: "Adam Westeren",  avatar: "AW", jan: 40, feb: 60, mar: 51, q1Total: 151, pctOfQ1: 45, trend: "down" },
  { id: 2, name: "Sam",   fullName: "Sam Jenkins",    avatar: "SJ", jan: 33, feb: 39, mar: 20, q1Total: 92,  pctOfQ1: 28, trend: "down" },
  { id: 3, name: "Arya",  fullName: "Arya Ghobadi",   avatar: "AG", jan: 0,  feb: 46, mar: 5,  q1Total: 51,  pctOfQ1: 15, trend: "down" },
  { id: 4, name: "Jack",  fullName: "Jack Haldorsson", avatar: "JH", jan: 0,  feb: 0,  mar: 39, q1Total: 39,  pctOfQ1: 12, trend: "up" },
];

const SORT_OPTIONS = ["q1Total", "jan", "feb", "mar"] as const;
type SortKey = typeof SORT_OPTIONS[number];

const SORT_LABELS: Record<SortKey, string> = {
  q1Total: "Q1 Total",
  jan: "January",
  feb: "February",
  mar: "March",
};

const PODIUM_COLORS = [
  "from-black to-neutral-800",
  "from-neutral-400 to-neutral-500",
  "from-neutral-600 to-neutral-700",
];

const PODIUM_RING = [
  "ring-black",
  "ring-neutral-400",
  "ring-neutral-600",
];

const PODIUM_HEIGHTS = ["h-40", "h-32", "h-24"];
const PODIUM_ORDER = [1, 0, 2];

const totalMeetings = BOOKERS_DATA.reduce((sum, b) => sum + b.q1Total, 0);

function TrendArrow({ trend }: { trend: "up" | "down" | "none" }) {
  if (trend === "up") return <span className="text-black ml-1 text-sm">&#9650;</span>;
  if (trend === "down") return <span className="text-neutral-400 ml-1 text-sm">&#9660;</span>;
  return <span className="text-neutral-300 ml-1">—</span>;
}

function ProgressBar({ value, max }: { value: number; max: number }) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div className="w-full h-1.5 bg-neutral-200 rounded-full overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="h-full rounded-full bg-black"
      />
    </div>
  );
}

export default function MeetingsLeaderboard() {
  const [sortBy, setSortBy] = useState<SortKey>("q1Total");

  const filtered = [...BOOKERS_DATA].sort((a, b) => b[sortBy] - a[sortBy]);
  const top3 = filtered.slice(0, 3);
  const maxVal = filtered[0]?.[sortBy] ?? 1;

  return (
    <div className="min-h-screen bg-white text-black" style={{ fontFamily: "'Neue Haas Unica', 'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
      {/* Header */}
      <header className="pt-10 pb-4 text-center">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-bold tracking-tight text-black"
        >
          Meetings Leaderboard
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="mt-2 text-neutral-500 text-sm"
        >
          Q1 2026 &middot; Lunar Strategy &middot; BD Team
        </motion.p>

        {/* Summary Stats */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="mt-6 flex justify-center gap-8"
        >
          <div className="text-center">
            <p className="text-2xl md:text-3xl font-bold text-black">{totalMeetings}</p>
            <p className="text-xs text-neutral-500 mt-1">Meetings Booked</p>
          </div>
          <div className="text-center">
            <p className="text-2xl md:text-3xl font-bold text-black">{BOOKERS_DATA.length}</p>
            <p className="text-xs text-neutral-500 mt-1">BD Reps</p>
          </div>
          <div className="text-center">
            <p className="text-2xl md:text-3xl font-bold text-black">{Math.round(totalMeetings / 3)}</p>
            <p className="text-xs text-neutral-500 mt-1">Avg / Month</p>
          </div>
        </motion.div>
      </header>

      {/* Sort */}
      <div className="max-w-3xl mx-auto px-4 flex flex-wrap items-center justify-center gap-3 mt-6 mb-8">
        <div className="flex gap-1.5 bg-neutral-100 rounded-full p-1">
          {SORT_OPTIONS.map((key) => (
            <button
              key={key}
              onClick={() => setSortBy(key)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                sortBy === key
                  ? "bg-black text-white shadow-sm"
                  : "text-neutral-500 hover:text-black hover:bg-neutral-200"
              }`}
            >
              {SORT_LABELS[key]}
            </button>
          ))}
        </div>
      </div>

      {/* Top 3 Podium */}
      <AnimatePresence mode="wait">
        <motion.div
          key={sortBy}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3 }}
          className="max-w-2xl mx-auto px-4"
        >
          <div className="flex items-end justify-center gap-4 md:gap-6 mb-12">
            {PODIUM_ORDER.map((rank, i) => {
              const person = top3[rank];
              if (!person) return null;
              const delay = i * 0.12;
              const displayVal = person[sortBy];
              return (
                <motion.div
                  key={person.id}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay, type: "spring", stiffness: 180, damping: 18 }}
                  className="flex flex-col items-center"
                >
                  {rank === 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.4, type: "spring" }}
                      className="text-2xl mb-1"
                    >
                      &#9733;
                    </motion.span>
                  )}

                  <div
                    className={`w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br ${PODIUM_COLORS[rank]} flex items-center justify-center text-lg md:text-xl font-bold text-white ring-4 ${PODIUM_RING[rank]} shadow-lg`}
                  >
                    {person.avatar}
                  </div>

                  <span className="mt-3 text-sm font-bold text-black text-center">
                    {person.name}
                  </span>
                  <span className="text-xs text-neutral-500">{person.pctOfQ1}% of Q1</span>
                  <span className="mt-1 text-xl font-black text-black">
                    {displayVal}
                  </span>

                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: "auto" }}
                    transition={{ delay: delay + 0.15, duration: 0.5, ease: "easeOut" }}
                    className={`mt-3 ${PODIUM_HEIGHTS[rank]} w-20 md:w-24 rounded-t-2xl bg-gradient-to-t ${PODIUM_COLORS[rank]} opacity-20 flex items-start justify-center pt-3`}
                  >
                    <span className="text-black/60 font-bold text-lg">#{rank + 1}</span>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>

          {/* Full Rankings Table */}
          <div className="bg-neutral-50 rounded-2xl border border-neutral-200 overflow-hidden mb-16">
            <div className="grid grid-cols-[2.5rem_1fr_4rem_4rem_4rem_5rem_3rem] md:grid-cols-[3rem_1fr_5rem_5rem_5rem_5.5rem_3.5rem] text-[11px] uppercase tracking-wider text-neutral-400 font-semibold px-4 py-3 border-b border-neutral-200">
              <span>#</span>
              <span>Name</span>
              <span className="text-right">Jan</span>
              <span className="text-right">Feb</span>
              <span className="text-right">Mar</span>
              <span className="text-right">Q1 Total</span>
              <span className="text-right">Trend</span>
            </div>

            <AnimatePresence>
              {filtered.map((person, idx) => (
                <motion.div
                  key={person.id}
                  layout
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ delay: idx * 0.03 }}
                  className={`grid grid-cols-[2.5rem_1fr_4rem_4rem_4rem_5rem_3rem] md:grid-cols-[3rem_1fr_5rem_5rem_5rem_5.5rem_3.5rem] items-center px-4 py-4 border-b border-neutral-100 last:border-0 transition-colors ${
                    idx < 3 ? "bg-neutral-100/50" : "hover:bg-neutral-100/50"
                  }`}
                >
                  <span
                    className={`text-sm font-bold ${
                      idx === 0 ? "text-black" : idx === 1 ? "text-neutral-500" : idx === 2 ? "text-neutral-600" : "text-neutral-400"
                    }`}
                  >
                    {idx + 1}
                  </span>

                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 ${
                        idx < 3
                          ? `bg-gradient-to-br ${PODIUM_COLORS[idx]} text-white`
                          : "bg-neutral-200 text-neutral-600"
                      }`}
                    >
                      {person.avatar}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-black truncate">{person.fullName}</p>
                      <div className="mt-1.5">
                        <ProgressBar value={person[sortBy]} max={maxVal} />
                      </div>
                    </div>
                  </div>

                  <span className={`text-sm text-right font-medium ${sortBy === "jan" ? "text-black font-bold" : "text-neutral-400"}`}>
                    {person.jan || "—"}
                  </span>
                  <span className={`text-sm text-right font-medium ${sortBy === "feb" ? "text-black font-bold" : "text-neutral-400"}`}>
                    {person.feb || "—"}
                  </span>
                  <span className={`text-sm text-right font-medium ${sortBy === "mar" ? "text-black font-bold" : "text-neutral-400"}`}>
                    {person.mar || "—"}
                  </span>
                  <span className={`text-sm text-right font-bold ${sortBy === "q1Total" ? "text-black" : "text-neutral-500"}`}>
                    {person.q1Total}
                  </span>
                  <span className="text-right">
                    <TrendArrow trend={person.trend} />
                  </span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
