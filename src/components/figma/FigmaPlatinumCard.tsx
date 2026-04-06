/**
 * Figma-accurate Platinum PNL card.
 *
 * Source: Figma node 17:37 in
 * https://www.figma.com/design/8NBCbkmU8xskE3uahgVsES/niko-personal?node-id=17-2
 *
 * Design size is 750×432 (≈ 1.736 ratio). The card is rendered at that
 * intrinsic size and the *parent* is responsible for scaling it (e.g. with
 * `transform: scale(...)`) so all the absolute positions stay pixel-perfect.
 */
import { forwardRef, type CSSProperties } from "react";

const ASSETS = "/figma";

export interface PlatinumPnlData {
  archetype: string;        // "Baby Whale"
  description: string;      // "$1K-$5K deposited. Not quite Gigachad yet…"
  pnlValue: string;         // "+$4,270"
  pnlPercent: string;       // "(+50,7%)"
  apyValue: string;         // "82,4%"
  qrUrl?: string;           // optional override for the QR png
  username?: string;        // shown in the alturaft.com/persona footer
}

const TITLE_GRADIENT =
  "linear-gradient(-84deg, rgb(255,255,255) 1.8%, rgb(175,184,181) 64.6%, rgb(23,33,30) 117.6%)";
const SUBTLE_TEXT_GRADIENT =
  "linear-gradient(165deg, rgb(95,107,99) 10.4%, rgb(186,209,193) 53.3%, rgb(255,255,255) 73.4%)";
const VALUE_GRADIENT =
  "linear-gradient(87deg, rgb(85,130,100) 10.5%, rgb(56,92,68) 158.5%)";
const PERCENT_GRADIENT =
  "linear-gradient(4deg, rgb(51,141,111) 3.7%, rgb(0,52,35) 71.2%)";
const BADGE_BG =
  "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.8) 100%), " +
  "linear-gradient(90deg, rgba(255,255,255,0.51) 0%, rgba(255,255,255,0.51) 100%), " +
  "linear-gradient(268deg, rgb(0,0,0) 0.14%, rgb(188,188,188) 24.2%, rgb(0,0,0) 44.8%, rgb(255,255,255) 67.8%, rgb(0,0,0) 95.3%)";
const BADGE_TEXT =
  "linear-gradient(252deg, rgba(0,0,0,0) 2.7%, rgba(0,0,0,0.66) 17.5%, rgba(0,0,0,0) 28.5%, rgba(0,0,0,0.66) 37.1%, rgba(0,0,0,0) 55.7%, rgba(0,0,0,0.66) 69%, rgba(0,0,0,0) 92.6%, rgba(0,0,0,0.578) 109.7%), " +
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
  data: PlatinumPnlData;
  className?: string;
}

const FigmaPlatinumCard = forwardRef<HTMLDivElement, Props>(function FigmaPlatinumCard(
  { data, className },
  ref,
) {
  const qrSrc = data.qrUrl ?? `${ASSETS}/platinum-qr.svg`;

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
        boxShadow: "inset 2px 2px 0 0 #ffffff",
      }}
    >
      {/* === Background light ellipses (mix-blend-overlay) === */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        <img
          src={`${ASSETS}/platinum-ellipse-170.svg`}
          alt=""
          style={{
            position: "absolute",
            left: -131,
            top: 41.43,
            width: 368.845,
            height: 542.348,
            mixBlendMode: "overlay",
            transform: "rotate(19.59deg)",
          }}
        />
        <img
          src={`${ASSETS}/platinum-ellipse-167.svg`}
          alt=""
          style={{
            position: "absolute",
            left: -101,
            top: 378,
            width: 308.817,
            height: 380.619,
            transform: "rotate(22.9deg)",
          }}
        />
        <img
          src={`${ASSETS}/platinum-ellipse-169.svg`}
          alt=""
          style={{
            position: "absolute",
            left: 385,
            top: 108,
            width: 368.845,
            height: 542.348,
            mixBlendMode: "overlay",
            transform: "rotate(19.59deg)",
          }}
        />
        <img
          src={`${ASSETS}/platinum-ellipse-174.svg`}
          alt=""
          style={{
            position: "absolute",
            left: 154,
            top: -249,
            width: 308.817,
            height: 380.619,
            transform: "rotate(22.9deg)",
          }}
        />
        <img
          src={`${ASSETS}/platinum-ellipse-171.svg`}
          alt=""
          style={{
            position: "absolute",
            left: -71,
            top: -322,
            width: 233.639,
            height: 440.03,
            transform: "rotate(22.9deg)",
          }}
        />
        <img
          src={`${ASSETS}/platinum-ellipse-172.svg`}
          alt=""
          style={{
            position: "absolute",
            left: 624,
            top: -337,
            width: 230.541,
            height: 432.695,
            transform: "rotate(22.9deg)",
          }}
        />
        <img
          src={`${ASSETS}/platinum-ellipse-173.svg`}
          alt=""
          style={{
            position: "absolute",
            left: 565,
            top: 151,
            width: 233.639,
            height: 440.03,
            transform: "rotate(22.9deg)",
          }}
        />
      </div>

      {/* === Inner dark panel with the green glow vector === */}
      <div
        style={{
          position: "absolute",
          left: 10,
          top: 10,
          width: 730,
          height: 412,
          borderRadius: 10,
          overflow: "hidden",
          opacity: 0.8,
          background: "#000201",
          boxShadow:
            "inset 0 -1px 0 0 #ffffff, inset 0 1px 0 0 rgba(0,0,0,0.45)",
        }}
      >
        <img
          src={`${ASSETS}/platinum-glow.svg`}
          alt=""
          style={{
            position: "absolute",
            left: 335,
            top: -116,
            width: 507,
            height: 355,
            mixBlendMode: "plus-lighter",
            pointerEvents: "none",
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
        src={`${ASSETS}/platinum-wordmark.svg`}
        alt="Altura"
        style={{
          position: "absolute",
          left: 34,
          top: 34.83,
          width: 84,
          height: 20.39,
        }}
      />

      {/* === Altura mark (bottom-right) === */}
      <img
        src={`${ASSETS}/platinum-mark.svg`}
        alt=""
        style={{
          position: "absolute",
          left: 651,
          top: 351,
          width: 69,
          height: 52,
        }}
      />

      {/* === Platinum chrome badge (next to wordmark) === */}
      <div
        style={{
          position: "absolute",
          left: 129,
          top: 39,
          width: 68.44,
          height: 15.5,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "3.75px 5px",
          gap: 2.5,
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
          }}
        >
          Platinum
        </span>
      </div>

      {/* === QR code (top-right) === */}
      <div
        style={{
          position: "absolute",
          left: 654,
          top: 35,
          width: 74.84,
          height: 74.84,
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
        <img
          src={qrSrc}
          alt=""
          style={{ width: 66.84, height: 66.84, display: "block" }}
        />
      </div>

      {/* === Title: archetype name (auto-shrinks if long) === */}
      {(() => {
        const len = data.archetype.length;
        // Designed for ~12 chars at 51px. Shrink linearly past that.
        const fontSize =
          len <= 12 ? 51.273 : Math.max(28, 51.273 * (12 / len));
        return (
          <p
            style={{
              position: "absolute",
              left: 32,
              top: 71,
              right: 150, // leave room for QR
              margin: 0,
              fontFamily: "'Funnel Display', sans-serif",
              fontWeight: 500,
              fontSize,
              lineHeight: 0.91,
              letterSpacing: "-1.0255px",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              ...gradientText(TITLE_GRADIENT),
            }}
          >
            {data.archetype}
          </p>
        );
      })()}

      {/* === Description === */}
      <p
        style={{
          position: "absolute",
          left: 32,
          top: 131,
          width: 263,
          margin: 0,
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

      {/* === PNL block (left) === */}
      <div
        style={{
          position: "absolute",
          left: 32,
          top: 262.34,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: 16.981,
        }}
      >
        <p
          style={{
            margin: 0,
            fontFamily: "'Funnel Display', sans-serif",
            fontWeight: 400,
            fontSize: 71.544,
            lineHeight: 0.9,
            letterSpacing: "-1.4309px",
            whiteSpace: "nowrap",
            ...gradientText(VALUE_GRADIENT),
          }}
        >
          {data.pnlValue}
        </p>
        <p
          style={{
            margin: 0,
            fontFamily: "'Geist Mono', monospace",
            fontWeight: 500,
            fontSize: 16.981,
            lineHeight: "21.19px",
            textTransform: "uppercase",
            ...gradientText(SUBTLE_TEXT_GRADIENT),
          }}
        >
          PNL
        </p>
      </div>

      {/* === Percent (next to PNL value) === */}
      <p
        style={{
          position: "absolute",
          left: 297.5,
          top: 294.13,
          margin: 0,
          fontFamily: "'Funnel Display', sans-serif",
          fontWeight: 400,
          fontSize: 27.792,
          lineHeight: 0.9,
          letterSpacing: "-0.5558px",
          whiteSpace: "nowrap",
          ...gradientText(PERCENT_GRADIENT),
        }}
      >
        {data.pnlPercent}
      </p>

      {/* === APY block (right) === */}
      <div
        style={{
          position: "absolute",
          left: 464.45,
          top: 261,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: 16.981,
        }}
      >
        <p
          style={{
            margin: 0,
            fontFamily: "'Funnel Display', sans-serif",
            fontWeight: 400,
            fontSize: 71.544,
            lineHeight: 0.9,
            letterSpacing: "-1.4309px",
            whiteSpace: "nowrap",
            ...gradientText(VALUE_GRADIENT),
          }}
        >
          {data.apyValue}
        </p>
        <p
          style={{
            margin: 0,
            fontFamily: "'Geist Mono', monospace",
            fontWeight: 500,
            fontSize: 16.981,
            lineHeight: "21.19px",
            textTransform: "uppercase",
            ...gradientText(SUBTLE_TEXT_GRADIENT),
          }}
        >
          APY
        </p>
      </div>

      {/* === Footer line + watermark === */}
      <img
        src={`${ASSETS}/platinum-line.svg`}
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
          left: "calc(50% - 42px)",
          top: 395,
          width: 314,
          margin: 0,
          transform: "translateX(-50%)",
          textAlign: "center",
          fontFamily: "'Geist Mono', monospace",
          fontWeight: 500,
          fontSize: 8,
          lineHeight: "8px",
          textTransform: "uppercase",
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

export default FigmaPlatinumCard;
