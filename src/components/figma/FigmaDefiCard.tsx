/**
 * Pixel-accurate "Digital DeFi Profile" standard card.
 *
 * EXACT React/Tailwind structure from Figma's MCP for node 17:3 in
 * https://www.figma.com/design/8NBCbkmU8xskE3uahgVsES/niko-personal
 * (Yerevan Mall workspace copy of the Altura standard card). Only the
 * placeholder text and asset URLs were swapped for our props and local SVGs.
 *
 * Intrinsic size: 750×432.
 */
import { forwardRef } from "react";

const A = "/figma";
const imgLine1 = `${A}/standard-line.svg`;
const imgVector2 = `${A}/standard-mark.svg`;
const imgVector3 = `${A}/standard-wordmark.svg`;
const imgRectangle34625296 = `${A}/standard-rect.svg`;
const imgQrCode = `${A}/standard-qr.svg`;

export interface DefiCardData {
  archetype: string;
  description: string;
  username?: string;
}

interface Props {
  data: DefiCardData;
  className?: string;
}

const FigmaDefiCard = forwardRef<HTMLDivElement, Props>(function FigmaDefiCard(
  { data, className },
  ref,
) {
  // Auto-shrink long titles. Designed for ~10 chars at 66.297px.
  const len = data.archetype.length;
  const titleSize = len <= 10 ? 66.297 : Math.max(34, 66.297 * (10 / len));

  return (
    <div
      ref={ref}
      data-name="2"
      data-node-id="17:3"
      className={`overflow-clip relative rounded-[15px] ${className ?? ""}`}
      style={{ width: 750, height: 432 }}
    >
      <div
        aria-hidden
        className="absolute bg-[#141414] inset-0 pointer-events-none rounded-[15px]"
      />

      {/* Inner panel — clean dark green, no glow vectors */}
      <div className="absolute bg-[#000201] h-[432px] left-0 opacity-80 overflow-clip rounded-[10px] top-0 w-[750px]" />

      {/* Footer line */}
      <div className="-translate-x-1/2 absolute h-0 left-[calc(50%-42px)] top-[383px] w-[598px]">
        <div className="absolute inset-[-1px_0_0_0]">
          <img alt="" className="block max-w-none size-full" src={imgLine1} />
        </div>
      </div>

      {/* Footer URL removed — pending final domain decision. */}

      {/* Green tint overlay */}
      <div
        aria-hidden
        className="absolute bg-[#5dffca] h-[1050px] left-0 mix-blend-overlay top-0 w-[750px]"
      />

      {/* Altura mark (bottom-right) */}
      <div className="absolute h-[52px] left-[651px] top-[351px] w-[69px]">
        <img alt="" className="absolute block max-w-none size-full" src={imgVector2} />
      </div>

      {/* Altura wordmark (top-left) */}
      <div className="absolute h-[20.388px] left-[34px] top-[35px] w-[84px]">
        <img alt="Altura" className="absolute block max-w-none size-full" src={imgVector3} />
      </div>

      {/* Content stack: badge → archetype → description (QR is positioned
          absolutely below so it never overlaps the footer URL) */}
      <div className="absolute content-stretch flex flex-col gap-[10px] items-start left-[34px] top-[142px] w-[355px]">
        {/* DIGITAL DEFI PROFILE chrome badge */}
        <div className="border-[#006745] border-[0.313px] border-solid content-stretch flex gap-[2.5px] items-center justify-center overflow-clip px-[5px] py-[3.75px] relative rounded-bl-[2.5px] rounded-br-[20px] rounded-tl-[30px] rounded-tr-[2.5px] shadow-[0px_12.5px_14.813px_0px_rgba(0,0,0,0.1),0px_7.5px_10.5px_0px_rgba(0,0,0,0.1),0px_2.5px_3.375px_0px_rgba(0,0,0,0.2),0px_1.25px_2.5px_0px_rgba(0,0,0,0.1)] shrink-0 w-[120px]">
          <div
            aria-hidden
            className="absolute backdrop-blur-[2.5px] inset-0 pointer-events-none rounded-bl-[2.5px] rounded-br-[20px] rounded-tl-[30px] rounded-tr-[2.5px]"
            style={{
              backgroundImage:
                "linear-gradient(90deg, rgba(0, 0, 0, 0.71) 0%, rgba(0, 0, 0, 0.71) 100%), linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.8) 100%), linear-gradient(90deg, rgba(255, 255, 255, 0.51) 0%, rgba(255, 255, 255, 0.51) 100%), linear-gradient(266.35deg, rgb(0, 0, 0) 0.14%, rgb(188, 188, 188) 24.22%, rgb(0, 0, 0) 44.84%, rgb(255, 255, 255) 67.83%, rgb(0, 0, 0) 95.31%)",
            }}
          />
          <div
            className="flex flex-col justify-center leading-[0] not-italic relative shrink-0 text-[10px] text-right tracking-[-0.6px] uppercase whitespace-nowrap"
            style={{
              fontFamily: "'Funnel Display', sans-serif",
              fontWeight: 800,
              color: "#FFFFFF",
              textShadow: "0 1px 1px rgba(0,0,0,0.6)",
            }}
          >
            <p className="leading-[7.5px]">Digital defi profile</p>
          </div>
          <div className="-translate-y-1/2 absolute flex h-[14.375px] items-center justify-center left-[-3.75px] mix-blend-overlay right-[-51.88px] top-[calc(50%-0.25px)]">
            <div className="-scale-y-100 flex-none h-[14.375px] rotate-180 w-[175px]">
              <div className="relative size-full">
                <img alt="" className="absolute block max-w-none size-full" src={imgRectangle34625296} />
              </div>
            </div>
          </div>
          <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_1.25px_1.25px_0px_rgba(0,0,0,0.25)]" />
        </div>

        {/* Archetype name — solid WHITE per Figma. */}
        <p
          className="not-italic relative shrink-0 whitespace-nowrap"
          style={{
            fontFamily: "'Funnel Display', sans-serif",
            fontWeight: 400,
            fontSize: titleSize,
            lineHeight: 1.1,
            letterSpacing: `${(-1.3259 / 66.297) * titleSize}px`,
            color: "#FFFFFF",
            margin: 0,
            paddingTop: "0.05em",
          }}
        >
          {data.archetype}
        </p>

        {/* Description — solid white text per Figma. */}
        <p
          className="font-medium leading-[21px] relative shrink-0 text-[12px] uppercase w-[400px]"
          style={{
            fontFamily: "'Geist Mono', monospace",
            color: "#FFFFFF",
            opacity: 0.9,
            margin: 0,
          }}
        >
          {data.description}
        </p>

      </div>

      {/* QR code — bottom-left, just above the divider line per Figma. */}
      <div
        className="absolute border border-black border-solid content-stretch flex items-center justify-center p-[4px] rounded-[13px]"
        style={{ left: 34, top: 295 }}
      >
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none rounded-[13px]"
          style={{
            backgroundImage:
              "linear-gradient(180deg, rgb(3, 18, 5) 0%, rgb(62, 117, 83) 100%)",
          }}
        />
        <div className="relative shrink-0 size-[66.841px] z-10">
          <img alt="" className="absolute block max-w-none size-full" src={imgQrCode} />
        </div>
        <div className="absolute inset-[-0.5px] pointer-events-none rounded-[inherit] shadow-[inset_0_-1px_0_0_rgba(255,255,255,0.5)]" />
      </div>

      {/* Subtle outer chrome bezel */}
      <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0.5px_0.5px_0px_0px_rgba(255,255,255,0.3)]" />
    </div>
  );
});

export default FigmaDefiCard;
