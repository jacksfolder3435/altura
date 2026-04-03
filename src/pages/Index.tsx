import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { parseUsername, generatePersona, type PersonaResult } from "@/lib/personaGenerator";
import { fetchLatestTweets } from "@/lib/twitterApi";
import { SocialCardAnimated, PlatinumCardAnimated, renderCardToCanvas, type CardTheme, type PnlData } from "@/components/SocialCard";
import AnalysisLoader from "@/components/AnalysisLoader";
import BluOrbBackground from "@/components/BluOrbBackground";

type Stage = "landing" | "loading" | "result";

const EXAMPLE_HANDLES = ["@sama", "@paulg", "@naval", "@lexfridman"];
const BRAND = "#5EFFCA";
const FONT = "'Funnel Display', 'Helvetica Neue', Helvetica, Arial, sans-serif";

// Mock PNL data for demo — will be replaced by Altura API
const MOCK_PNL: PnlData = {
  totalDeposited: "$8,420",
  currentValue: "$12,690",
  pnl: "$4,270",
  pnlPercent: "+50.7%",
  apy: "82.4%",
  vaultDays: 94,
  isPositive: true,
};

export default function Index() {
  const [stage, setStage] = useState<Stage>("landing");
  const [input, setInput] = useState("");
  const [username, setUsername] = useState("");
  const [persona, setPersona] = useState<PersonaResult | null>(null);
  const [error, setError] = useState("");
  const [copyState, setCopyState] = useState<"idle" | "copying" | "done">("idle");
  const [cardTheme, setCardTheme] = useState<CardTheme>("dark");
  const inputRef = useRef<HTMLInputElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  function handleSubmit(e?: React.FormEvent) {
    e?.preventDefault();
    const parsed = parseUsername(input);
    if (!parsed || parsed.length < 2) {
      setError("Enter a valid X handle or profile URL");
      return;
    }
    setError("");
    setUsername(parsed);
    setStage("loading");
  }

  async function handleAnalysisComplete() {
    try {
      const tweets = await fetchLatestTweets(username);
      console.log(`Fetched ${tweets.length} tweets for @${username}:`, tweets);
    } catch (e) {
      console.warn(`X API unavailable for @${username} — running in demo mode:`, e);
    }
    setPersona(generatePersona(username));
    setStage("result");
  }

  function handleReset() {
    setStage("landing");
    setInput("");
    setPersona(null);
    setTimeout(() => inputRef.current?.focus(), 100);
  }

  const handleCopyImage = useCallback(async () => {
    if (!persona || copyState === "copying") return;
    setCopyState("copying");
    try {
      const canvas = await renderCardToCanvas(persona, cardTheme);
      canvas.toBlob(async (blob) => {
        if (!blob) { setCopyState("idle"); return; }
        try {
          await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
          setCopyState("done");
          setTimeout(() => setCopyState("idle"), 2000);
        } catch {
          setCopyState("idle");
        }
      }, "image/png");
    } catch (e) {
      console.error("Copy image failed:", e);
      setCopyState("idle");
    }
  }, [copyState, persona, cardTheme]);

  function handleShare() {
    if (!persona) return;
    const text = encodeURIComponent(
      `Just discovered my Digital DeFi Profile: ${persona.archetype.emoji} ${persona.archetype.name}\n\n"${persona.archetype.description}"\n\nFind yours 👇`
    );
    window.open(`https://twitter.com/intent/tweet?text=${text}`, "_blank");
  }

  return (
    <div
      className="min-h-screen flex flex-col overflow-hidden"
      style={{ fontFamily: FONT, color: "#FAFAFA" }}
    >
      <BluOrbBackground />

      {/* Header */}
      <header className="relative z-10 flex items-center px-8 py-6">
        <img src="/altura-wordmark.svg" alt="Altura" style={{ height: "28px" }} />
      </header>

      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-12">
        <AnimatePresence mode="wait">

          {/* ─── LANDING ─── */}
          {stage === "landing" && (
            <motion.div
              key="landing"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center text-center max-w-md w-full"
            >
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.6 }}
                className="text-5xl sm:text-6xl leading-tight tracking-tight mb-6"
                style={{ color: "#FAFAFA", fontWeight: 700, letterSpacing: "-0.03em" }}
              >
                discover your<br /><span className="whitespace-nowrap">Digital DeFi Profile</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.22 }}
                className="text-2xl leading-relaxed mb-10 whitespace-nowrap"
                style={{ color: "#FAFAFA", opacity: 0.65, fontWeight: 300 }}
              >
                are you an ai slop crypto bro or a giga brain degen?
              </motion.p>

              {/* Input form */}
              <motion.form
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                onSubmit={handleSubmit}
                className="w-full flex flex-col sm:flex-row gap-3 mb-4"
              >
                <div className="relative flex-1">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "#FAFAFA", opacity: 0.3 }}>
                    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.259 5.63L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  </div>
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => { setInput(e.target.value); setError(""); }}
                    placeholder="@yourhandle or x.com/yourhandle"
                    className="w-full pl-11 pr-4 py-4 text-sm focus:outline-none"
                    style={{
                      background: "#1a1a1a",
                      border: "1px solid rgba(94,255,202,0.25)",
                      borderRadius: "0px",
                      color: "#FAFAFA",
                      fontFamily: FONT,
                      fontWeight: 300,
                    }}
                    autoFocus
                  />
                </div>
                <button
                  type="submit"
                  className="px-8 py-4 text-sm font-bold tracking-wide active:scale-[0.98] whitespace-nowrap"
                  style={{
                    background: BRAND,
                    color: "#000",
                    borderRadius: "0px",
                    fontFamily: FONT,
                    fontWeight: 700,
                    transition: "background 0.15s ease",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = "#4de6b5"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = BRAND; }}
                >
                  analyze
                </button>
              </motion.form>

              {error && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-xs mb-4"
                  style={{ color: "#e03" }}
                >
                  {error}
                </motion.p>
              )}

              {/* Example handles */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex flex-wrap gap-3 justify-center"
              >
                <span className="text-xs font-mono" style={{ color: "#FAFAFA", opacity: 0.3 }}>try:</span>
                {EXAMPLE_HANDLES.map((h) => (
                  <button
                    key={h}
                    onClick={() => setInput(h)}
                    className="text-xs font-mono transition-opacity hover:opacity-80"
                    style={{ color: "#FAFAFA", opacity: 0.45 }}
                  >
                    {h}
                  </button>
                ))}
              </motion.div>
            </motion.div>
          )}

          {/* ─── LOADING ─── */}
          {stage === "loading" && (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <AnalysisLoader username={username} onComplete={handleAnalysisComplete} />
            </motion.div>
          )}

          {/* ─── RESULT ─── */}
          {stage === "result" && persona && (
            <motion.div
              key="result"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center w-full max-w-4xl"
            >
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-center mb-8"
              >
                <p
                  className="text-xs font-mono tracking-widest mb-2"
                  style={{ color: "#FAFAFA", opacity: 0.4 }}
                >
                  your digital defi profile is ready
                </p>
                <h2
                  className="text-2xl"
                  style={{ color: "#FAFAFA", fontWeight: 700 }}
                >
                  {persona.archetype.emoji} {persona.archetype.name}
                </h2>
              </motion.div>

              {/* Theme toggle */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex items-center mb-4 p-1"
                style={{ background: "rgba(94,255,202,0.08)", borderRadius: "8px" }}
              >
                {(["dark", "light", "platinum"] as CardTheme[]).map((t) => (
                  <button
                    key={t}
                    onClick={() => setCardTheme(t)}
                    className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold tracking-widest uppercase transition-all"
                    style={{
                      background: cardTheme === t
                        ? (t === "platinum" ? "#c8b4ff" : BRAND)
                        : "transparent",
                      color: cardTheme === t ? (t === "platinum" ? "#0c0c14" : "#fff") : "#FAFAFA",
                      borderRadius: "0px",
                      fontFamily: FONT,
                      opacity: cardTheme === t ? 1 : 0.5,
                      transition: "all 0.2s ease",
                    }}
                  >
                    {t === "platinum" ? "✦ platinum" : t}
                  </button>
                ))}
              </motion.div>

              {cardTheme === "platinum" ? (
                <PlatinumCardAnimated persona={persona} pnl={MOCK_PNL} cardRef={cardRef} />
              ) : (
                <SocialCardAnimated persona={persona} cardRef={cardRef} theme={cardTheme} />
              )}

              {/* Action buttons */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="flex gap-3 mt-8 w-full"
              >
                <button
                  onClick={handleShare}
                  className="flex-1 flex items-center justify-center gap-2 px-5 py-3.5 text-sm font-bold tracking-wide active:scale-[0.98]"
                  style={{
                    background: BRAND,
                    color: "#000",
                    borderRadius: "0px",
                    fontFamily: FONT,
                    fontWeight: 700,
                    transition: "background 0.15s ease",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = "#4de6b5"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = BRAND; }}
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-black">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.259 5.63L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                  share on X
                </button>
                <button
                  onClick={handleCopyImage}
                  disabled={copyState === "copying"}
                  className="flex-1 flex items-center justify-center gap-2 px-5 py-3.5 text-sm font-bold tracking-wide active:scale-[0.98]"
                  style={{
                    background: copyState === "done" ? "#3bc99a" : "rgba(94,255,202,0.12)",
                    color: "#FAFAFA",
                    borderRadius: "0px",
                    fontFamily: FONT,
                    fontWeight: 700,
                    transition: "background 0.15s ease, color 0.15s ease",
                    opacity: copyState === "copying" ? 0.7 : 1,
                    cursor: copyState === "copying" ? "wait" : "pointer",
                  }}
                  onMouseEnter={e => { if (copyState === "idle") e.currentTarget.style.background = "rgba(94,255,202,0.22)"; }}
                  onMouseLeave={e => { if (copyState === "idle") e.currentTarget.style.background = "rgba(94,255,202,0.12)"; }}
                >
                  {copyState === "done" ? (
                    <>
                      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                      copied!
                    </>
                  ) : copyState === "copying" ? (
                    <>
                      <svg viewBox="0 0 24 24" className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" strokeOpacity="0.25"/>
                        <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round"/>
                      </svg>
                      copying…
                    </>
                  ) : (
                    <>
                      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="9" y="9" width="13" height="13" rx="2"/>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                      </svg>
                      copy image
                    </>
                  )}
                </button>
                <button
                  onClick={handleReset}
                  className="flex-1 flex items-center justify-center gap-2 px-5 py-3.5 text-sm font-bold tracking-wide active:scale-[0.98]"
                  style={{
                    background: "rgba(94,255,202,0.12)",
                    color: "#FAFAFA",
                    borderRadius: "0px",
                    fontFamily: FONT,
                    fontWeight: 700,
                    transition: "background 0.15s ease",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = "rgba(94,255,202,0.22)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "rgba(94,255,202,0.12)"; }}
                >
                  <span className="whitespace-nowrap">try another handle</span>
                </button>
              </motion.div>
            </motion.div>
          )}

        </AnimatePresence>
      </main>

    </div>
  );
}
