"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

/**
 * Fotos de obra propias de Equipos y Equipos. Locales en `public/fotos`,
 * sin CDN externo. Swap libre desde la prop `images`.
 */
export const DEFAULT_GRID_IMAGES: readonly string[] = [
  "/nosotros/james-sullivan-ESZRBtkQ_f8-unsplash.webp",
  "/nosotros/jay-ee-qcBayvKvghM-unsplash.webp",
  "/nosotros/john-kakuk-hfj5CG9dvuU-unsplash.webp",
  "/nosotros/mitchell-luo-TtX79Vkm8gs-unsplash.webp",
  "/nosotros/nathan-waters-j7q-Z9DV3zw-unsplash.webp",
  "/nosotros/nik-7mtBqZo5G6I-unsplash.webp",
  "/nosotros/ryunosuke-kikuno-d3vp0M7oT6c-unsplash.webp",
  "/nosotros/shivendu-shukla-3yoTPuYR9ZY-unsplash.webp",
];

// Antes eran cubicBezier(0.22,1,0.36,1) y cubicBezier(0,0,0.58,1) de framer.
// Equivalentes de GSAP: la entrada frena fuerte al llegar al foco, la salida
// arranca suave. Al ir con scrub la diferencia entre curvas casi no se nota.
const EASE_ENTRADA = "power4.out";
const EASE_SALIDA = "power2.in";

export type MaxWidthToken =
  | "sm"
  | "md"
  | "lg"
  | "xl"
  | "2xl"
  | "3xl"
  | "none";

export type GapToken = 4 | 6 | 8 | 10 | 12 | 14;

const MAX_WIDTH_CLASS: Record<MaxWidthToken, string> = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
  "3xl": "max-w-3xl",
  none: "",
};

const GAP_CLASS: Record<GapToken, string> = {
  4: "gap-4",
  6: "gap-6",
  8: "gap-8",
  10: "gap-10",
  12: "gap-12",
  14: "gap-14",
};

type Side = "L" | "R";

type TileConfig = {
  aspectRatio: string;
  perspective: number;
  maxTilt: number;
  maxBlur: number;
  rounded: string;
};

function Tile({
  src,
  side,
  config,
}: {
  src: string;
  side: Side;
  config: TileConfig;
}) {
  const ref = useRef<HTMLElement>(null);
  const capaRef = useRef<HTMLDivElement>(null);
  const fotoRef = useRef<HTMLDivElement>(null);

  const sign = side === "L" ? -1 : 1;
  const { aspectRatio, perspective, maxTilt, maxBlur, rounded } = config;

  // Antes era useScroll + useTransform de framer, que mapeaba el progreso del
  // tile por el viewport a cada propiedad. Acá es una timeline con scrub, que
  // hace lo mismo pero atada a ScrollTrigger, el que ya usa todo el sitio.
  //
  // El progreso va de "el tile entra por abajo" a "sale por arriba", con el
  // foco limpio en el medio: dos tramos de la timeline, entrada y salida.
  useEffect(() => {
    const el = ref.current;
    const capa = capaRef.current;
    const foto = fotoRef.current;
    if (!el || !capa || !foto) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      gsap.set([capa, foto], { clearProps: "all" });
      return;
    }

    const ctx = gsap.context(() => {
      const entrada = {
        xPercent: sign * 40,
        yPercent: 100,
        z: 300,
        rotate: -sign * 5,
        rotateX: maxTilt,
        skewX: sign * 20,
        filter: `blur(${maxBlur}px) brightness(0) contrast(4)`,
      };
      const foco = {
        xPercent: 0,
        yPercent: 0,
        z: 0,
        rotate: 0,
        rotateX: 0,
        skewX: 0,
        filter: "blur(0px) brightness(1) contrast(1)",
      };
      const salida = {
        xPercent: sign * 40,
        yPercent: -100,
        z: 300,
        rotate: sign * 5,
        rotateX: -maxTilt,
        skewX: -sign * 20,
        filter: `blur(${maxBlur}px) brightness(0) contrast(4)`,
      };

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });

      tl.fromTo(capa, entrada, { ...foco, duration: 1, ease: EASE_ENTRADA })
        .to(capa, { ...salida, duration: 1, ease: EASE_SALIDA })
        .fromTo(
          foto,
          { scaleY: 1.8 },
          { scaleY: 1, duration: 1, ease: EASE_ENTRADA },
          0
        )
        .to(foto, { scaleY: 1.8, duration: 1, ease: EASE_SALIDA }, 1);
    }, el);

    return () => ctx.revert();
  }, [sign, maxTilt, maxBlur]);

  return (
    <figure
      ref={ref}
      className="relative z-10 m-0"
      style={{ perspective, willChange: "transform" }}
    >
      <div
        ref={capaRef}
        className="relative w-full overflow-hidden will-change-[filter,transform]"
        style={{ aspectRatio, borderRadius: rounded }}
      >
        <div
          ref={fotoRef}
          className="absolute inset-0 bg-cover bg-center will-change-transform"
          style={{
            backgroundImage: `url("${src}")`,
            backfaceVisibility: "hidden",
          }}
        />
      </div>
    </figure>
  );
}

export type ScrollTiltedGridProps = {
  /** Image URLs to render. Falls back to {@link DEFAULT_GRID_IMAGES}. */
  images?: readonly string[];
  /**
   * Cycle the source list and append more pairs as the user nears the bottom —
   * a perceptually infinite scroll. Default `false`.
   */
  loop?: boolean;
  /** Initial number of cycles to render when `loop` is on. Default `3`. */
  initialCycles?: number;
  /** CSS `aspect-ratio` value for each tile, e.g. `"3/4"`, `"2/3"`. Default `"3/4"`. */
  aspectRatio?: string;
  /** Tailwind `max-w-*` token controlling the column width. Default `"lg"`. */
  maxWidth?: MaxWidthToken;
  /** Tailwind `gap-*` token between tiles. Default `10`. */
  gap?: GapToken;
  /** CSS `perspective` in pixels applied to each tile. Default `900`. */
  perspective?: number;
  /**
   * Maximum `rotateX` tilt magnitude (in degrees) at the entry and exit poses.
   * Symmetric — entry tilts forward `+maxTilt`, exit tilts back `-maxTilt`.
   * Default `70`.
   */
  maxTilt?: number;
  /** Maximum blur (px) at the entry and exit poses. Default `8`. */
  maxBlur?: number;
  /**
   * CSS `border-radius` for the tile clipping mask. Accepts any CSS length value
   * (`"0.375rem"`, `"12px"`, `"1rem"`). Default `"0.375rem"` (Tailwind `rounded-md`).
   */
  rounded?: string;
  /** Additional className applied to the outer `<section>`. */
  className?: string;
};

/**
 * Editorial scroll-tilted image grid. Pairs of images rise from below tipped
 * forward, settle into a clean focus, then tilt back over the top edge as they
 * exit. Optionally loops infinitely via an IntersectionObserver-driven append.
 */
export function ScrollTiltedGrid({
  images = DEFAULT_GRID_IMAGES,
  loop = false,
  initialCycles = 3,
  aspectRatio = "3/4",
  maxWidth = "lg",
  gap = 10,
  perspective = 900,
  maxTilt = 70,
  maxBlur = 8,
  rounded = "0.375rem",
  className,
}: ScrollTiltedGridProps = {}) {
  const [cycles, setCycles] = useState(loop ? initialCycles : 1);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!loop) return;
    const el = sentinelRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setCycles((c) => c + 2);
        }
      },
      { rootMargin: "1500px 0px 1500px 0px" },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [loop]);

  const items = useMemo(
    () =>
      loop
        ? Array.from({ length: cycles }, () => images).flat()
        : [...images],
    [loop, cycles, images],
  );

  const config = useMemo<TileConfig>(
    () => ({ aspectRatio, perspective, maxTilt, maxBlur, rounded }),
    [aspectRatio, perspective, maxTilt, maxBlur, rounded],
  );

  const gridClass = [
    "mx-auto grid w-full grid-cols-2 px-6 pt-8 pb-8",
    MAX_WIDTH_CLASS[maxWidth],
    GAP_CLASS[gap],
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <section
      className={["relative w-full", className].filter(Boolean).join(" ")}
    >
      <div className={gridClass}>
        {items.map((src, i) => (
          <Tile
            key={`${i}-${src}`}
            src={src}
            side={i % 2 === 0 ? "L" : "R"}
            config={config}
          />
        ))}
      </div>
      {loop ? (
        <div ref={sentinelRef} aria-hidden className="h-px w-full" />
      ) : null}
    </section>
  );
}
