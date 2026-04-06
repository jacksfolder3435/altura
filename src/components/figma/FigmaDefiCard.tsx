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
const imgVector = `${A}/standard-glow-1.svg`;
const imgVector1 = `${A}/standard-glow-2.svg`;
const imgLine1 = `${A}/standard-line.svg`;
const imgVector2 = `${A}/standard-mark.svg`;
const imgVector3 = `${A}/standard-wordmark.svg`;
const imgRectangle34625296 = `${A}/standard-rect.svg`;
const imgQrCode = `${A}/standard-qr.svg`;
const imgEllipse43718 = `${A}/standard-ellipse-43718.svg`;
const imgEllipse43719 = `${A}/standard-ellipse-43719.svg`;
const imgEllipse43720 = `${A}/standard-ellipse-43720.svg`;
const imgEllipse43721 = `${A}/standard-ellipse-43721.svg`;
const imgEllipse43722 = `${A}/standard-ellipse-43722.svg`;
const imgEllipse43723 = `${A}/standard-ellipse-43723.svg`;
const imgEllipse43724 = `${A}/standard-ellipse-43724.svg`;
const imgEllipse43725 = `${A}/standard-ellipse-43725.svg`;
const imgEllipse43726 = `${A}/standard-ellipse-43726.svg`;

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

      {/* Inner panel */}
      <div className="absolute bg-[#000201] h-[432px] left-0 opacity-80 overflow-clip rounded-[10px] top-0 w-[750px]">
        <div className="absolute h-[355px] left-[355px] mix-blend-overlay top-[-31px] w-[507px]">
          <img alt="" className="absolute block max-w-none size-full" src={imgVector} />
        </div>
        <div className="absolute h-[355px] left-[355px] mix-blend-plus-lighter top-[-31px] w-[507px]">
          <img alt="" className="absolute block max-w-none size-full" src={imgVector1} />
        </div>
      </div>

      {/* Footer line */}
      <div className="-translate-x-1/2 absolute h-0 left-[calc(50%-42px)] top-[383px] w-[598px]">
        <div className="absolute inset-[-1px_0_0_0]">
          <img alt="" className="block max-w-none size-full" src={imgLine1} />
        </div>
      </div>

      {/* Footer URL */}
      <p
        className="-translate-x-1/2 absolute bg-clip-text font-medium leading-[8px] left-[calc(50%-288px)] opacity-20 text-[8px] text-[transparent] text-center top-[395px] uppercase whitespace-nowrap"
        style={{
          fontFamily: "'Geist Mono', monospace",
          backgroundImage:
            "linear-gradient(172.86deg, rgb(95, 107, 99) 10.448%, rgb(186, 209, 193) 53.323%, rgb(255, 255, 255) 73.433%)",
        }}
      >
        {data.username
          ? `alturanft.com/persona/${data.username}`
          : "alturanft.com/persona"}
      </p>

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

      {/* Content stack: badge → archetype → description → QR */}
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
            className="bg-clip-text flex flex-col justify-center leading-[0] not-italic relative shrink-0 text-[10px] text-[transparent] text-right tracking-[-0.6px] uppercase whitespace-nowrap"
            style={{
              fontFamily: "'Funnel Display', sans-serif",
              fontWeight: 800,
              backgroundImage:
                "linear-gradient(237.51deg, rgba(0, 0, 0, 0) 2.7%, rgba(0, 0, 0, 0.66) 17.52%, rgba(0, 0, 0, 0) 28.52%, rgba(0, 0, 0, 0.66) 37.14%, rgba(0, 0, 0, 0) 55.72%, rgba(0, 0, 0, 0.66) 68.99%, rgba(0, 0, 0, 0) 92.64%, rgba(0, 0, 0, 0.578) 109.74%), linear-gradient(90deg, rgba(0, 0, 0, 0.63) 0%, rgba(0, 0, 0, 0.63) 100%)",
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

        {/* Archetype name — two-layer text (shadow + fill) */}
        <div
          className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] not-italic place-items-start relative shrink-0 text-[transparent] text-center whitespace-nowrap"
          style={{
            fontFamily: "'Funnel Display', sans-serif",
            fontWeight: 400,
            fontSize: titleSize,
            letterSpacing: `${(-1.3259 / 66.297) * titleSize}px`,
          }}
        >
          <p
            className="bg-clip-text col-1 leading-[0.9] ml-0 mt-0 opacity-50 relative row-1"
            style={{
              backgroundImage:
                "linear-gradient(215.03deg, rgba(0, 0, 0, 0) 177.59%, rgba(0, 0, 0, 0.66) 125.73%, rgba(0, 0, 0, 0) 97.51%, rgba(0, 0, 0, 0.66) 75.41%, rgba(0, 0, 0, 0) 27.73%, rgba(0, 0, 0, 0.66) 6.3%, rgba(0, 0, 0, 0) 66.95%, rgba(0, 0, 0, 0.578) 110.82%), linear-gradient(90deg, rgba(0, 0, 0, 0.24) 0%, rgba(0, 0, 0, 0.24) 100%)",
            }}
          >
            {data.archetype}
          </p>
          <p
            className="bg-clip-text col-1 leading-[0.9] ml-0 mt-0 relative row-1"
            style={{
              backgroundImage:
                "linear-gradient(85.28deg, rgb(85, 130, 100) 10.518%, rgb(56, 92, 68) 158.48%)",
            }}
          >
            {data.archetype}
          </p>
        </div>

        {/* Description */}
        <p
          className="bg-clip-text font-medium leading-[21px] opacity-60 relative shrink-0 text-[12px] text-[transparent] uppercase w-[322px]"
          style={{
            fontFamily: "'Geist Mono', monospace",
            backgroundImage:
              "linear-gradient(167.79deg, rgb(95, 107, 99) 10.448%, rgb(186, 209, 193) 53.323%, rgb(255, 255, 255) 73.433%)",
          }}
        >
          {data.description}
        </p>

        {/* QR */}
        <div className="border border-black border-solid content-stretch flex items-center justify-center p-[4px] relative rounded-[13px] shrink-0">
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none rounded-[13px]"
            style={{
              backgroundImage:
                "linear-gradient(90deg, rgba(0, 0, 0, 0.27) 0%, rgba(0, 0, 0, 0.27) 100%), linear-gradient(180deg, rgb(3, 18, 5) 0%, rgb(62, 117, 83) 100%)",
            }}
          />
          <div className="relative shrink-0 size-[66.841px]">
            <img alt="" className="absolute block max-w-none size-full" src={imgQrCode} />
          </div>
          <div className="absolute inset-[-0.5px] pointer-events-none rounded-[inherit] shadow-[inset_0px_-0.5px_0px_0px_white,inset_0px_-25px_68px_0px_white]" />
        </div>
      </div>

      {/* Background ellipses (top-right cluster) */}
      <div className="absolute contents left-[246px] top-[-151px]">
        <div className="absolute flex h-[1003.671px] items-center justify-center left-[246px] mix-blend-overlay top-[-151px] w-[920.667px]">
          <div className="flex-none rotate-[24.45deg] scale-y-[0.98] skew-x-[-12.51deg]">
            <div className="h-[1113.031px] relative w-[276.203px]">
              <div className="absolute inset-[-7.37%_-29.69%]">
                <img alt="" className="block max-w-none size-full" src={imgEllipse43718} />
              </div>
            </div>
          </div>
        </div>
        <div className="absolute flex h-[556.564px] items-center justify-center left-[445.45px] mix-blend-overlay top-[72.55px] w-[521.774px]">
          <div className="flex-none rotate-[24.45deg] scale-y-[0.98] skew-x-[-12.51deg]">
            <div className="h-[607.49px] relative w-[171.925px]">
              <div className="absolute inset-[-13.5%_-47.7%]">
                <img alt="" className="block max-w-none size-full" src={imgEllipse43719} />
              </div>
            </div>
          </div>
        </div>
        <div className="absolute flex h-[372.671px] items-center justify-center left-[541.02px] mix-blend-overlay top-[164.5px] w-[330.629px]">
          <div className="flex-none rotate-[24.45deg] scale-y-[0.98] skew-x-[-12.51deg]">
            <div className="h-[422.981px] relative w-[83.82px]">
              <div className="absolute inset-[-12.53%_-63.23%]">
                <img alt="" className="block max-w-none size-full" src={imgEllipse43720} />
              </div>
            </div>
          </div>
        </div>
        <div className="absolute flex h-[195.853px] items-center justify-center left-[619.45px] mix-blend-overlay top-[252.91px] w-[173.758px]">
          <div className="flex-none rotate-[24.45deg] scale-y-[0.98] skew-x-[-12.51deg]">
            <div className="h-[222.293px] relative w-[44.05px]">
              <div className="absolute inset-[-21.32%_-107.6%]">
                <img alt="" className="block max-w-none size-full" src={imgEllipse43721} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Background ellipses (large faint left cluster) */}
      <div className="absolute contents left-[-429px] top-[-799px]">
        <div className="absolute flex h-[1708.637px] items-center justify-center left-[-429px] mix-blend-overlay top-[-799px] w-[1567.333px]">
          <div className="flex-none rotate-[24.45deg] scale-y-[0.98] skew-x-[-12.51deg]">
            <div className="h-[1894.812px] relative w-[470.204px]">
              <div className="absolute inset-[-7.37%_-29.69%]">
                <img alt="" className="block max-w-none size-full" src={imgEllipse43722} />
              </div>
            </div>
          </div>
        </div>
        <div className="absolute flex h-[947.488px] items-center justify-center left-[87px] mix-blend-overlay top-[-418.42px] w-[888.262px]">
          <div className="flex-none rotate-[24.45deg] scale-y-[0.98] skew-x-[-12.51deg]">
            <div className="h-[1034.184px] relative w-[292.683px]">
              <div className="absolute inset-[-13.5%_-47.7%]">
                <img alt="" className="block max-w-none size-full" src={imgEllipse43723} />
              </div>
            </div>
          </div>
        </div>
        <div className="absolute flex h-[634.431px] items-center justify-center left-[218px] mix-blend-overlay top-[-261.9px] w-[562.859px]">
          <div className="flex-none rotate-[24.45deg] scale-y-[0.98] skew-x-[-12.51deg]">
            <div className="h-[720.078px] relative w-[142.694px]">
              <div className="absolute inset-[-12.53%_-63.23%]">
                <img alt="" className="block max-w-none size-full" src={imgEllipse43724} />
              </div>
            </div>
          </div>
        </div>
        <div className="absolute flex h-[333.418px] items-center justify-center left-[206.76px] mix-blend-overlay top-[-111.39px] w-[295.804px]">
          <div className="flex-none rotate-[24.45deg] scale-y-[0.98] skew-x-[-12.51deg]">
            <div className="h-[378.429px] relative w-[74.991px]">
              <div className="absolute inset-[-21.32%_-107.6%]">
                <img alt="" className="block max-w-none size-full" src={imgEllipse43725} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Outer rotated ellipses */}
      <div className="absolute flex h-[564.11px] items-center justify-center left-[305.87px] mix-blend-overlay top-[-6.05px] w-[423.261px]">
        <div className="flex-none rotate-[30deg]">
          <div className="h-[553.806px] relative w-[169px]">
            <div className="absolute inset-[-20.95%_-68.64%]">
              <img alt="" className="block max-w-none size-full" src={imgEllipse43726} />
            </div>
          </div>
        </div>
      </div>
      <div className="absolute flex h-[564.11px] items-center justify-center left-[-190px] mix-blend-overlay top-[-282px] w-[423.261px]">
        <div className="flex-none rotate-[30deg]">
          <div className="h-[553.806px] relative w-[169px]">
            <div className="absolute inset-[-20.95%_-68.64%]">
              <img alt="" className="block max-w-none size-full" src={imgEllipse43726} />
            </div>
          </div>
        </div>
      </div>

      {/* Subtle outer chrome bezel */}
      <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0.5px_0.5px_0px_0px_rgba(255,255,255,0.3)]" />
    </div>
  );
});

export default FigmaDefiCard;
