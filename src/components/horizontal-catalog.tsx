"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { categories, products } from "@/data/catalog";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

type Panel = {
  slug: string;
  name: string;
  count: number;
  image: string | null;
  items: string[];
};

const panels: Panel[] = categories.map((c) => {
  const ps = products.filter((p) => p.categories.includes(c.slug));
  const withImg = ps.find((p) => p.image);
  return {
    slug: c.slug,
    name: c.name,
    count: c.count,
    image: withImg?.image ?? null,
    items: ps.slice(0, 3).map((p) => p.name),
  };
});

export function HorizontalCatalog() {
  const section = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const fill = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const mm = gsap.matchMedia();

    // Desktop: pin + scroll horizontal por scrub.
    mm.add("(min-width: 1024px)", () => {
      const el = track.current!;
      const distance = () => el.scrollWidth - window.innerWidth;

      const tween = gsap.to(el, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: section.current!,
          start: "top top",
          end: () => "+=" + distance(),
          scrub: 0.8,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (fill.current) fill.current.style.transform = `scaleX(${self.progress})`;
          },
        },
      });

      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={section}
      className="relative overflow-hidden border-y border-line bg-ink"
      aria-label="Catálogo por especialidad"
    >
      {/* Encabezado fijo dentro del pin */}
      <div className="container-x flex items-end justify-between pt-16 pb-8 lg:absolute lg:inset-x-0 lg:top-0 lg:z-10 lg:pt-10">
        <div>
          <p className="kicker">12 especialidades</p>
          <h2 className="mt-3 display-lg">Todo para tu frente de obra.</h2>
        </div>
        <Link
          href="/equipos"
          className="mb-2 hidden shrink-0 text-sm font-semibold text-mute transition-colors hover:text-bone lg:block"
        >
          Ver catálogo completo →
        </Link>
      </div>

      {/* Track horizontal (desktop pin / mobile overflow nativo) */}
      <div
        ref={track}
        className="flex gap-5 overflow-x-auto px-[var(--spacing-gutter)] pb-16 lg:h-screen lg:items-center lg:overflow-visible lg:pb-0 lg:pt-24 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {panels.map((p, i) => (
          <Link
            key={p.slug}
            href={`/equipos?categoria=${p.slug}`}
            className="group relative flex h-[26rem] w-[82vw] shrink-0 flex-col justify-between overflow-hidden border border-line bg-ink-2 p-7 transition-colors duration-500 hover:border-brand sm:w-[60vw] lg:h-[30rem] lg:w-[34rem]"
          >
            {/* índice watermark */}
            <span className="pointer-events-none absolute -right-4 -top-10 font-display text-[12rem] font-bold leading-none text-bone/[0.035]">
              {String(i + 1).padStart(2, "0")}
            </span>

            <div className="relative flex items-start justify-between">
              <span className="tnum text-sm text-hazard">
                {String(i + 1).padStart(2, "0")} / 12
              </span>
              <span className="tnum text-sm text-mute">{p.count} eq.</span>
            </div>

            {/* tile imagen producto */}
            <div className="relative mx-auto flex h-44 w-full items-center justify-center">
              {p.image ? (
                <div className="relative h-full w-44 overflow-hidden tile-paper">
                  <Image
                    src={p.image}
                    alt={p.name}
                    fill
                    sizes="180px"
                    className="object-contain p-3 transition-transform duration-700 [transition-timing-function:var(--ease-out-expo)] group-hover:scale-110"
                  />
                </div>
              ) : (
                <div className="h-full w-44 bg-ink-3" />
              )}
            </div>

            <div className="relative">
              <h3 className="font-display text-3xl font-bold leading-none tracking-tight text-bone transition-colors group-hover:text-brand-glow lg:text-4xl">
                {p.name}
              </h3>
              <p className="mt-3 line-clamp-1 text-sm text-mute">
                {p.items.join(" · ")}
              </p>
              <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-bone">
                Ver equipos
                <span className="text-hazard transition-transform duration-300 group-hover:translate-x-1">→</span>
              </span>
            </div>
          </Link>
        ))}
      </div>

      {/* Barra de progreso (solo desktop pin) */}
      <div className="container-x absolute inset-x-0 bottom-8 hidden lg:block">
        <div className="h-px w-full bg-line">
          <span
            ref={fill}
            className="block h-px w-full origin-left scale-x-0 bg-hazard"
          />
        </div>
      </div>
    </section>
  );
}
