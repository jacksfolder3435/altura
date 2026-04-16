/**
 * Pixel-accurate Platinum PNL card.
 *
 * This is the EXACT React/Tailwind structure that Figma's MCP exports for
 * node 17:37 in https://www.figma.com/design/8NBCbkmU8xskE3uahgVsES/niko-personal
 * (the Yerevan Mall workspace copy of the Altura PNL card). The only
 * substitutions are the placeholder text (Baby Whale, +$4,270, ...) replaced
 * with our dynamic props, and the asset URLs replaced with the locally
 * downloaded copies in /public/figma/.
 *
 * Intrinsic size: 750×432 (parent is responsible for any scaling).
 */
import { forwardRef } from "react";

const A = "/figma";

const imgEllipse174 = `${A}/platinum-ellipse-174.svg`;
const imgEllipse170 = `${A}/platinum-ellipse-170.svg`;
const imgEllipse167 = `${A}/platinum-ellipse-167.svg`;
const imgEllipse169 = `${A}/platinum-ellipse-169.svg`;
const imgEllipse171 = `${A}/platinum-ellipse-171.svg`;
const imgEllipse172 = `${A}/platinum-ellipse-172.svg`;
const imgEllipse173 = `${A}/platinum-ellipse-173.svg`;
const imgLine1 = `${A}/platinum-line.svg`;
const imgGlow = `${A}/platinum-glow.svg`;
const imgMark = `${A}/platinum-mark.svg`;
const imgWordmark = `${A}/platinum-wordmark.svg`;
const imgQrCode = `${A}/platinum-qr.svg`;

export interface PlatinumPnlData {
  archetype: string;        // "Baby Whale"
  description: string;      // "$1K-$5K DEPOSITED. NOT QUITE GIGACHAD YET. BUT YOU'RE ON"
  pnlValue: string;         // "+$4,270"
  pnlPercent: string;       // "(+50,7%)"
  apyValue: string;         // "82,4%"
  username?: string;        // X handle (without @)
  /** X profile picture URL (from X API `profile_image_url`). */
  avatarUrl?: string;
}

interface Props {
  data: PlatinumPnlData;
  className?: string;
}

const FigmaPlatinumCard = forwardRef<HTMLDivElement, Props>(function FigmaPlatinumCard(
  { data, className },
  ref,
) {
  // Auto-shrink long titles. Designed for ~12 chars at 51.273px.
  const titleLen = data.archetype.length;
  const titleSize = titleLen <= 12 ? 51.273 : Math.max(28, 51.273 * (12 / titleLen));

  return (
    <div
      ref={ref}
      data-name="1"
      data-node-id="17:37"
      className={`overflow-clip relative rounded-[15px] ${className ?? ""}`}
      style={{ width: 750, height: 432 }}
    >
      {/* Card base */}
      <div
        aria-hidden
        className="absolute bg-[#141414] inset-0 pointer-events-none rounded-[15px]"
      />

      {/* Ellipse 174 */}
      <div
        className="absolute flex h-[380.619px] items-center justify-center left-[154px] top-[-249px] w-[308.817px]"
      >
        <div className="flex-none rotate-[22.9deg]">
          <div className="h-[330.556px] relative w-[195.608px]">
            <div className="absolute inset-[-27.1%_-45.8%]">
              <img alt="" className="block max-w-none size-full" src={imgEllipse174} />
            </div>
          </div>
        </div>
      </div>

      {/* Lights frame */}
      <div className="absolute contents left-[-131px] top-[-337px]" data-name="Lights">
        <div className="absolute flex h-[542.348px] items-center justify-center left-[-131px] mix-blend-overlay top-[41.43px] w-[368.845px]">
          <div className="flex-none rotate-[19.59deg]">
            <div className="h-[499.615px] relative w-[213.708px]">
              <div className="absolute inset-[-36.62%_-85.62%]">
                <img alt="" className="block max-w-none size-full" src={imgEllipse170} />
              </div>
            </div>
          </div>
        </div>
        <div className="absolute flex h-[380.619px] items-center justify-center left-[-101px] top-[378px] w-[308.817px]">
          <div className="flex-none rotate-[22.9deg]">
            <div className="h-[330.556px] relative w-[195.608px]">
              <div className="absolute inset-[-27.1%_-45.8%]">
                <img alt="" className="block max-w-none size-full" src={imgEllipse167} />
              </div>
            </div>
          </div>
        </div>
        <div className="absolute flex h-[542.348px] items-center justify-center left-[385px] mix-blend-overlay top-[108px] w-[368.845px]">
          <div className="flex-none rotate-[19.59deg]">
            <div className="h-[499.615px] relative w-[213.708px]">
              <div className="absolute inset-[-36.62%_-85.62%]">
                <img alt="" className="block max-w-none size-full" src={imgEllipse169} />
              </div>
            </div>
          </div>
        </div>
        <div className="absolute flex h-[440.03px] items-center justify-center left-[-71px] top-[-322px] w-[233.639px]">
          <div className="flex-none rotate-[22.9deg]">
            <div className="h-[451.017px] relative w-[63.114px]">
              <div className="absolute inset-[-5.37%_-38.4%]">
                <img alt="" className="block max-w-none size-full" src={imgEllipse171} />
              </div>
            </div>
          </div>
        </div>
        <div className="absolute flex h-[432.695px] items-center justify-center left-[624px] top-[-337px] w-[230.541px]">
          <div className="flex-none rotate-[22.9deg]">
            <div className="h-[443.055px] relative w-[63.114px]">
              <div className="absolute inset-[-5.47%_-38.4%]">
                <img alt="" className="block max-w-none size-full" src={imgEllipse172} />
              </div>
            </div>
          </div>
        </div>
        <div className="absolute flex h-[440.03px] items-center justify-center left-[565px] top-[151px] w-[233.639px]">
          <div className="flex-none rotate-[22.9deg]">
            <div className="h-[451.017px] relative w-[63.114px]">
              <div className="absolute inset-[-17%_-121.49%]">
                <img alt="" className="block max-w-none size-full" src={imgEllipse173} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer line */}
      <div className="-translate-x-1/2 absolute h-0 left-[calc(50%-42px)] top-[383px] w-[598px]">
        <div className="absolute inset-[-1px_0_0_0]">
          <img alt="" className="block max-w-none size-full" src={imgLine1} />
        </div>
      </div>

      {/* Inner panel */}
      <div className="absolute h-[412px] left-[10px] opacity-80 overflow-clip rounded-[10px] top-[10px] w-[730px]">
        <div
          aria-hidden
          className="absolute bg-[#000201] inset-0 pointer-events-none rounded-[10px]"
        />
        <div
          className="absolute h-[355px] left-[335px] mix-blend-plus-lighter top-[-116px] w-[507px]"
          data-name="Vector"
        >
          <img alt="" className="absolute block max-w-none size-full" src={imgGlow} />
        </div>
        <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_-1px_0px_0px_white,inset_0px_1px_0px_0px_rgba(0,0,0,0.45)]" />
      </div>

      {/* Footer URL removed — pending final domain decision. */}

      {/* Green tint overlay */}
      <div
        aria-hidden
        className="absolute bg-[#5dffca] h-[1050px] left-0 mix-blend-overlay top-0 w-[750px]"
      />

      {/* Altura mark (bottom-right) */}
      <div className="absolute h-[52px] left-[651px] top-[351px] w-[69px]">
        <img alt="" className="absolute block max-w-none size-full" src={imgMark} />
      </div>

      {/* Altura wordmark (top-left) */}
      <div className="absolute h-[20.388px] left-[34px] top-[34.83px] w-[84px]">
        <img alt="Altura" className="absolute block max-w-none size-full" src={imgWordmark} />
      </div>

      {/* Platinum chrome badge */}
      <div
        className="-translate-x-1/2 absolute border-[#006745] border-[0.313px] border-solid content-stretch flex gap-[2.5px] items-center justify-center left-[calc(50%-211.78px)] overflow-clip px-[5px] py-[3.75px] rounded-bl-[2.5px] rounded-br-[20px] rounded-tl-[30px] rounded-tr-[2.5px] shadow-[0px_12.5px_14.813px_0px_rgba(0,0,0,0.1),0px_7.5px_10.5px_0px_rgba(0,0,0,0.1),0px_2.5px_3.375px_0px_rgba(0,0,0,0.2),0px_1.25px_2.5px_0px_rgba(0,0,0,0.1)] top-[39px] w-[68.438px]"
        data-name="Rarity tag"
      >
        <div
          aria-hidden
          className="absolute backdrop-blur-[2.5px] inset-0 pointer-events-none rounded-bl-[2.5px] rounded-br-[20px] rounded-tl-[30px] rounded-tr-[2.5px]"
          style={{
            backgroundImage:
              "linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.8) 100%), linear-gradient(90deg, rgba(255, 255, 255, 0.51) 0%, rgba(255, 255, 255, 0.51) 100%), linear-gradient(267.92deg, rgb(0, 0, 0) 0.14%, rgb(188, 188, 188) 24.22%, rgb(0, 0, 0) 44.84%, rgb(255, 255, 255) 67.83%, rgb(0, 0, 0) 95.31%)",
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
          <p className="leading-[7.5px]">Platinum</p>
        </div>
        <div className="-translate-y-1/2 absolute flex h-[14.375px] items-center justify-center left-[-3.75px] mix-blend-overlay right-[-3.44px] top-[calc(50%-0.25px)]">
          <div className="-scale-y-100 flex-none h-[14.375px] rotate-180 w-[75px]">
            <div className="bg-[#5dffca] size-full" />
          </div>
        </div>
        <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_1.25px_1.25px_0px_rgba(0,0,0,0.25)]" />
      </div>

      {/* Title: archetype name. Note: Figma uses leading 0.91 but in CSS that
          clips ascenders (cap height of B, etc.) when combined with
          `background-clip: text`. Use leading 1.1 + a little top padding so
          the gradient text renders fully. */}
      <p
        className="absolute bg-clip-text left-[32px] not-italic text-[transparent] tracking-[-1.0255px] whitespace-nowrap overflow-hidden"
        style={{
          fontFamily: "'Funnel Display', sans-serif",
          fontWeight: 500,
          fontSize: titleSize,
          lineHeight: 1.1,
          top: 65,
          right: 150,
          paddingTop: "0.05em",
          textOverflow: "ellipsis",
          backgroundImage:
            "linear-gradient(-84.36deg, rgb(255, 255, 255) 1.8%, rgb(175, 184, 181) 64.65%, rgb(23, 33, 30) 117.62%)",
        }}
      >
        {data.archetype}
      </p>

      {/* Description */}
      <p
        className="absolute bg-clip-text font-medium leading-[21px] left-[32px] opacity-60 text-[12px] text-[transparent] top-[131px] uppercase w-[263px]"
        style={{
          fontFamily: "'Geist Mono', monospace",
          backgroundImage:
            "linear-gradient(165.16deg, rgb(95, 107, 99) 10.448%, rgb(186, 209, 193) 53.323%, rgb(255, 255, 255) 73.433%)",
        }}
      >
        {data.description}
      </p>

      {/* PNL block (left): big value + label */}
      <div className="absolute content-stretch flex flex-col gap-[16.981px] items-start left-[32px] text-[transparent] top-[262.34px]">
        <p
          className="bg-clip-text leading-[1.05] not-italic relative shrink-0 text-[71.544px] text-center tracking-[-1.4309px] whitespace-nowrap"
          style={{
            fontFamily: "'Funnel Display', sans-serif",
            fontWeight: 400,
            backgroundImage:
              "linear-gradient(86.86deg, rgb(85, 130, 100) 10.518%, rgb(56, 92, 68) 158.48%)",
          }}
        >
          {data.pnlValue}
        </p>
        <p
          className="bg-clip-text font-medium leading-[21.19px] min-w-full relative shrink-0 text-[16.981px] uppercase w-[min-content]"
          style={{
            fontFamily: "'Geist Mono', monospace",
            backgroundImage:
              "linear-gradient(171.86deg, rgb(95, 107, 99) 10.448%, rgb(186, 209, 193) 53.323%, rgb(255, 255, 255) 73.433%)",
          }}
        >
          PNL
        </p>
      </div>

      {/* Percent (next to PNL value) */}
      <p
        className="-translate-x-1/2 absolute bg-clip-text leading-[1.05] left-[351.01px] not-italic text-[27.792px] text-[transparent] text-center top-[294.13px] tracking-[-0.5558px] whitespace-nowrap"
        style={{
          fontFamily: "'Funnel Display', sans-serif",
          fontWeight: 400,
          backgroundImage:
            "linear-gradient(3.77deg, rgb(51, 141, 111) 3.7464%, rgb(0, 52, 35) 71.164%)",
        }}
      >
        {data.pnlPercent}
      </p>

      {/* APY block (right) */}
      <div className="absolute content-stretch flex flex-col gap-[16.981px] items-start left-[464.45px] text-[transparent] top-[261px]">
        <p
          className="bg-clip-text leading-[1.05] not-italic relative shrink-0 text-[71.544px] text-center tracking-[-1.4309px] whitespace-nowrap"
          style={{
            fontFamily: "'Funnel Display', sans-serif",
            fontWeight: 400,
            backgroundImage:
              "linear-gradient(87.59deg, rgb(85, 130, 100) 10.518%, rgb(56, 92, 68) 158.48%)",
          }}
        >
          {data.apyValue}
        </p>
        <p
          className="bg-clip-text font-medium leading-[21.19px] min-w-full relative shrink-0 text-[16.981px] uppercase w-[min-content]"
          style={{
            fontFamily: "'Geist Mono', monospace",
            backgroundImage:
              "linear-gradient(169.45deg, rgb(95, 107, 99) 10.448%, rgb(186, 209, 193) 53.323%, rgb(255, 255, 255) 73.433%)",
          }}
        >
          APY
        </p>
      </div>

      {/* User profile chip (avatar + @handle), top-right next to QR */}
      {(data.username || data.avatarUrl) && (
        <div
          className="absolute flex items-center gap-[8px]"
          style={{ left: 480, top: 47, height: 50 }}
        >
          {data.avatarUrl && (
            <img
              src={data.avatarUrl}
              alt=""
              referrerPolicy="no-referrer"
              crossOrigin="anonymous"
              className="rounded-full"
              style={{
                width: 36,
                height: 36,
                objectFit: "cover",
                border: "1.5px solid rgba(94,255,202,0.45)",
                boxShadow: "0 0 12px rgba(94,255,202,0.25)",
              }}
            />
          )}
          {data.username && (
            <p
              className="m-0"
              style={{
                fontFamily: "'Geist Mono', monospace",
                fontWeight: 500,
                fontSize: 13,
                lineHeight: 1.1,
                letterSpacing: "-0.2px",
                color: "rgba(220,235,226,0.95)",
                textShadow: "0 1px 2px rgba(0,0,0,0.4)",
              }}
            >
              @{data.username}
            </p>
          )}
        </div>
      )}

      {/* QR code (top-right) */}
      <div className="absolute border border-black border-solid content-stretch flex items-center justify-center left-[654px] p-[4px] rounded-[13px] top-[35px]">
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none rounded-[13px]"
          style={{
            backgroundImage:
              "linear-gradient(90deg, rgba(0, 0, 0, 0.27) 0%, rgba(0, 0, 0, 0.27) 100%), linear-gradient(180deg, rgb(3, 18, 5) 0%, rgb(62, 117, 83) 100%)",
          }}
        />
        <div className="relative shrink-0 size-[66.841px] z-10">
          <img alt="" className="absolute block max-w-none size-full" src={imgQrCode} />
        </div>
        <div className="absolute inset-[-0.5px] pointer-events-none rounded-[inherit] shadow-[inset_0_-1px_0_0_rgba(255,255,255,0.5)]" />
      </div>

      {/* Chrome bezel (top-left inset) */}
      <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_2px_2px_0px_0px_white]" />
    </div>
  );
});

export default FigmaPlatinumCard;
