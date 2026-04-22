import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { parseUsername, generatePersona, type PersonaResult } from "@/lib/personaGenerator";
import {
  fetchProfile,
  recordShare,
  type AlturaSummary,
  type ProfileResponse,
} from "@/lib/alturaApi";
import { type PnlData } from "@/components/SocialCard";
import { toBlob } from "html-to-image";
import FigmaPlatinumCard from "@/components/figma/FigmaPlatinumCard";
import CardScaler from "@/components/figma/CardScaler";
import AnalysisLoader from "@/components/AnalysisLoader";
import BokehBackground from "@/components/BokehBackground";

type Stage = "landing" | "loading" | "result";

const EXAMPLE_HANDLES = ["@sama", "@paulg", "@naval", "@lexfridman"];
const BRAND = "#5EFFCA";
const FONT = "'Funnel Display', 'Helvetica Neue', Helvetica, Arial, sans-serif";

/** Format an exact USD amount with cents (e.g. "$144.90"). */
function fmtUSDExact(n: number): string {
  const abs = Math.abs(n);
  return `$${abs.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function fmtPct(n: number): string {
  const sign = n >= 0 ? "+" : "";
  return `${sign}${n.toFixed(2)}%`;
}

function alturaToPnl(a: AlturaSummary): PnlData {
  return {
    // Exact dollar amounts straight from Altura's costAnalysis
    totalDeposited: fmtUSDExact(a.totalDepositedUSD),
    currentValue: fmtUSDExact(a.currentValueUSD),
    // EXACT unrealizedPnL from Altura — magnitude only (card prefixes the sign)
    pnl: fmtUSDExact(a.pnlUSD),
    pnlPercent: fmtPct(a.pnlPercent),
    // Altura snapshot doesn't expose APY — show the realised return %
    apy: fmtPct(a.pnlPercent),
    vaultDays: 0,
    isPositive: a.pnlUSD >= 0,
  };
}

export default function Index() {
  const [stage, setStage] = useState<Stage>("landing");
  const [input, setInput] = useState("");
  const [username, setUsername] = useState("");
  const [persona, setPersona] = useState<PersonaResult | null>(null);
  const [error, setError] = useState("");
  const [copyState, setCopyState] = useState<"idle" | "copying" | "done">("idle");
  /**
   * idle       → ready
   * sharing    → capturing card + opening share sheet / intent
   * done       → native Web Share completed successfully
   * paste-hint → image copied to clipboard, X compose open, user should ⌘V
   */
  const [shareState, setShareState] = useState<
    "idle" | "sharing" | "done" | "paste-hint"
  >("idle");
  // cardTheme removed — everyone gets the Platinum card now.
  const [pnl, setPnl] = useState<PnlData | null>(null);
  const [isAlturaHolder, setIsAlturaHolder] = useState(false);
  /** Holder-only: when true, hide dollar amounts on the card (the % gain
   *  still shows). Lets whales share the flex without doxxing position size. */
  const [hideDollars, setHideDollars] = useState(false);
  /** Backend response we use for sharing/raffle logging. */
  const [profile, setProfile] = useState<ProfileResponse | null>(null);
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
    // Always start with a hash-based persona as a fallback so we never show a
    // broken state if the backend is unreachable.
    let resolvedPersona: PersonaResult = generatePersona(username);

    try {
      const fetched = await fetchProfile(username);
      console.log(`[profile] @${username}:`, fetched);
      setProfile(fetched);

      // Holder state & PnL
      if (fetched.altura?.isHolder) {
        setIsAlturaHolder(true);
        setPnl(alturaToPnl(fetched.altura));
        // (platinum is now the only card — no theme switch needed)
      } else {
        setIsAlturaHolder(false);
        setPnl(null);
      }

      // Data-driven persona from the backend engine — overrides the local
      // hash-based fallback. The backend returns the archetype (name, emoji,
      // description) but not the other flavour fields (traits, topics, stats,
      // gradient), so we merge: keep those from the local generator, swap in
      // the real archetype.
      if (fetched.persona?.archetype) {
        const a = fetched.persona.archetype;
        resolvedPersona = {
          ...resolvedPersona,
          archetype: {
            name: a.name,
            emoji: a.emoji,
            description: a.description,
          },
        };
        console.log(
          `[persona] resolved via backend: ${fetched.persona.trigger} (data-driven: ${fetched.persona.dataDriven})`,
        );
      }
    } catch (e) {
      console.warn(
        `[profile] backend unavailable for @${username} — demo mode:`,
        e,
      );
      setProfile(null);
      setIsAlturaHolder(false);
      setPnl(null);
    }

    setPersona(resolvedPersona);
    setStage("result");
  }

  function handleReset() {
    setStage("landing");
    setInput("");
    setPersona(null);
    setProfile(null);
    setPnl(null);
    setIsAlturaHolder(false);
    setHideDollars(false);
    // (platinum is now the only card — no theme reset needed)
    setTimeout(() => inputRef.current?.focus(), 100);
  }

  /**
   * Capture the live card DOM (with avatar, @handle, PnL, APY, etc.) as a
   * PNG blob. Always exports at the native 750x432 design size with 2x
   * pixel ratio so the result is retina-crisp regardless of how CardScaler
   * is currently scaling the on-screen render.
   *
   * Returns null if anything fails — callers should handle that gracefully.
   */
  const captureCardBlob = useCallback(async (): Promise<Blob | null> => {
    if (!cardRef.current) return null;
    const node = cardRef.current;

    // Wait two animation frames so any in-flight images (avatar via the
    // /api/avatar proxy) have actually painted before we snapshot.
    await new Promise<void>((r) =>
      requestAnimationFrame(() => requestAnimationFrame(() => r())),
    );

    // Wait for all <img> children to finish loading (or 3s timeout).
    const imgs = Array.from(node.querySelectorAll("img"));
    await Promise.all(
      imgs.map(
        (img) =>
          new Promise<void>((resolve) => {
            if (img.complete && img.naturalWidth > 0) return resolve();
            img.addEventListener("load", () => resolve(), { once: true });
            img.addEventListener("error", () => resolve(), { once: true });
            setTimeout(resolve, 3000);
          }),
      ),
    );

    return await toBlob(node, {
      pixelRatio: 2,
      width: 750,
      height: 432,
      backgroundColor: "transparent",
      cacheBust: true,
      filter: (n) =>
        !(n instanceof HTMLElement && n.dataset.exportIgnore === "1"),
    });
  }, []);

  /** Build the standard share text from the current persona. */
  function buildShareText(): string {
    if (!persona) return "";
    return (
      `Just discovered my Digital DeFi Profile: ${persona.archetype.emoji} ${persona.archetype.name}\n\n` +
      `"${persona.archetype.description}"\n\n` +
      `Find yours at https://persona.altura.trade 👇`
    );
  }

  /** Log the share event to Postgres (fire-and-forget, raffle entry). */
  function logShareEntry() {
    if (!profile?.persona?.archetype) return;
    const a = profile.persona.archetype;
    void recordShare({
      username: profile.username,
      archetype: { key: a.key, name: a.name, source: a.source },
      trigger: profile.persona.trigger,
      isHolder: Boolean(profile.altura?.isHolder),
      pnlUSD: profile.altura?.pnlUSD ?? null,
      costBasisUSD: profile.altura?.totalDepositedUSD ?? null,
      walletAddress: profile.altura?.walletAddress ?? null,
    });
  }

  /**
   * Copy image to clipboard (or fall back to download if clipboard blocked).
   * Used by the standalone "copy image" button.
   */
  const handleCopyImage = useCallback(async () => {
    if (!persona || copyState === "copying") return;
    setCopyState("copying");
    try {
      const blob = await captureCardBlob();
      if (!blob) {
        setCopyState("idle");
        return;
      }
      try {
        await navigator.clipboard.write([
          new ClipboardItem({ "image/png": blob }),
        ]);
        setCopyState("done");
        setTimeout(() => setCopyState("idle"), 2000);
      } catch (clipErr) {
        console.warn("Clipboard blocked, falling back to download", clipErr);
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `altura-${persona.username || "card"}.png`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
        setCopyState("done");
        setTimeout(() => setCopyState("idle"), 2000);
      }
    } catch (e) {
      console.error("Copy image failed:", e);
      setCopyState("idle");
    }
  }, [copyState, persona, captureCardBlob]);

  /**
   * Share to X with the card image attached.
   *
   * Twitter's web intent (twitter.com/intent/tweet) does NOT accept image
   * attachments via URL — only text. So we use a layered fallback:
   *
   *   1. Web Share API with `files` (mobile + Chrome desktop): native OS
   *      share sheet → user picks Twitter → text + image both attach in
   *      one tap. Best UX. Fully sufficient on iOS/Android.
   *   2. Fallback: copy the image to the clipboard, then open the tweet
   *      compose window with the text pre-filled, and show a toast telling
   *      the user to paste (⌘V / Ctrl+V) the image into the compose box.
   *   3. Final fallback: just open the intent with text-only.
   */
  const handleShare = useCallback(async () => {
    if (!persona || shareState === "sharing") return;
    setShareState("sharing");

    // Log raffle entry first (non-blocking; survives navigation via keepalive)
    logShareEntry();

    const text = buildShareText();

    try {
      const blob = await captureCardBlob();
      const file = blob
        ? new File([blob], `altura-${persona.username || "card"}.png`, {
            type: "image/png",
          })
        : null;

      // 1) Native Web Share API with files (best mobile UX)
      if (
        file &&
        typeof navigator.canShare === "function" &&
        navigator.canShare({ files: [file] })
      ) {
        try {
          await navigator.share({
            text,
            files: [file],
          } as ShareData);
          setShareState("done");
          setTimeout(() => setShareState("idle"), 2000);
          return;
        } catch (shareErr) {
          // User cancelled — that's fine, just exit.
          if ((shareErr as DOMException)?.name === "AbortError") {
            setShareState("idle");
            return;
          }
          // Fall through to clipboard fallback
          console.warn("Web Share failed, falling back to clipboard", shareErr);
        }
      }

      // 2) Clipboard + intent fallback (desktop browsers without Web Share)
      if (blob) {
        try {
          await navigator.clipboard.write([
            new ClipboardItem({ "image/png": blob }),
          ]);
          // Show "image copied — paste in compose" hint
          setShareState("paste-hint");
          setTimeout(() => setShareState("idle"), 6000);
          // Open compose right after, so the user can ⌘V immediately
          const intent = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
            text,
          )}`;
          window.open(intent, "_blank", "noopener,noreferrer");
          return;
        } catch (clipErr) {
          console.warn("Clipboard write failed too", clipErr);
        }
      }

      // 3) Final fallback — text-only intent
      const intent = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
      window.open(intent, "_blank", "noopener,noreferrer");
      setShareState("idle");
    } catch (e) {
      console.error("Share failed", e);
      setShareState("idle");
      // Last-ditch: text-only intent
      const intent = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
      window.open(intent, "_blank", "noopener,noreferrer");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [persona, profile, shareState, captureCardBlob]);

  return (
    <div
      className="min-h-screen flex flex-col overflow-x-hidden relative"
      style={{ fontFamily: FONT, color: "#FAFAFA", background: "#000503", maxWidth: "100vw" }}
    >
      <BokehBackground />

      {/* Header */}
      <header className="relative z-10 flex items-center px-4 sm:px-8 py-5 sm:py-6">
        <img src="/altura-wordmark.svg" alt="Altura" style={{ height: "26px" }} />
      </header>

      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-8 sm:py-12 w-full">
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
                Altura read<br />your timeline
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.22 }}
                className="text-xl sm:text-2xl leading-relaxed mb-10"
                style={{ color: "#FAFAFA", opacity: 0.65, fontWeight: 300 }}
              >
                Paste your handle. Connect for receipts.
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
                    className="w-full pl-11 pr-4 py-4 focus:outline-none"
                    style={{
                      // 16px minimum prevents iOS Safari from auto-zooming
                      // into the input on focus (which causes the "wonky"
                      // mobile layout shift).
                      fontSize: 16,
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
              className="flex flex-col items-center w-full max-w-3xl mx-auto"
            >
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-center mb-6 px-2"
              >
                <p
                  className="text-sm font-mono tracking-[0.2em]"
                  style={{ color: "#FFFFFF", opacity: 0.95 }}
                >
                  Your Altura card is ready
                </p>
              </motion.div>

              {/* Single Platinum card — everyone gets this.
                  Holders see PnL. Non-holders see a CTA to enter the vault. */}
              {(() => {
                const rawAvatar = profile?.x?.user?.profile_image_url;
                const upscaled = rawAvatar?.replace(
                  /_normal\.(jpg|jpeg|png|webp)/i,
                  "_400x400.$1",
                );
                const proxiedAvatar = upscaled
                  ? `/api/avatar?u=${encodeURIComponent(upscaled)}`
                  : undefined;
                const handle = profile?.x?.user?.username ?? persona.username;

                // When `hideDollars` is on, the entire PNL block is suppressed
                // (big $ value + "PNL" label). The RETURN column stays and
                // shifts into the left slot so the card doesn't look lopsided.
                // v7 also removed the inline % overlay — it duplicated the
                // RETURN number on the right, so it's no longer passed in.
                const cardPnlValue =
                  pnl && !hideDollars ? pnl.pnl : undefined;

                return (
                  <CardScaler maxWidth={750}>
                    <FigmaPlatinumCard
                      ref={cardRef}
                      data={{
                        archetype: persona.archetype.name,
                        description: persona.archetype.description,
                        // PnL shown when holder, undefined otherwise
                        pnlValue: cardPnlValue,
                        // Realised return % since deposit. Rendered on the
                        // right of the card with label "RETURN" (was APY,
                        // briefly YTD). Altura's snapshot doesn't expose a
                        // true annualised yield, so RETURN is accurate.
                        returnValue: pnl?.apy,
                        username: handle,
                        avatarUrl: proxiedAvatar,
                        isHolder: isAlturaHolder,
                      }}
                    />
                  </CardScaler>
                );
              })()}

              {/* Holder-only: toggle to strip dollar amounts before sharing. */}
              {isAlturaHolder && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.55 }}
                  className="mt-5 flex items-center justify-center"
                  data-export-ignore="1"
                >
                  <button
                    type="button"
                    role="switch"
                    aria-checked={hideDollars}
                    onClick={() => setHideDollars((v) => !v)}
                    className="inline-flex items-center gap-3 px-4 py-2 select-none"
                    style={{
                      background: "rgba(94,255,202,0.08)",
                      border: "1px solid rgba(94,255,202,0.25)",
                      borderRadius: "999px",
                      cursor: "pointer",
                      transition: "background 0.15s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "rgba(94,255,202,0.14)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "rgba(94,255,202,0.08)";
                    }}
                  >
                    {/* Pill switch */}
                    <span
                      aria-hidden
                      style={{
                        position: "relative",
                        display: "inline-block",
                        width: 34,
                        height: 20,
                        borderRadius: 999,
                        background: hideDollars
                          ? BRAND
                          : "rgba(250,250,250,0.18)",
                        transition: "background 0.15s ease",
                        flexShrink: 0,
                      }}
                    >
                      <span
                        style={{
                          position: "absolute",
                          top: 2,
                          left: hideDollars ? 16 : 2,
                          width: 16,
                          height: 16,
                          borderRadius: "50%",
                          background: hideDollars ? "#000" : "#FAFAFA",
                          transition: "left 0.15s ease, background 0.15s ease",
                        }}
                      />
                    </span>
                    <span
                      className="text-xs font-mono tracking-wide"
                      style={{
                        color: "#FAFAFA",
                        opacity: hideDollars ? 1 : 0.75,
                      }}
                    >
                      hide dollar amounts
                    </span>
                  </button>
                </motion.div>
              )}

              {/* Action buttons */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="flex flex-col sm:flex-row gap-3 mt-8 w-full max-w-3xl mx-auto"
              >
                <button
                  onClick={handleShare}
                  disabled={shareState === "sharing"}
                  className="flex-1 flex items-center justify-center gap-2 px-5 py-3.5 text-sm font-bold tracking-wide active:scale-[0.98]"
                  style={{
                    background: shareState === "done" ? "#3bc99a" : BRAND,
                    color: "#000",
                    borderRadius: "0px",
                    fontFamily: FONT,
                    fontWeight: 700,
                    cursor: shareState === "sharing" ? "wait" : "pointer",
                    opacity: shareState === "sharing" ? 0.75 : 1,
                    transition: "background 0.15s ease, opacity 0.15s ease",
                  }}
                  onMouseEnter={(e) => {
                    if (shareState === "idle")
                      e.currentTarget.style.background = "#4de6b5";
                  }}
                  onMouseLeave={(e) => {
                    if (shareState === "idle")
                      e.currentTarget.style.background = BRAND;
                  }}
                >
                  {shareState === "sharing" ? (
                    <>
                      <svg
                        viewBox="0 0 24 24"
                        className="w-4 h-4 animate-spin"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
                        <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
                      </svg>
                      preparing card…
                    </>
                  ) : shareState === "done" ? (
                    <>
                      <svg
                        viewBox="0 0 24 24"
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      shared!
                    </>
                  ) : (
                    <>
                      <svg viewBox="0 0 24 24" className="w-4 h-4 fill-black">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.259 5.63L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                      share on X
                    </>
                  )}
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

              {/* Paste-hint toast: shown when desktop browser doesn't support
                  Web Share API with files; we copied the image to clipboard
                  and opened the X compose window in a new tab. */}
              <AnimatePresence>
                {shareState === "paste-hint" && (
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.2 }}
                    className="mt-4 px-5 py-3 text-sm font-mono text-center max-w-md"
                    style={{
                      background: "rgba(94,255,202,0.10)",
                      border: "1px solid rgba(94,255,202,0.35)",
                      borderRadius: "8px",
                      color: "#FAFAFA",
                    }}
                  >
                    <span style={{ color: BRAND }}>✓ image copied</span> —
                    paste it in the X compose window with{" "}
                    <kbd
                      style={{
                        padding: "2px 6px",
                        background: "rgba(255,255,255,0.10)",
                        borderRadius: "4px",
                        fontSize: "0.85em",
                      }}
                    >
                      ⌘V
                    </kbd>{" "}
                    /{" "}
                    <kbd
                      style={{
                        padding: "2px 6px",
                        background: "rgba(255,255,255,0.10)",
                        borderRadius: "4px",
                        fontSize: "0.85em",
                      }}
                    >
                      Ctrl+V
                    </kbd>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

        </AnimatePresence>
      </main>

    </div>
  );
}
