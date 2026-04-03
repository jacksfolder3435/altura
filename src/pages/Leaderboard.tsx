import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SalesPerson {
  id: number;
  name: string;
  avatar: string;
  jan: number;
  feb: number;
  mar: number;
  q1Total: number;
  deals: number;
  pctOfQ1: number;
  trend: "up" | "down" | "none";
}

const SALES_DATA: SalesPerson[] = [
  { id: 1,  name: "Jack",    avatar: "JA", jan: 37320.78, feb: 36130.87, mar: 46342.15, q1Total: 119793.80, deals: 12, pctOfQ1: 30, trend: "up" },
  { id: 2,  name: "Luka",    avatar: "LU", jan: 32139.42, feb: 33430.40, mar: 35276.92, q1Total: 100846.74, deals: 11, pctOfQ1: 26, trend: "up" },
  { id: 3,  name: "Sam",     avatar: "SA", jan: 24934.99, feb: 6287.20,  mar: 16031.23, q1Total: 47253.42,  deals: 7,  pctOfQ1: 12, trend: "up" },
  { id: 4,  name: "Tim",     avatar: "TI", jan: 8558.71,  feb: 15000.00, mar: 12000.00, q1Total: 35558.71,  deals: 3,  pctOfQ1: 9,  trend: "down" },
  { id: 5,  name: "Adam",    avatar: "AD", jan: 8558.71,  feb: 10747.14, mar: 4336.14,  q1Total: 23641.99,  deals: 3,  pctOfQ1: 6,  trend: "down" },
  { id: 6,  name: "Hamza",   avatar: "HA", jan: 12777.92, feb: 0,        mar: 5154.20,  q1Total: 17932.12,  deals: 2,  pctOfQ1: 5,  trend: "up" },
  { id: 7,  name: "Emil",    avatar: "EM", jan: 12679.57, feb: 0,        mar: 0,         q1Total: 12679.57,  deals: 2,  pctOfQ1: 3,  trend: "none" },
  { id: 8,  name: "Nick",    avatar: "NI", jan: 3435.84,  feb: 3489.35,  mar: 2119.72,  q1Total: 9044.91,   deals: 4,  pctOfQ1: 2,  trend: "down" },
  { id: 9,  name: "Vide",    avatar: "VI", jan: 4292.58,  feb: 0,        mar: 0,         q1Total: 4292.58,   deals: 1,  pctOfQ1: 1,  trend: "none" },
  { id: 10, name: "Calib3r", avatar: "CA", jan: 2132.92,  feb: 0,        mar: 0,         q1Total: 2132.92,   deals: 1,  pctOfQ1: 1,  trend: "none" },
];

const SORT_OPTIONS = ["q1Total", "jan", "feb", "mar", "deals"] as const;
type SortKey = typeof SORT_OPTIONS[number];

const SORT_LABELS: Record<SortKey, string> = {
  q1Total: "Q1 Total",
  jan: "January",
  feb: "February",
  mar: "March",
  deals: "Deals",
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

const PODIUM_HEIGHTS = ["h-36", "h-28", "h-24"];
const PODIUM_ORDER = [1, 0, 2];

function formatEuro(val: number) {
  if (val === 0) return "—";
  if (val >= 1000000) return `€${(val / 1000000).toFixed(1)}M`;
  if (val >= 1000) return `€${(val / 1000).toFixed(1)}K`;
  return `€${val.toFixed(0)}`;
}

function TrendArrow({ trend }: { trend: "up" | "down" | "none" }) {
  if (trend === "up") return <span className="text-black ml-1">&#9650;</span>;
  if (trend === "down") return <span className="text-neutral-400 ml-1">&#9660;</span>;
  return <span className="text-neutral-300 ml-1">—</span>;
}

export default function Leaderboard() {
  const [sortBy, setSortBy] = useState<SortKey>("q1Total");

  const filtered = [...SALES_DATA].sort((a, b) => b[sortBy] - a[sortBy]);

  const top3 = filtered.slice(0, 3);

  return (
    <div className="min-h-screen bg-white text-black" style={{ fontFamily: "'Neue Haas Unica', 'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
      {/* Header */}
      <header className="pt-10 pb-4 text-center">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-bold tracking-tight text-black"
        >
          Sales Leaderboard
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="mt-2 text-neutral-500 text-sm"
        >
          Q1 2026 &middot; Lunar Strategy
        </motion.p>

        {/* Q1 Summary */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="mt-6 flex justify-center gap-8"
        >
          <div className="text-center">
            <p className="text-2xl md:text-3xl font-bold text-black">€394,934</p>
            <p className="text-xs text-neutral-500 mt-1">Q1 Total Revenue</p>
          </div>
          <div className="text-center">
            <p className="text-2xl md:text-3xl font-bold text-black">54</p>
            <p className="text-xs text-neutral-500 mt-1">Total Entries</p>
          </div>
          <div className="text-center">
            <p className="text-2xl md:text-3xl font-bold text-black">10</p>
            <p className="text-xs text-neutral-500 mt-1">Salespeople</p>
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
          <div className="flex items-end justify-center gap-4 md:gap-6 mb-10">
            {PODIUM_ORDER.map((rank, i) => {
              const person = top3[rank];
              if (!person) return null;
              const delay = i * 0.12;
              const displayVal = sortBy === "deals" ? person.deals : formatEuro(person[sortBy]);
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

                  <span className="mt-2 text-sm font-semibold text-black text-center">
                    {person.name}
                  </span>
                  <span className="text-xs text-neutral-500">{person.pctOfQ1}% of Q1</span>
                  <span className="mt-1 text-lg font-bold text-black">
                    {displayVal}
                  </span>

                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: "auto" }}
                    transition={{ delay: delay + 0.15, duration: 0.4, ease: "easeOut" }}
                    className={`mt-2 ${PODIUM_HEIGHTS[rank]} w-20 md:w-24 rounded-t-xl bg-gradient-to-t ${PODIUM_COLORS[rank]} opacity-20 flex items-start justify-center pt-2`}
                  >
                    <span className="text-black/60 font-bold text-lg">#{rank + 1}</span>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>

          {/* Full Rankings Table */}
          <div className="bg-neutral-50 rounded-2xl border border-neutral-200 overflow-hidden mb-16">
            <div className="grid grid-cols-[2.5rem_1fr_4.5rem_4.5rem_4.5rem_5rem_3rem] md:grid-cols-[3rem_1fr_5rem_5rem_5rem_5.5rem_3.5rem] text-[11px] uppercase tracking-wider text-neutral-400 font-semibold px-4 py-3 border-b border-neutral-200">
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
                  className={`grid grid-cols-[2.5rem_1fr_4.5rem_4.5rem_4.5rem_5rem_3rem] md:grid-cols-[3rem_1fr_5rem_5rem_5rem_5.5rem_3.5rem] items-center px-4 py-3 border-b border-neutral-100 last:border-0 transition-colors ${
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
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 ${
                        idx < 3
                          ? `bg-gradient-to-br ${PODIUM_COLORS[idx]} text-white`
                          : "bg-neutral-200 text-neutral-600"
                      }`}
                    >
                      {person.avatar}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-black truncate">{person.name}</p>
                      <p className="text-[11px] text-neutral-500">{person.deals} deals &middot; {person.pctOfQ1}%</p>
                    </div>
                  </div>

                  <span className={`text-xs text-right font-medium ${sortBy === "jan" ? "text-black font-semibold" : "text-neutral-400"}`}>
                    {formatEuro(person.jan)}
                  </span>
                  <span className={`text-xs text-right font-medium ${sortBy === "feb" ? "text-black font-semibold" : "text-neutral-400"}`}>
                    {formatEuro(person.feb)}
                  </span>
                  <span className={`text-xs text-right font-medium ${sortBy === "mar" ? "text-black font-semibold" : "text-neutral-400"}`}>
                    {formatEuro(person.mar)}
                  </span>
                  <span className={`text-sm text-right font-bold ${sortBy === "q1Total" ? "text-black" : "text-neutral-500"}`}>
                    {formatEuro(person.q1Total)}
                  </span>
                  <span className="text-right text-xs">
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
