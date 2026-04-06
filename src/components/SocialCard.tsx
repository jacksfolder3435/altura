import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import type { PersonaResult } from "@/lib/personaGenerator";

export type CardTheme = "dark" | "light" | "platinum";

interface SocialCardProps {
  persona: PersonaResult;
  cardRef?: React.RefObject<HTMLDivElement>;
  theme?: CardTheme;
}

const ASCII_RAMP = '@#S08Xox+=;:-,. ';
const CELL_W = 11, CELL_H = 14;

interface ThemeConfig {
  cardBg: string;
  canvasBg: [number, number, number];
  canvasBase: [number, number, number];
  outerDotFill: string;
  outerDotAlpha: number;
  orbAlpha: number;
  logoFill: string;
  logoOpacity: number;
  textPrimary: string;
  textUrl: string;
  avatarBg: string;
  badgeBorder: string;
  badgeColor: string;
  archetypeName: string;
  description: string;
  metricLabel: string;
  divider: string;
  watermark: string;
}

const PLATINUM_THEME: ThemeConfig = {
  cardBg: "#0c0c14",
  canvasBg: [12, 12, 20],
  canvasBase: [80, 70, 120],
  outerDotFill: "rgb(25,22,40)",
  outerDotAlpha: 0.05,
  orbAlpha: 0.25,
  logoFill: "#FAFAFA",
  logoOpacity: 0.9,
  textPrimary: "#FAFAFA",
  textUrl: "rgba(250,250,250,0.75)",
  avatarBg: "rgba(200,180,255,0.18)",
  badgeBorder: "rgba(200,180,255,0.5)",
  badgeColor: "rgba(200,180,255,0.95)",
  archetypeName: "#c8b4ff",
  description: "rgba(250,250,250,0.85)",
  metricLabel: "rgba(250,250,250,0.5)",
  divider: "rgba(200,180,255,0.15)",
  watermark: "rgba(250,250,250,0.2)",
};

const THEMES: Record<CardTheme, ThemeConfig> = {
  platinum: PLATINUM_THEME,
  dark: {
    cardBg: "#0a0a0a",
    canvasBg: [10, 10, 10],
    canvasBase: [20, 80, 60],
    outerDotFill: "rgb(15,30,22)",
    outerDotAlpha: 0.06,
    orbAlpha: 0.3,
    logoFill: "#FAFAFA",
    logoOpacity: 0.8,
    textPrimary: "#FAFAFA",
    textUrl: "rgba(250,250,250,0.75)",
    avatarBg: "rgba(94,255,202,0.18)",
    badgeBorder: "rgba(94,255,202,0.5)",
    badgeColor: "rgba(94,255,202,0.95)",
    archetypeName: "#5EFFCA",
    description: "rgba(250,250,250,0.88)",
    metricLabel: "rgba(250,250,250,1.0)",
    divider: "rgba(94,255,202,0.2)",
    watermark: "rgba(250,250,250,0.2)",
  },
  light: {
    cardBg: "#f2f0ed",
    canvasBg: [242, 240, 237],
    canvasBase: [20, 80, 60],
    outerDotFill: "rgb(210,205,200)",
    outerDotAlpha: 0.02,
    orbAlpha: 0.18,
    logoFill: "#1B1B1B",
    logoOpacity: 0.75,
    textPrimary: "#1B1B1B",
    textUrl: "rgba(27,27,27,0.85)",
    avatarBg: "rgba(94,255,202,0.15)",
    badgeBorder: "rgba(94,255,202,0.6)",
    badgeColor: "rgba(20,100,75,1.0)",
    archetypeName: "#0d7a5c",
    description: "rgba(27,27,27,1.0)",
    metricLabel: "rgba(27,27,27,1.0)",
    divider: "rgba(27,27,27,0.15)",
    watermark: "rgba(27,27,27,0.2)",
  },
};

function drawOrb(canvas: HTMLCanvasElement, t: ThemeConfig) {
  const canvasW = canvas.offsetWidth || 680;
  const canvasH = canvas.offsetHeight || 382;
  if (!canvasW || !canvasH) return;
  canvas.width = canvasW;
  canvas.height = canvasH;

  const W = Math.ceil(canvasW / CELL_W) + 1;
  const H = Math.ceil(canvasH / CELL_H) + 1;
  const CX_PX = canvasW / 2, CY_PX = canvasH / 2;
  const RADIUS_PX = Math.round(Math.min(canvasW, canvasH) * 0.42);
  const [BG_R, BG_G, BG_B] = t.canvasBg;
  const [BASE_R, BASE_G, BASE_B] = t.canvasBase;

  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = t.cardBg;
  ctx.fillRect(0, 0, canvasW, canvasH);
  ctx.font = `bold ${CELL_H - 2}px monospace`;
  ctx.textBaseline = "top";

  for (let row = 0; row < H; row++) {
    for (let col = 0; col < W; col++) {
      const x = col * CELL_W, y = row * CELL_H;
      const dpx = x - CX_PX, dpy = y - CY_PX;
      const dist = Math.sqrt(dpx * dpx + dpy * dpy);

      if (dist > RADIUS_PX) {
        ctx.globalAlpha = t.outerDotAlpha;
        ctx.fillStyle = t.outerDotFill;
        ctx.fillText(".", x, y);
        ctx.globalAlpha = 1;
        continue;
      }

      const edgeBlend = Math.max(0, Math.min(1, (RADIUS_PX - dist) / (RADIUS_PX * 0.25)));
      const nxc = Math.max(-1, Math.min(1, dpx / RADIUS_PX));
      const nyc = Math.max(-1, Math.min(1, dpy / RADIUS_PX));
      const nz = Math.sqrt(Math.max(0, 1 - nxc * nxc - nyc * nyc));
      const lx = -0.5, ly = -0.55, lz = 0.7;
      const llen = Math.sqrt(lx * lx + ly * ly + lz * lz);
      const dot = Math.max(0, (nxc * lx + nyc * ly + nz * lz) / llen);

      const light = 0.18 + dot * 0.6;
      const spec = Math.pow(Math.max(0, dot), 22) * 0.45;
      const ef = Math.pow(nz, 0.5);

      let r = Math.min(255, Math.round((BASE_R * light + 180 * spec) * ef + BASE_R * 0.05));
      let g = Math.min(255, Math.round((BASE_G * light + 180 * spec) * ef + BASE_G * 0.05));
      let b = Math.min(255, Math.round((BASE_B * light + 255 * spec) * ef + BASE_B * 0.05));

      const ed = Math.pow(1 - nz, 2.5) * 0.75;
      r = Math.round(r * (1 - ed) + BG_R * ed);
      g = Math.round(g * (1 - ed) + BG_G * ed);
      b = Math.round(b * (1 - ed) + BG_B * ed);

      r = Math.round(r * edgeBlend + BG_R * (1 - edgeBlend));
      g = Math.round(g * edgeBlend + BG_G * (1 - edgeBlend));
      b = Math.round(b * edgeBlend + BG_B * (1 - edgeBlend));

      const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
      const idx = Math.max(0, Math.min(ASCII_RAMP.length - 1, Math.floor((1 - lum) * (ASCII_RAMP.length - 1))));
      const ch = ASCII_RAMP[idx];
      const mx = Math.max(r, g, b, 1);
      const nr = Math.round(r / mx * 255), ng = Math.round(g / mx * 255), nb2 = Math.round(b / mx * 255);

      ctx.globalAlpha = (edgeBlend * 0.92 + 0.08) * t.orbAlpha;
      const glowCond = t.orbAlpha === 1 ? lum > 0.6 : lum < 0.5;
      if (glowCond) {
        ctx.shadowBlur = t.orbAlpha === 1 ? lum * 10 : (1 - lum) * 6;
        ctx.shadowColor = t.orbAlpha === 1 ? "rgba(180,180,190,0.5)" : "rgba(27,27,27,0.25)";
      } else {
        ctx.shadowBlur = 0;
      }
      ctx.fillStyle = `rgb(${nr},${ng},${nb2})`;
      ctx.fillText(ch, x, y);
      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;
    }
  }
}

export default function SocialCard({ persona, cardRef, theme = "dark" }: SocialCardProps) {
  const { archetype, stats, username } = persona;
  const { analyticsScore, precision, depth, signal, scale } = stats;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const t = THEMES[theme];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (canvas.offsetWidth > 0 && canvas.offsetHeight > 0) {
      drawOrb(canvas, t);
      return;
    }

    const ro = new ResizeObserver(() => {
      if (canvas.offsetWidth > 0 && canvas.offsetHeight > 0) {
        drawOrb(canvas, t);
        ro.disconnect();
      }
    });
    ro.observe(canvas);
    return () => ro.disconnect();
  }, [theme]);

  const initials = username.slice(0, 2).toUpperCase();

  return (
    <div
      ref={cardRef}
      className="relative rounded-2xl overflow-hidden flex flex-col"
      style={{
        background: t.cardBg,
        fontFamily: "'Funnel Display', sans-serif",
        width: "880px",
        height: "495px",
        flexShrink: 0,
      }}
    >
      {/* ── ASCII orb background ── */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" style={{ pointerEvents: "none" }} />

      {/* ── Top bar: logo + user ── */}
      <div className="relative z-10 flex items-center justify-between px-10 pt-8">
        <div style={{ opacity: t.logoOpacity, pointerEvents: "none", lineHeight: 0 }}>
          <img src="/altura-wordmark.svg" alt="Altura" style={{ height: "26px", filter: theme === "light" ? "invert(1)" : "none" }} />
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="font-bold text-lg leading-tight" style={{ color: t.textPrimary, fontFamily: "'Funnel Display', sans-serif", fontWeight: 700 }}>
              @{username}
            </div>
          </div>
          <div className="relative rounded-full flex-shrink-0 overflow-hidden" style={{ width: 52, height: 52 }}>
            <div className="absolute inset-0 flex items-center justify-center font-bold text-base select-none"
              style={{ background: t.avatarBg, color: t.textPrimary, fontFamily: "'Funnel Display', sans-serif", fontWeight: 700 }}>
              {initials}
            </div>
            <img src={`https://unavatar.io/x/${username}`} alt={`@${username}`}
              className="absolute inset-0 w-full h-full object-cover rounded-full"
              onError={(e) => { e.currentTarget.style.display = "none"; }} />
          </div>
        </div>
      </div>

      {/* ── Badge ── */}
      <div className="relative z-10 px-10 pt-4">
        <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded text-[12px] tracking-widest uppercase"
          style={{ border: `1px solid ${t.badgeBorder}`, color: t.badgeColor, fontFamily: "'Funnel Display', 'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
          DIGITAL DEFI PROFILE
        </div>
      </div>

      {/* ── Hero: emoji + profile name + description ── */}
      <div className="relative z-10 flex flex-col justify-center px-10 flex-1" style={{ paddingTop: "12px", paddingBottom: "12px" }}>
        <div className="flex items-center gap-5 mb-4">
          <span style={{ fontSize: "60px", lineHeight: 1 }}>{archetype.emoji}</span>
          <div className="tracking-tight"
            style={{ fontSize: "44px", color: t.archetypeName, fontFamily: "'Funnel Display', sans-serif", fontWeight: 700, lineHeight: 1.1 }}>
            {archetype.name}
          </div>
        </div>
        <div className="leading-relaxed"
          style={{ fontSize: "18px", color: t.description, fontFamily: "'Funnel Display', 'Helvetica Neue', Helvetica, Arial, sans-serif", fontWeight: 300, maxWidth: "92%", lineHeight: 1.6 }}>
          {archetype.description}
        </div>
      </div>

      {/* ── Divider ── */}
      <div className="relative z-10 mx-10" style={{ height: "1px", background: t.divider }} />

      {/* ── Bottom watermark ── */}
      <div className="relative z-10 flex items-end justify-center px-10 py-5">
        <div className="tracking-widest" style={{ fontSize: "11px", color: t.watermark, fontFamily: "'Funnel Display', 'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
          alturanft.com/persona
        </div>
      </div>
    </div>
  );
}

// Animated wrapper — scales card to fill available width
export function SocialCardAnimated({ persona, cardRef, theme = "dark" }: { persona: PersonaResult; cardRef?: React.RefObject<HTMLDivElement>; theme?: CardTheme }) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) setScale(entry.contentRect.width / 880);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      style={{ width: "100%" }}
    >
      <div ref={wrapperRef} style={{ width: "100%", aspectRatio: "16 / 9", position: "relative", overflow: "hidden", borderRadius: "1rem" }}>
        <div style={{ position: "absolute", top: 0, left: 0, transformOrigin: "top left", transform: `scale(${scale})` }}>
          <SocialCard persona={persona} cardRef={cardRef} theme={theme} />
        </div>
      </div>
    </motion.div>
  );
}

// ─── Pure-canvas renderer — used by clipboard copy, no html2canvas ───────────

function _loadImg(src: string, ms = 3000): Promise<HTMLImageElement> {
  return new Promise((res, rej) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => res(img);
    img.onerror = () => rej(new Error("load error"));
    img.src = src;
    setTimeout(() => rej(new Error("timeout")), ms);
  });
}

function _wrap(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxW: number, lineH: number) {
  const words = text.split(" ");
  let line = "", cy = y;
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxW && line) { ctx.fillText(line, x, cy); line = word; cy += lineH; }
    else line = test;
  }
  if (line) ctx.fillText(line, x, cy);
}

/** Renders the card entirely via Canvas 2D — no html2canvas, no DOM capture. Always produces a clean 1360×764 (2×) PNG. */
export async function renderCardToCanvas(persona: PersonaResult, theme: CardTheme): Promise<HTMLCanvasElement> {
  const S = 2, W = 880, H = 495;
  const t = THEMES[theme];
  const { archetype, stats, username } = persona;

  await Promise.all([
    document.fonts.load(`700 12px "Funnel Display"`),
    document.fonts.load(`300 12px "Funnel Display"`),
  ]);

  const orbC = document.createElement("canvas");
  drawOrb(orbC, t);

  const canvas = document.createElement("canvas");
  canvas.width = W * S;
  canvas.height = H * S;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(orbC, 0, 0, W * S, H * S);

  ctx.save();
  ctx.scale(S, S);

  const FONT = "'Funnel Display', 'Helvetica Neue', Helvetica, Arial, sans-serif";
  const PX = 32;

  // ── Altura Logo ──
  ctx.fillStyle = t.logoFill;
  ctx.globalAlpha = t.logoOpacity;
  ctx.font = `700 16px ${FONT}`;
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.fillText("Altura", PX, 23);
  ctx.globalAlpha = 1;

  // ── Username ──
  ctx.textBaseline = "top";
  ctx.textAlign = "right";
  ctx.font = `700 14px ${FONT}`;
  ctx.fillStyle = t.textPrimary;
  ctx.fillText(`@${username}`, W - PX - 56, 22);

  // ── Avatar ──
  const AR = 22, AX = W - PX - 44, AY = 18;
  ctx.fillStyle = t.avatarBg;
  ctx.beginPath(); ctx.arc(AX + AR, AY + AR, AR, 0, Math.PI * 2); ctx.fill();
  try {
    const av = await _loadImg(`https://unavatar.io/x/${username}`, 3000);
    ctx.save();
    ctx.beginPath(); ctx.arc(AX + AR, AY + AR, AR, 0, Math.PI * 2); ctx.clip();
    ctx.drawImage(av, AX, AY, 44, 44);
    ctx.restore();
  } catch {
    ctx.fillStyle = t.textPrimary;
    ctx.font = `700 13px ${FONT}`; ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText(username.slice(0, 2).toUpperCase(), AX + AR, AY + AR);
    ctx.textBaseline = "top";
  }

  // ── DIGITAL DEFI PROFILE badge ──
  const BX = PX, BY = 66, BW = 160, BH = 20;
  ctx.strokeStyle = t.badgeBorder; ctx.lineWidth = 1;
  ctx.beginPath();
  if (ctx.roundRect) ctx.roundRect(BX, BY, BW, BH, 3); else ctx.rect(BX, BY, BW, BH);
  ctx.stroke();
  ctx.fillStyle = t.badgeColor; ctx.font = `400 8px ${FONT}`;
  ctx.textAlign = "left"; ctx.textBaseline = "middle";
  ctx.fillText("DIGITAL DEFI PROFILE", BX + 8, BY + BH / 2);

  // ── Emoji ──
  ctx.font = `400 42px sans-serif`;
  ctx.textAlign = "left"; ctx.textBaseline = "top";
  ctx.fillText(archetype.emoji, PX, 110);

  // ── Profile name (large) ──
  ctx.fillStyle = t.archetypeName;
  ctx.font = `700 32px ${FONT}`;
  ctx.textAlign = "left"; ctx.textBaseline = "top";
  ctx.fillText(archetype.name, PX + 56, 116);

  // ── Description (full width) ──
  ctx.fillStyle = t.description;
  ctx.font = `300 14px ${FONT}`;
  _wrap(ctx, archetype.description, PX, 170, W - PX * 2, 22);

  // ── Divider ──
  const DIV_Y = 340;
  ctx.fillStyle = t.divider;
  ctx.fillRect(PX, DIV_Y, W - PX * 2, 1);

  // ── Watermark ──
  ctx.fillStyle = t.watermark; ctx.font = `400 8px ${FONT}`;
  ctx.textAlign = "center"; ctx.textBaseline = "top";
  ctx.fillText("alturanft.com/persona", W / 2, DIV_Y + 12);

  ctx.restore();
  return canvas;
}

// ─── PLATINUM CARD — for Altura vault users with PNL data ───────────

export interface PnlData {
  totalDeposited: string;
  currentValue: string;
  pnl: string;
  pnlPercent: string;
  apy: string;
  vaultDays: number;
  isPositive: boolean;
}

interface PlatinumCardProps {
  persona: PersonaResult;
  pnl: PnlData;
  cardRef?: React.RefObject<HTMLDivElement>;
}

export function PlatinumCard({ persona, pnl, cardRef }: PlatinumCardProps) {
  const { archetype, username } = persona;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const t = PLATINUM_THEME;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (canvas.offsetWidth > 0 && canvas.offsetHeight > 0) { drawOrb(canvas, t); return; }
    const ro = new ResizeObserver(() => {
      if (canvas.offsetWidth > 0 && canvas.offsetHeight > 0) { drawOrb(canvas, t); ro.disconnect(); }
    });
    ro.observe(canvas);
    return () => ro.disconnect();
  }, []);

  const initials = username.slice(0, 2).toUpperCase();

  return (
    <div
      ref={cardRef}
      className="relative rounded-2xl overflow-hidden flex flex-col"
      style={{
        background: t.cardBg,
        fontFamily: "'Funnel Display', sans-serif",
        width: "880px",
        height: "495px",
        flexShrink: 0,
        border: "1px solid rgba(200,180,255,0.15)",
      }}
    >
      {/* ── ASCII orb background ── */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" style={{ pointerEvents: "none" }} />

      {/* ── Platinum shimmer overlay ── */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "linear-gradient(135deg, rgba(200,180,255,0.03) 0%, transparent 40%, rgba(200,180,255,0.05) 60%, transparent 100%)",
      }} />

      {/* ── Top bar: logo + badge + user ── */}
      <div className="relative z-10 flex items-center justify-between px-10 pt-8">
        <div className="flex items-center gap-4">
          <div style={{ opacity: t.logoOpacity, pointerEvents: "none", lineHeight: 0 }}>
            <img src="/altura-wordmark.svg" alt="Altura" style={{ height: "26px" }} />
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-sm text-[11px] tracking-widest uppercase"
            style={{ background: "rgba(200,180,255,0.12)", border: "1px solid rgba(200,180,255,0.3)", color: "#c8b4ff", fontWeight: 700, letterSpacing: "0.15em" }}>
            ✦ PLATINUM
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="font-bold text-lg leading-tight" style={{ color: t.textPrimary, fontWeight: 700 }}>
              @{username}
            </div>
          </div>
          <div className="relative rounded-full flex-shrink-0 overflow-hidden" style={{ width: 52, height: 52 }}>
            <div className="absolute inset-0 flex items-center justify-center font-bold text-base select-none"
              style={{ background: t.avatarBg, color: t.textPrimary, fontWeight: 700 }}>
              {initials}
            </div>
            <img src={`https://unavatar.io/x/${username}`} alt={`@${username}`}
              className="absolute inset-0 w-full h-full object-cover rounded-full"
              onError={(e) => { e.currentTarget.style.display = "none"; }} />
          </div>
        </div>
      </div>

      {/* ── Profile name row ── */}
      <div className="relative z-10 px-10 pt-4 pb-2">
        <div className="flex items-center gap-4">
          <span style={{ fontSize: "44px", lineHeight: 1 }}>{archetype.emoji}</span>
          <div style={{ fontSize: "36px", color: t.archetypeName, fontWeight: 700, lineHeight: 1.1, letterSpacing: "-0.02em" }}>
            {archetype.name}
          </div>
        </div>
        <div className="mt-2" style={{ fontSize: "16px", color: t.description, fontWeight: 300, maxWidth: "90%", lineHeight: 1.6 }}>
          {archetype.description}
        </div>
      </div>

      {/* ── PNL Stats Grid ── */}
      <div className="relative z-10 flex-1 flex items-end px-10 pb-4">
        <div className="w-full grid grid-cols-2 gap-6">
          <div className="flex flex-col">
            <span className="text-[11px] tracking-widest uppercase mb-1.5" style={{ color: t.metricLabel }}>PNL</span>
            <span className="text-2xl font-bold" style={{ color: pnl.isPositive ? "#5EFFCA" : "#ff5e5e" }}>
              {pnl.isPositive ? "+" : ""}{pnl.pnl} <span style={{ fontSize: "14px", opacity: 0.7 }}>({pnl.pnlPercent})</span>
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-[11px] tracking-widest uppercase mb-1.5" style={{ color: t.metricLabel }}>APY</span>
            <span className="text-2xl font-bold" style={{ color: "#5EFFCA" }}>{pnl.apy}</span>
            <span className="text-[11px] mt-0.5" style={{ color: t.metricLabel }}>{pnl.vaultDays}d in vault</span>
          </div>
        </div>
      </div>

      {/* ── Divider ── */}
      <div className="relative z-10 mx-10" style={{ height: "1px", background: t.divider }} />

      {/* ── Bottom watermark ── */}
      <div className="relative z-10 flex items-center justify-center px-10 py-4">
        <div className="tracking-widest" style={{ fontSize: "11px", color: t.watermark }}>
          alturanft.com/persona · vault verified
        </div>
      </div>
    </div>
  );
}

export function PlatinumCardAnimated({ persona, pnl, cardRef }: { persona: PersonaResult; pnl: PnlData; cardRef?: React.RefObject<HTMLDivElement> }) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) setScale(entry.contentRect.width / 880);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      style={{ width: "100%" }}
    >
      <div ref={wrapperRef} style={{ width: "100%", aspectRatio: "16 / 9", position: "relative", overflow: "hidden", borderRadius: "1rem" }}>
        <div style={{ position: "absolute", top: 0, left: 0, transformOrigin: "top left", transform: `scale(${scale})` }}>
          <PlatinumCard persona={persona} pnl={pnl} cardRef={cardRef} />
        </div>
      </div>
    </motion.div>
  );
}
