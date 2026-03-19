import { useEffect, useRef } from "react";

export default function BluOrbBackground() {
  const bgRef = useRef<HTMLCanvasElement>(null);
  const gridRef = useRef<HTMLCanvasElement>(null);
  const asciiRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const ASCII_RAMP = '@#S08Xox+=;:-,. ';
    const BG_DOT: [number, number, number] = [160, 190, 220];

    // Mutable layout state shared between animate loop and resize handler
    let CELL_W: number, CELL_H: number, COLS: number, ROWS: number;
    let RADIUS: number, CX: number, CY: number, canvasW: number, canvasH: number;
    let cellData: Array<Array<{ subject: boolean; r?: number; g?: number; b?: number; lum?: number }>> = [];
    let frame = 0;
    const flicker: Record<string, number> = {};
    let mouseCol = -1, mouseRow = -1;
    let animId: number;

    function computeLayout() {
      canvasW = window.innerWidth;
      canvasH = window.innerHeight;

      const baseSize = Math.min(canvasW, canvasH);
      CELL_W = Math.max(8, Math.round(baseSize / 90));
      CELL_H = Math.round(CELL_W * 14 / 11);

      COLS = Math.ceil(canvasW / CELL_W);
      ROWS = Math.ceil(canvasH / CELL_H);
      CX = COLS / 2;
      CY = ROWS / 2;
      // Radius in pixels so the orb is a true circle regardless of cell aspect ratio
      RADIUS = Math.round(Math.min(canvasW, canvasH) * 0.42);

      for (const ref of [bgRef, gridRef, asciiRef]) {
        const c = ref.current;
        if (!c) continue;
        c.width = canvasW;
        c.height = canvasH;
        c.style.width = canvasW + 'px';
        c.style.height = canvasH + 'px';
      }
    }

    function buildOrbData() {
      cellData = [];
      for (let row = 0; row < ROWS; row++) {
        cellData.push([]);
        for (let col = 0; col < COLS; col++) {
          // Work in pixel space so the orb is a true circle
          const pxDx = (col - CX) * CELL_W, pxDy = (row - CY) * CELL_H;
          const dist = Math.sqrt(pxDx * pxDx + pxDy * pxDy);
          if (dist > RADIUS) { cellData[row].push({ subject: false }); continue; }

          const nx = pxDx / RADIUS, ny = pxDy / RADIUS;
          const nz = Math.sqrt(Math.max(0, 1 - nx * nx - ny * ny));
          const lx = -0.5, ly = -0.6, lz = 0.7;
          const len = Math.sqrt(lx * lx + ly * ly + lz * lz);
          const dot = Math.max(0, (nx * lx + ny * ly + nz * lz) / len);

          const baseR = 58, baseG = 122, baseB = 184;
          const light = 0.2 + dot * 0.65;
          const spec = Math.pow(Math.max(0, dot), 20) * 0.5;
          const edgeFactor = Math.pow(nz, 0.4);

          let r = Math.min(255, Math.round((baseR * light + 220 * spec) * edgeFactor + baseR * 0.06));
          let g = Math.min(255, Math.round((baseG * light + 235 * spec) * edgeFactor + baseG * 0.06));
          let b = Math.min(255, Math.round((baseB * light + 255 * spec) * edgeFactor + baseB * 0.06));

          const edgeDark = Math.pow(1 - nz, 2.5) * 0.6;
          r = Math.round(r * (1 - edgeDark) + 20 * edgeDark);
          g = Math.round(g * (1 - edgeDark) + 50 * edgeDark);
          b = Math.round(b * (1 - edgeDark) + 110 * edgeDark);

          const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
          cellData[row].push({ subject: true, r, g, b, lum });
        }
      }
    }

    function drawBg() {
      const ctx = bgRef.current?.getContext('2d');
      if (!ctx) return;
      ctx.fillStyle = '#f3f8ff';
      ctx.fillRect(0, 0, canvasW, canvasH);
    }

    function drawGrid() {
      const ctx = gridRef.current?.getContext('2d');
      if (!ctx) return;
      ctx.clearRect(0, 0, canvasW, canvasH);
      ctx.strokeStyle = 'rgba(58,122,184,0.06)';
      ctx.lineWidth = 0.5;
      const STEP = CELL_W * 2;
      for (let x = 0; x < canvasW; x += STEP) {
        for (let y = 0; y < canvasH; y += STEP) {
          const col = Math.floor(x / CELL_W), row = Math.floor(y / CELL_H);
          if (row < ROWS && col < COLS && cellData[row]?.[col]?.subject) {
            ctx.strokeRect(x, y, STEP, STEP);
          }
        }
      }
    }

    function normColor(r: number, g: number, b: number): [number, number, number] {
      const mx = Math.max(r, g, b, 1);
      return [Math.round(r / mx * 255), Math.round(g / mx * 255), Math.round(b / mx * 255)];
    }

    function getChar(lum: number) {
      return ASCII_RAMP[Math.max(0, Math.min(ASCII_RAMP.length - 1, Math.floor((1 - lum) * (ASCII_RAMP.length - 1))))];
    }

    function animate() {
      const asciiC = asciiRef.current;
      if (!asciiC) return;
      const ctx = asciiC.getContext('2d')!;
      ctx.clearRect(0, 0, canvasW, canvasH);
      ctx.font = `bold ${CELL_H - 2}px monospace`;
      ctx.textBaseline = 'top';
      const shineDiag = ((frame % 200) / 200) * (COLS + ROWS);

      for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
          const cell = cellData[row]?.[col];
          if (!cell) continue;
          const x = col * CELL_W, y = row * CELL_H;

          if (!cell.subject) {
            ctx.globalAlpha = 0.16;
            ctx.fillStyle = `rgb(${BG_DOT[0]},${BG_DOT[1]},${BG_DOT[2]})`;
            ctx.fillText('.', x, y);
            ctx.globalAlpha = 1;
            continue;
          }

          let lum = cell.lum!, r = cell.r!, g = cell.g!, b = cell.b!, alpha = 1;
          if (lum > 0.55) lum = Math.min(1, lum + Math.sin(frame * 0.035 + col * 0.25 + row * 0.18) * 0.06);
          let ch = getChar(lum);

          if (mouseCol >= 0) {
            const md = Math.sqrt(((col - mouseCol) * CELL_W) ** 2 + ((row - mouseRow) * CELL_H) ** 2) / CELL_W;
            if (md < 8) {
              const rip = Math.max(0, 1 - md / 8);
              r = Math.round(r * (1 - rip * 0.3) + 30 * rip * 0.3);
              g = Math.round(g * (1 - rip * 0.2) + 150 * rip * 0.2);
              b = Math.min(255, Math.round(b + (255 - b) * rip * 0.3));
              if (md < 2) ch = ASCII_RAMP[Math.floor(Math.random() * ASCII_RAMP.length)];
            }
          }

          const sd = Math.abs((col + row) - shineDiag);
          if (sd < 4) {
            const si = Math.max(0, 1 - sd / 4) * 0.4;
            r = Math.min(255, Math.round(r + (255 - r) * si));
            g = Math.min(255, Math.round(g + (255 - g) * si));
            b = Math.min(255, Math.round(b + (255 - b) * si));
            alpha = Math.min(1, 0.85 + si * 0.15);
          }

          const key = `${row},${col}`;
          if (!flicker[key] && Math.random() < 0.002) flicker[key] = Math.floor(Math.random() * 6) + 2;
          if (flicker[key]) { flicker[key]--; alpha *= 0.3 + Math.random() * 0.7; }

          const [nr, ng, nb] = normColor(r, g, b);
          ctx.globalAlpha = alpha;
          if (lum > 0.65) { ctx.shadowBlur = lum * 10; ctx.shadowColor = `rgba(58,122,184,0.8)`; }
          else ctx.shadowBlur = 0;
          ctx.fillStyle = `rgb(${nr},${ng},${nb})`;
          ctx.fillText(ch, x, y);
          ctx.globalAlpha = 1;
          ctx.shadowBlur = 0;
        }
      }
      frame++;
      animId = requestAnimationFrame(animate);
    }

    function init() {
      computeLayout();
      buildOrbData();
      drawBg();
      drawGrid();
      animate();
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseCol = Math.floor(e.clientX / CELL_W);
      mouseRow = Math.floor(e.clientY / CELL_H);
    };
    const handleMouseLeave = () => { mouseCol = -1; mouseRow = -1; };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    let resizeTimer: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        Object.keys(flicker).forEach(k => delete flicker[k]);
        frame = 0;
        cancelAnimationFrame(animId);
        init();
      }, 150);
    };
    window.addEventListener('resize', handleResize);

    init();

    return () => {
      cancelAnimationFrame(animId);
      clearTimeout(resizeTimer);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-0" style={{ background: '#f3f8ff' }}>
      <canvas ref={bgRef} className="absolute inset-0" />
      <canvas ref={gridRef} className="absolute inset-0" />
      <canvas ref={asciiRef} className="absolute inset-0 pointer-events-none" />
    </div>
  );
}
