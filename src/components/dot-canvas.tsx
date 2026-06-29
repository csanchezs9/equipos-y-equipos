"use client";

import { useEffect, useRef, useCallback } from "react";

interface Dot {
  x: number;
  y: number;
  targetOpacity: number;
  currentOpacity: number;
  opacitySpeed: number;
  currentRadius: number;
}

const DOT_SPACING = 28;
const BASE_RADIUS = 1.2;
const BASE_OPACITY_MIN = 0.15;
const BASE_OPACITY_MAX = 0.28;
const INTERACTION_RADIUS = 130;
const INTERACTION_RADIUS_SQ = INTERACTION_RADIUS * INTERACTION_RADIUS;
const OPACITY_BOOST = 0.65;
const RADIUS_BOOST = 2.2;
const GRID_CELL_SIZE = Math.floor(INTERACTION_RADIUS / 1.5);

// Verde brand de Equipos y Equipos
const DOT_R = 18;
const DOT_G = 138;
const DOT_B = 60;

export function DotCanvas({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dotsRef = useRef<Dot[]>([]);
  const gridRef = useRef<Record<string, number[]>>({});
  const sizeRef = useRef({ width: 0, height: 0 });
  const mouseRef = useRef<{ x: number | null; y: number | null }>({ x: null, y: null });
  const rafRef = useRef<number | null>(null);

  const createDots = useCallback(() => {
    const { width, height } = sizeRef.current;
    if (!width || !height) return;

    const dots: Dot[] = [];
    const grid: Record<string, number[]> = {};
    const cols = Math.ceil(width / DOT_SPACING);
    const rows = Math.ceil(height / DOT_SPACING);

    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        const x = i * DOT_SPACING + DOT_SPACING / 2;
        const y = j * DOT_SPACING + DOT_SPACING / 2;
        const cellKey = `${Math.floor(x / GRID_CELL_SIZE)}_${Math.floor(y / GRID_CELL_SIZE)}`;
        if (!grid[cellKey]) grid[cellKey] = [];
        grid[cellKey].push(dots.length);

        const op = Math.random() * (BASE_OPACITY_MAX - BASE_OPACITY_MIN) + BASE_OPACITY_MIN;
        dots.push({
          x, y,
          targetOpacity: op,
          currentOpacity: op,
          opacitySpeed: Math.random() * 0.004 + 0.001,
          currentRadius: BASE_RADIUS,
        });
      }
    }
    dotsRef.current = dots;
    gridRef.current = grid;
  }, []);

  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const w = canvas.parentElement?.clientWidth ?? window.innerWidth;
    const h = canvas.parentElement?.clientHeight ?? window.innerHeight;
    if (canvas.width === w && canvas.height === h) return;
    canvas.width = w;
    canvas.height = h;
    sizeRef.current = { width: w, height: h };
    createDots();
  }, [createDots]);

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    const dots = dotsRef.current;
    const grid = gridRef.current;
    const { width, height } = sizeRef.current;
    const { x: mx, y: my } = mouseRef.current;

    if (!ctx || !width || !height) {
      rafRef.current = requestAnimationFrame(animate);
      return;
    }

    ctx.clearRect(0, 0, width, height);

    // Índices cercanos al mouse via grid espacial
    const active = new Set<number>();
    if (mx !== null && my !== null) {
      const r = Math.ceil(INTERACTION_RADIUS / GRID_CELL_SIZE);
      const cx = Math.floor(mx / GRID_CELL_SIZE);
      const cy = Math.floor(my / GRID_CELL_SIZE);
      for (let i = -r; i <= r; i++) {
        for (let j = -r; j <= r; j++) {
          const key = `${cx + i}_${cy + j}`;
          grid[key]?.forEach((idx) => active.add(idx));
        }
      }
    }

    dots.forEach((dot, idx) => {
      // Parpadeo suave
      dot.currentOpacity += dot.opacitySpeed;
      if (dot.currentOpacity >= dot.targetOpacity || dot.currentOpacity <= BASE_OPACITY_MIN) {
        dot.opacitySpeed = -dot.opacitySpeed;
        dot.currentOpacity = Math.max(BASE_OPACITY_MIN, Math.min(dot.currentOpacity, BASE_OPACITY_MAX));
        dot.targetOpacity = Math.random() * (BASE_OPACITY_MAX - BASE_OPACITY_MIN) + BASE_OPACITY_MIN;
      }

      let factor = 0;
      dot.currentRadius = BASE_RADIUS;

      if (mx !== null && my !== null && active.has(idx)) {
        const dx = dot.x - mx;
        const dy = dot.y - my;
        const distSq = dx * dx + dy * dy;
        if (distSq < INTERACTION_RADIUS_SQ) {
          const t = 1 - Math.sqrt(distSq) / INTERACTION_RADIUS;
          factor = t * t;
        }
      }

      const opacity = Math.min(1, dot.currentOpacity + factor * OPACITY_BOOST);
      dot.currentRadius = BASE_RADIUS + factor * RADIUS_BOOST;

      ctx.beginPath();
      ctx.fillStyle = `rgba(${DOT_R},${DOT_G},${DOT_B},${opacity.toFixed(3)})`;
      ctx.arc(dot.x, dot.y, dot.currentRadius, 0, Math.PI * 2);
      ctx.fill();
    });

    rafRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    handleResize();

    const onMove = (e: MouseEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const onLeave = () => { mouseRef.current = { x: null, y: null }; };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("resize", handleResize);
    document.documentElement.addEventListener("mouseleave", onLeave);

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", handleResize);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [handleResize, animate]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ pointerEvents: "none" }}
    />
  );
}
