import { useRef, useEffect, useCallback } from "react";

interface AsciiPixelOptions {
  preserveColors?: boolean;
  bgDotColor?: [number, number, number];
  bgDotOpacity?: number;
  hoverColor?: [number, number, number];
  cellSize?: number;
}

interface CellData {
  subject: boolean;
  r: number;
  g: number;
  b: number;
  a: number;
  lum: number;
  char: string;
}

const ASCII_RAMP = "@#S%?*+;:,. ";

function getChar(lum: number): string {
  const idx = Math.floor(lum * (ASCII_RAMP.length - 1));
  return ASCII_RAMP[Math.min(idx, ASCII_RAMP.length - 1)];
}

export function useAsciiPixelEffect(imageSrc: string, options: AsciiPixelOptions = {}) {
  const {
    preserveColors = true,
    bgDotColor = [15, 20, 15],
    bgDotOpacity = 0.15,
    hoverColor = [100, 255, 180],
    cellSize: userCellSize,
  } = options;

  const containerRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef<{
    cells: CellData[][];
    cols: number;
    rows: number;
    cellW: number;
    cellH: number;
    mouseX: number;
    mouseY: number;
    mouseCol: number;
    mouseRow: number;
    frame: number;
    animId: number;
    imgW: number;
    imgH: number;
  }>({
    cells: [],
    cols: 0,
    rows: 0,
    cellW: 0,
    cellH: 0,
    mouseX: -1,
    mouseY: -1,
    mouseCol: -1,
    mouseRow: -1,
    frame: 0,
    animId: 0,
    imgW: 0,
    imgH: 0,
  });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const canvases = container.querySelectorAll("canvas");
    if (canvases.length < 3) return;

    const bgCanvas = canvases[0] as HTMLCanvasElement;
    const mainCanvas = canvases[1] as HTMLCanvasElement;
    const interactCanvas = canvases[2] as HTMLCanvasElement;

    const bgCtx = bgCanvas.getContext("2d")!;
    const mainCtx = mainCanvas.getContext("2d")!;
    const interactCtx = interactCanvas.getContext("2d")!;

    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = () => {
      const s = stateRef.current;
      s.imgW = img.naturalWidth;
      s.imgH = img.naturalHeight;

      // Determine cell size based on image and container
      const containerW = container.clientWidth || window.innerWidth;
      const containerH = container.clientHeight || window.innerHeight;

      // Scale image to fit container while maintaining aspect ratio
      const scale = Math.min(containerW / img.naturalWidth, containerH / img.naturalHeight, 1);
      const drawW = Math.round(img.naturalWidth * scale);
      const drawH = Math.round(img.naturalHeight * scale);

      s.cellW = userCellSize || Math.max(6, Math.round(drawW / 120));
      s.cellH = Math.round(s.cellW * 1.6);
      s.cols = Math.ceil(drawW / s.cellW);
      s.rows = Math.ceil(drawH / s.cellH);

      const totalW = s.cols * s.cellW;
      const totalH = s.rows * s.cellH;

      // Resize canvases
      for (const c of [bgCanvas, mainCanvas, interactCanvas]) {
        c.width = totalW;
        c.height = totalH;
        c.style.width = totalW + "px";
        c.style.height = totalH + "px";
      }
      container.style.width = totalW + "px";
      container.style.height = totalH + "px";

      // Sample image pixels
      const sampleCanvas = document.createElement("canvas");
      sampleCanvas.width = img.naturalWidth;
      sampleCanvas.height = img.naturalHeight;
      const sampleCtx = sampleCanvas.getContext("2d")!;
      sampleCtx.drawImage(img, 0, 0);
      const imgData = sampleCtx.getImageData(0, 0, img.naturalWidth, img.naturalHeight);

      // Build cell data
      s.cells = [];
      for (let row = 0; row < s.rows; row++) {
        s.cells.push([]);
        for (let col = 0; col < s.cols; col++) {
          // Map cell to image pixel coordinates
          const imgX = Math.floor((col / s.cols) * img.naturalWidth);
          const imgY = Math.floor((row / s.rows) * img.naturalHeight);
          const idx = (imgY * img.naturalWidth + imgX) * 4;

          const r = imgData.data[idx];
          const g = imgData.data[idx + 1];
          const b = imgData.data[idx + 2];
          const a = imgData.data[idx + 3];

          const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
          const isSubject = a > 30 && (r + g + b) < 740; // not fully transparent or white

          s.cells[row].push({
            subject: isSubject,
            r,
            g,
            b,
            a,
            lum,
            char: getChar(1 - lum), // darker pixels get denser characters
          });
        }
      }

      // Draw static background
      bgCtx.fillStyle = "#000";
      bgCtx.fillRect(0, 0, totalW, totalH);

      // Draw background dots for non-subject cells
      bgCtx.font = `${s.cellH - 1}px monospace`;
      bgCtx.textBaseline = "top";
      for (let row = 0; row < s.rows; row++) {
        for (let col = 0; col < s.cols; col++) {
          if (!s.cells[row][col].subject) {
            bgCtx.globalAlpha = bgDotOpacity;
            bgCtx.fillStyle = `rgb(${bgDotColor[0]},${bgDotColor[1]},${bgDotColor[2]})`;
            bgCtx.fillText(".", col * s.cellW, row * s.cellH);
          }
        }
      }
      bgCtx.globalAlpha = 1;

      // Start animation
      animate();
    };

    function animate() {
      const s = stateRef.current;
      const { cols, rows, cellW, cellH, cells, mouseCol, mouseRow } = s;

      // Main ASCII layer
      mainCtx.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
      mainCtx.font = `bold ${cellH - 1}px monospace`;
      mainCtx.textBaseline = "top";

      const shineDiag = ((s.frame % 300) / 300) * (cols + rows);

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const cell = cells[row]?.[col];
          if (!cell || !cell.subject) continue;

          // r/g/b are reassigned by the shine sweep below, so they must remain `let`

          let { r, g, b } = cell;
          const { lum, char } = cell;
          let alpha = (cell.a / 255) * Math.max(0.3, 1 - lum * 0.5);

          // Subtle breathing animation
          const breathe = Math.sin(s.frame * 0.02 + col * 0.15 + row * 0.1) * 0.04;
          alpha = Math.min(1, Math.max(0.1, alpha + breathe));

          // Shine sweep
          const sd = Math.abs((col + row) - shineDiag);
          if (sd < 5) {
            const si = Math.max(0, 1 - sd / 5) * 0.3;
            if (preserveColors) {
              r = Math.min(255, Math.round(r + (255 - r) * si));
              g = Math.min(255, Math.round(g + (255 - g) * si));
              b = Math.min(255, Math.round(b + (255 - b) * si));
            }
            alpha = Math.min(1, alpha + si * 0.2);
          }

          // Random flicker
          if (Math.random() < 0.001) {
            alpha *= 0.3 + Math.random() * 0.7;
          }

          if (preserveColors) {
            mainCtx.fillStyle = `rgb(${r},${g},${b})`;
          } else {
            mainCtx.fillStyle = `rgb(${hoverColor[0]},${hoverColor[1]},${hoverColor[2]})`;
          }
          mainCtx.globalAlpha = alpha;
          mainCtx.fillText(char, col * cellW, row * cellH);
        }
      }
      mainCtx.globalAlpha = 1;

      // Hover interaction layer
      interactCtx.clearRect(0, 0, interactCanvas.width, interactCanvas.height);
      if (mouseCol >= 0 && mouseRow >= 0) {
        interactCtx.font = `bold ${cellH - 1}px monospace`;
        interactCtx.textBaseline = "top";

        const hoverRadius = 10;
        const startRow = Math.max(0, mouseRow - hoverRadius);
        const endRow = Math.min(rows, mouseRow + hoverRadius);
        const startCol = Math.max(0, mouseCol - hoverRadius);
        const endCol = Math.min(cols, mouseCol + hoverRadius);

        for (let row = startRow; row < endRow; row++) {
          for (let col = startCol; col < endCol; col++) {
            const cell = cells[row]?.[col];
            if (!cell) continue;

            const dx = (col - mouseCol) * cellW;
            const dy = (row - mouseRow) * cellH;
            const dist = Math.sqrt(dx * dx + dy * dy) / cellW;

            if (dist < hoverRadius) {
              const intensity = Math.pow(1 - dist / hoverRadius, 2);

              if (cell.subject) {
                // Highlight subject cells with hover color
                interactCtx.globalAlpha = intensity * 0.6;
                interactCtx.fillStyle = `rgb(${hoverColor[0]},${hoverColor[1]},${hoverColor[2]})`;
                const ch = dist < 2 ? ASCII_RAMP[Math.floor(Math.random() * ASCII_RAMP.length)] : cell.char;
                interactCtx.fillText(ch, col * cellW, row * cellH);
              } else {
                // Light up background near cursor
                interactCtx.globalAlpha = intensity * 0.25;
                interactCtx.fillStyle = `rgb(${hoverColor[0]},${hoverColor[1]},${hoverColor[2]})`;
                interactCtx.fillText(".", col * cellW, row * cellH);
              }
            }
          }
        }
        interactCtx.globalAlpha = 1;
      }

      s.frame++;
      s.animId = requestAnimationFrame(animate);
    }

    img.src = imageSrc;

    return () => {
      cancelAnimationFrame(stateRef.current.animId);
    };
  }, [imageSrc, preserveColors, bgDotColor, bgDotOpacity, hoverColor, userCellSize]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const s = stateRef.current;
    s.mouseX = e.clientX - rect.left;
    s.mouseY = e.clientY - rect.top;
    s.mouseCol = Math.floor(s.mouseX / s.cellW);
    s.mouseRow = Math.floor(s.mouseY / s.cellH);
  }, []);

  const handleMouseLeave = useCallback(() => {
    const s = stateRef.current;
    s.mouseX = -1;
    s.mouseY = -1;
    s.mouseCol = -1;
    s.mouseRow = -1;
  }, []);

  const exportPng = useCallback((filename: string = "ascii-export") => {
    const container = containerRef.current;
    if (!container) return;
    const canvases = container.querySelectorAll("canvas");
    if (canvases.length < 2) return;

    const s = stateRef.current;
    const exportCanvas = document.createElement("canvas");
    exportCanvas.width = s.cols * s.cellW;
    exportCanvas.height = s.rows * s.cellH;
    const ctx = exportCanvas.getContext("2d")!;

    // Composite all layers
    for (const c of canvases) {
      ctx.drawImage(c, 0, 0);
    }

    exportCanvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${filename}.png`;
      a.click();
      URL.revokeObjectURL(url);
    }, "image/png");
  }, []);

  const saveToServer = useCallback(async (name: string) => {
    // Placeholder — would POST the canvas data to a server endpoint
    console.log(`Save to server: ${name}`);
  }, []);

  return { containerRef, handleMouseMove, handleMouseLeave, exportPng, saveToServer };
}
