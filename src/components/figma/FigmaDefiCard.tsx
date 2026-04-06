/**
 * Figma-accurate "Digital DeFi Profile" standard card.
 *
 * Source: Figma node 17:3 in
 * https://www.figma.com/design/8NBCbkmU8xskE3uahgVsES/niko-personal?node-id=17-2
 *
 * Intrinsic size 750×432. Parent is responsible for any scaling.
 */
import { forwardRef, type CSSProperties } from "react";

const ASSETS = "/figma";

export interface DefiCardData {
  archetype: string;     // "Baby Whale"
  description: string;   // "$1K-$5K deposited. Not quite Gigachad yet…"
  qrUrl?: string;
  username?: string;
}

const TITLE_GRADIENT_FILL =
  "linear-gradient(85deg, rgb(85,130,100) 10.5%, rgb(56,92,68) 158.5%)";
const TITLE_GRADIENT_SHADOW =
  "linear-gradient(215deg, rgba(0,0,0,0) 177.6%, rgba(0,0,0,0.66) 125.7%, rgba(0,0,0,0) 97.5%, rgba(0,0,0,0.66) 75.4%, rgba(0,0,0,0) 27.7%, rgba(0,0,0,0.66) 6.3%, rgba(0,0,0,0) 67%, rgba(0,0,0,0.578) 110.8%), " +
  "linear-gradient(90deg, rgba(0,0,0,0.24) 0%, rgba(0,0,0,0.24) 100%)";
const SUBTLE_TEXT_GRADIENT =
  "linear-gradient(168deg, rgb(95,107,99) 10.4%, rgb(186,209,193) 53.3%, rgb(255,255,255) 73.4%)";
const BADGE_BG =
  "linear-gradient(90deg, rgba(0,0,0,0.71) 0%, rgba(0,0,0,0.71) 100%), " +
  "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.8) 100%), " +
  "linear-gradient(90deg, rgba(255,255,255,0.51) 0%, rgba(255,255,255,0.51) 100%), " +
  "linear-gradient(266deg, rgb(0,0,0) 0.14%, rgb(188,188,188) 24.2%, rgb(0,0,0) 44.8%, rgb(255,255,255) 67.8%, rgb(0,0,0) 95.3%)";
const BADGE_TEXT =
  "linear-gradient(238deg, rgba(0,0,0,0) 2.7%, rgba(0,0,0,0.66) 17.5%, rgba(0,0,0,0) 28.5%, rgba(0,0,0,0.66) 37.1%, rgba(0,0,0,0) 55.7%, rgba(0,0,0,0.66) 69%, rgba(0,0,0,0) 92.6%, rgba(0,0,0,0.578) 109.7%), " +
  "linear-gradient(90deg, rgba(0,0,0,0.63) 0%, rgba(0,0,0,0.63) 100%)";
const QR_BG = "linear-gradient(180deg, rgb(3,18,5) 0%, rgb(62,117,83) 100%)";

const gradientText = (gradient: string): CSSProperties => ({
  background: gradient,
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  color: "transparent",
  WebkitTextFillColor: "transparent",
});

interface Props {
  data: DefiCardData;
  className?: string;
}

const FigmaDefiCard = forwardRef<HTMLDivElement, Props>(function FigmaDefiCard(
  { data, className },
  ref,
) {
  const qrSrc = data.qrUrl ?? `${ASSETS}/standard-qr.svg`;

  return (
    <div
      ref={ref}
      className={className}
      style={{
        position: "relative",
        width: 750,
        height: 432,
        borderRadius: 15,
        overflow: "hidden",
        background: "#141414",
        fontFamily: "'Funnel Display', 'Helvetica Neue', sans-serif",
        boxShadow: "inset 0.5px 0.5px 0 0 rgba(255,255,255,0.3)",
      }}
    >
      {/* === Inner dark panel with the green glow vectors === */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: 750,
          height: 432,
          borderRadius: 10,
          overflow: "hidden",
          opacity: 0.8,
          background: "#000201",
        }}
      >
        <img
          src={`${ASSETS}/standard-glow-1.svg`}
          alt=""
          style={{
            position: "absolute",
            left: 355,
            top: -31,
            width: 507,
            height: 355,
            mixBlendMode: "overlay",
            pointerEvents: "none",
          }}
        />
        <img
          src={`${ASSETS}/standard-glow-2.svg`}
          alt=""
          style={{
            position: "absolute",
            left: 355,
            top: -31,
            width: 507,
            height: 355,
            mixBlendMode: "plus-lighter",
            pointerEvents: "none",
          }}
        />
      </div>

      {/* === Background light ellipses (mix-blend-overlay) — top right cluster === */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        <img
          src={`${ASSETS}/standard-ellipse-43718.svg`}
          alt=""
          style={{
            position: "absolute",
            left: 246,
            top: -151,
            width: 920.667,
            height: 1003.671,
            mixBlendMode: "overlay",
            transform: "rotate(24.45deg) scaleY(0.98) skewX(-12.51deg)",
          }}
        />
        <img
          src={`${ASSETS}/standard-ellipse-43719.svg`}
          alt=""
          style={{
            position: "absolute",
            left: 445.45,
            top: 72.55,
            width: 521.774,
            height: 556.564,
            mixBlendMode: "overlay",
            transform: "rotate(24.45deg) scaleY(0.98) skewX(-12.51deg)",
          }}
        />
        <img
          src={`${ASSETS}/standard-ellipse-43720.svg`}
          alt=""
          style={{
            position: "absolute",
            left: 541.02,
            top: 164.5,
            width: 330.629,
            height: 372.671,
            mixBlendMode: "overlay",
            transform: "rotate(24.45deg) scaleY(0.98) skewX(-12.51deg)",
          }}
        />
        <img
          src={`${ASSETS}/standard-ellipse-43721.svg`}
          alt=""
          style={{
            position: "absolute",
            left: 619.45,
            top: 252.91,
            width: 173.758,
            height: 195.853,
            mixBlendMode: "overlay",
            transform: "rotate(24.45deg) scaleY(0.98) skewX(-12.51deg)",
          }}
        />

        {/* large faint cluster offstage left/top */}
        <img
          src={`${ASSETS}/standard-ellipse-43722.svg`}
          alt=""
          style={{
            position: "absolute",
            left: -429,
            top: -799,
            width: 1567.333,
            height: 1708.637,
            mixBlendMode: "overlay",
            transform: "rotate(24.45deg) scaleY(0.98) skewX(-12.51deg)",
          }}
        />
        <img
          src={`${ASSETS}/standard-ellipse-43723.svg`}
          alt=""
          style={{
            position: "absolute",
            left: 87,
            top: -418.42,
            width: 888.262,
            height: 947.488,
            mixBlendMode: "overlay",
            transform: "rotate(24.45deg) scaleY(0.98) skewX(-12.51deg)",
          }}
        />
        <img
          src={`${ASSETS}/standard-ellipse-43724.svg`}
          alt=""
          style={{
            position: "absolute",
            left: 218,
            top: -261.9,
            width: 562.859,
            height: 634.431,
            mixBlendMode: "overlay",
            transform: "rotate(24.45deg) scaleY(0.98) skewX(-12.51deg)",
          }}
        />
        <img
          src={`${ASSETS}/standard-ellipse-43725.svg`}
          alt=""
          style={{
            position: "absolute",
            left: 206.76,
            top: -111.39,
            width: 295.804,
            height: 333.418,
            mixBlendMode: "overlay",
            transform: "rotate(24.45deg) scaleY(0.98) skewX(-12.51deg)",
          }}
        />
        <img
          src={`${ASSETS}/standard-ellipse-43726.svg`}
          alt=""
          style={{
            position: "absolute",
            left: 305.87,
            top: -6.05,
            width: 423.261,
            height: 564.11,
            mixBlendMode: "overlay",
            transform: "rotate(30deg)",
          }}
        />
        <img
          src={`${ASSETS}/standard-ellipse-43726.svg`}
          alt=""
          style={{
            position: "absolute",
            left: -190,
            top: -282,
            width: 423.261,
            height: 564.11,
            mixBlendMode: "overlay",
            transform: "rotate(30deg)",
          }}
        />
      </div>

      {/* === Green tint overlay across the whole card === */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background: "#5dffca",
          mixBlendMode: "overlay",
          pointerEvents: "none",
        }}
      />

      {/* === Altura wordmark (top-left) === */}
      <img
        src={`${ASSETS}/standard-wordmark.svg`}
        alt="Altura"
        style={{
          position: "absolute",
          left: 34,
          top: 35,
          width: 84,
          height: 20.39,
        }}
      />

      {/* === Altura mark (bottom-right) === */}
      <img
        src={`${ASSETS}/standard-mark.svg`}
        alt=""
        style={{
          position: "absolute",
          left: 651,
          top: 351,
          width: 69,
          height: 52,
        }}
      />

      {/* === Content stack: badge → archetype → description → QR === */}
      <div
        style={{
          position: "absolute",
          left: 34,
          top: 142,
          width: 355,
          display: "flex",
          flexDirection: "column",
          gap: 10,
          alignItems: "flex-start",
        }}
      >
        {/* Digital DeFi Profile badge */}
        <div
          style={{
            width: 120,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "3.75px 5px",
            borderRadius: "30px 2.5px 20px 2.5px",
            border: "0.313px solid #006745",
            backgroundImage: BADGE_BG,
            backdropFilter: "blur(2.5px)",
            boxShadow:
              "0 12.5px 14.8px 0 rgba(0,0,0,0.1), 0 7.5px 10.5px 0 rgba(0,0,0,0.1), 0 2.5px 3.4px 0 rgba(0,0,0,0.2), 0 1.25px 2.5px 0 rgba(0,0,0,0.1), inset 0 1.25px 1.25px 0 rgba(0,0,0,0.25)",
          }}
        >
          <span
            style={{
              ...gradientText(BADGE_TEXT),
              fontFamily: "'Funnel Display', sans-serif",
              fontWeight: 800,
              fontSize: 10,
              lineHeight: "7.5px",
              letterSpacing: "-0.6px",
              textTransform: "uppercase",
              whiteSpace: "nowrap",
            }}
          >
            Digital defi profile
          </span>
        </div>

        {/* Archetype name — two stacked layers (shadow + fill), auto-shrinks */}
        {(() => {
          const len = data.archetype.length;
          // Designed for ~10 chars at 66.3px. Shrink linearly past that.
          const fontSize =
            len <= 10 ? 66.297 : Math.max(34, 66.297 * (10 / len));
          const titleStyle: CSSProperties = {
            gridColumn: 1,
            gridRow: 1,
            margin: 0,
            fontFamily: "'Funnel Display', sans-serif",
            fontWeight: 400,
            fontSize,
            lineHeight: 0.9,
            letterSpacing: "-1.3259px",
            whiteSpace: "nowrap",
          };
          return (
            <div
              style={{
                position: "relative",
                display: "inline-grid",
                gridTemplateColumns: "max-content",
                gridTemplateRows: "max-content",
              }}
            >
              <p style={{ ...titleStyle, opacity: 0.5, ...gradientText(TITLE_GRADIENT_SHADOW) }}>
                {data.archetype}
              </p>
              <p style={{ ...titleStyle, ...gradientText(TITLE_GRADIENT_FILL) }}>
                {data.archetype}
              </p>
            </div>
          );
        })()}

        {/* Description */}
        <p
          style={{
            margin: 0,
            width: 322,
            fontFamily: "'Geist Mono', monospace",
            fontWeight: 500,
            fontSize: 12,
            lineHeight: "21px",
            textTransform: "uppercase",
            opacity: 0.6,
            ...gradientText(SUBTLE_TEXT_GRADIENT),
          }}
        >
          {data.description}
        </p>

        {/* QR */}
        <div
          style={{
            padding: 4,
            borderRadius: 13,
            border: "1px solid #000",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: QR_BG,
            boxShadow: "inset 0 -0.5px 0 0 #fff, inset 0 -25px 68px 0 #fff",
          }}
        >
          <img src={qrSrc} alt="" style={{ width: 66.84, height: 66.84, display: "block" }} />
        </div>
      </div>

      {/* === Footer line + watermark === */}
      <img
        src={`${ASSETS}/standard-line.svg`}
        alt=""
        style={{
          position: "absolute",
          left: "calc(50% - 42px)",
          top: 383,
          width: 598,
          height: 1,
          transform: "translateX(-50%)",
        }}
      />
      <p
        style={{
          position: "absolute",
          left: "calc(50% - 288px)",
          top: 395,
          margin: 0,
          transform: "translateX(-50%)",
          textAlign: "center",
          fontFamily: "'Geist Mono', monospace",
          fontWeight: 500,
          fontSize: 8,
          lineHeight: "8px",
          textTransform: "uppercase",
          whiteSpace: "nowrap",
          opacity: 0.2,
          ...gradientText(SUBTLE_TEXT_GRADIENT),
        }}
      >
        {data.username
          ? `alturanft.com/persona/${data.username}`
          : "alturanft.com/persona"}
      </p>
    </div>
  );
});

export default FigmaDefiCard;
