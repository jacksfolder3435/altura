/**
 * Scales a fixed-size 750x432 design card to fit a responsive container
 * while preserving the aspect ratio and pixel-perfect inner positions.
 */
import { useEffect, useRef, useState, type ReactNode } from "react";

interface Props {
  designWidth?: number;
  designHeight?: number;
  maxWidth?: number;
  children: ReactNode;
}

export default function CardScaler({
  designWidth = 750,
  designHeight = 432,
  maxWidth = 750,
  children,
}: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    function update() {
      if (!wrapRef.current) return;
      const containerWidth = Math.min(
        wrapRef.current.clientWidth,
        maxWidth,
      );
      setScale(containerWidth / designWidth);
    }
    update();
    const ro = new ResizeObserver(update);
    if (wrapRef.current) ro.observe(wrapRef.current);
    return () => ro.disconnect();
  }, [designWidth, maxWidth]);

  return (
    <div
      ref={wrapRef}
      style={{
        width: "100%",
        maxWidth,
        height: designHeight * scale,
        position: "relative",
      }}
    >
      <div
        style={{
          width: designWidth,
          height: designHeight,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          position: "absolute",
          left: 0,
          top: 0,
        }}
      >
        {children}
      </div>
    </div>
  );
}
