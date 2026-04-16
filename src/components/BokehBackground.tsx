/**
 * Animated bokeh background — Altura-branded.
 *
 * Adapted from a pure-CSS bokeh effect (20 glowing orbs that drift on a long
 * orbital path with `transform-origin` offsets). Zero JavaScript, zero
 * external assets — just CSS keyframes. Safe to use anywhere.
 *
 * Palette mapped to Altura brand:
 *   - Vault green     #5EFFCA (the "Altura green" accent)
 *   - Mid teal-green  #16a672
 *   - Deep emerald    #0a5a3f
 *   - Highlight white #ffffff (very rare, like a spec light)
 *
 * The orbs are larger and slower than the source so the page feels calm and
 * premium — not busy.
 */

const ORBS = [
  { color: "#0a5a3f", top: "69%", left: "55%", dur: 24, delay: -7.5, ox: "-16vw", oy: "4vh", dir: "-", blur: 18 },
  { color: "#5EFFCA", top: "45%", left: "32%", dur: 28, delay: -8.7, ox: "-17vw", oy: "9vh", dir: "+", blur: 12 },
  { color: "#16a672", top: "91%", left: "27%", dur: 30, delay: -14.6, ox: "-10vw", oy: "8vh", dir: "-", blur: 14 },
  { color: "#5EFFCA", top: "39%", left: "9%", dur: 32, delay: -5, ox: "-20vw", oy: "12vh", dir: "-", blur: 20 },
  { color: "#16a672", top: "22%", left: "59%", dur: 36, delay: -1.8, ox: "-7vw", oy: "10vh", dir: "-", blur: 13 },
  { color: "#0a5a3f", top: "49%", left: "62%", dur: 26, delay: -8.6, ox: "-14vw", oy: "14vh", dir: "-", blur: 11 },
  { color: "#5EFFCA", top: "45%", left: "10%", dur: 35, delay: -12.1, ox: "20vw", oy: "17vh", dir: "+", blur: 9 },
  { color: "#16a672", top: "48%", left: "89%", dur: 36, delay: -6.3, ox: "-3vw", oy: "15vh", dir: "+", blur: 9 },
  { color: "#0a5a3f", top: "6%", left: "89%", dur: 36, delay: -11.8, ox: "22vw", oy: "-19vh", dir: "-", blur: 8 },
  { color: "#5EFFCA", top: "18%", left: "99%", dur: 28, delay: -4.8, ox: "22vw", oy: "5vh", dir: "+", blur: 14 },
  { color: "#16a672", top: "95%", left: "40%", dur: 34, delay: -2.4, ox: "1vw", oy: "20vh", dir: "+", blur: 16 },
  { color: "#5EFFCA", top: "54%", left: "37%", dur: 36, delay: -9.2, ox: "-24vw", oy: "6vh", dir: "+", blur: 18 },
  { color: "#0a5a3f", top: "87%", left: "10%", dur: 33, delay: -6, ox: "11vw", oy: "-10vh", dir: "-", blur: 11 },
  { color: "#16a672", top: "82%", left: "5%", dur: 29, delay: -2.5, ox: "15vw", oy: "5vh", dir: "+", blur: 22 },
  { color: "#5EFFCA", top: "29%", left: "67%", dur: 36, delay: -3.5, ox: "7vw", oy: "18vh", dir: "-", blur: 9 },
  { color: "#16a672", top: "72%", left: "28%", dur: 27, delay: -11.2, ox: "-1vw", oy: "-4vh", dir: "-", blur: 7 },
  { color: "#5EFFCA", top: "47%", left: "97%", dur: 36, delay: -4.2, ox: "23vw", oy: "-14vh", dir: "+", blur: 14 },
  { color: "#0a5a3f", top: "95%", left: "28%", dur: 39, delay: -10.8, ox: "22vw", oy: "16vh", dir: "+", blur: 13 },
  { color: "#16a672", top: "29%", left: "2%", dur: 33, delay: -7.2, ox: "24vw", oy: "11vh", dir: "+", blur: 18 },
  { color: "#0a5a3f", top: "52%", left: "6%", dur: 38, delay: -2.1, ox: "5vw", oy: "-17vh", dir: "-", blur: 18 },
];

export default function BokehBackground() {
  return (
    <>
      <style>{`
        @keyframes alturaBokehMove {
          to { transform: translate3d(0, 0, 1px) rotate(360deg); }
        }
        .altura-bokeh {
          position: fixed;
          inset: 0;
          width: 100%;
          height: 100%;
          background: radial-gradient(ellipse at center, #061a13 0%, #000503 100%);
          overflow: hidden;
          z-index: 0;
          pointer-events: none;
        }
        .altura-bokeh span {
          position: absolute;
          width: 18vmin;
          height: 18vmin;
          border-radius: 50%;
          backface-visibility: hidden;
          animation-name: alturaBokehMove;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
          opacity: 0.55;
          filter: blur(2px);
        }
        /* Subtle vignette so the cards stay the focus */
        .altura-bokeh::after {
          content: "";
          position: absolute;
          inset: 0;
          background: radial-gradient(
            ellipse at center,
            rgba(0, 0, 0, 0) 30%,
            rgba(0, 0, 0, 0.55) 100%
          );
          pointer-events: none;
        }
        @media (prefers-reduced-motion: reduce) {
          .altura-bokeh span {
            animation: none;
          }
        }
      `}</style>
      <div className="altura-bokeh" aria-hidden="true">
        {ORBS.map((o, i) => (
          <span
            key={i}
            style={{
              color: o.color,
              top: o.top,
              left: o.left,
              animationDuration: `${o.dur}s`,
              animationDelay: `${o.delay}s`,
              transformOrigin: `${o.ox} ${o.oy}`,
              boxShadow: `${o.dir}40vmin 0 ${o.blur}vmin currentColor`,
            }}
          />
        ))}
      </div>
    </>
  );
}
