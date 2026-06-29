"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { categories, products } from "@/data/catalog";
import { ScrollPaintText } from "@/components/scroll-paint-text";
import { DotCanvas } from "@/components/dot-canvas";

export function EquiposHero() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });

      tl.from(".eh-sub", {
        y: 18,
        opacity: 0,
        filter: "blur(14px)",
        duration: 0.9,
      }).from(
        ".eh-meta",
        { y: 12, opacity: 0, duration: 0.7, stagger: 0.1 },
        "-=0.5"
      );

      // Contadores
      gsap.utils.toArray<HTMLElement>(".eh-count").forEach((el) => {
        const end = Number(el.dataset.to ?? "0");
        const obj = { v: 0 };
        gsap.to(obj, {
          v: end,
          duration: 1.8,
          ease: "power2.out",
          delay: 0.4,
          onUpdate: () =>
            (el.textContent = String(Math.round(obj.v)).padStart(2, "0")),
        });
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={root}
      className="relative overflow-hidden bg-ink pt-28 pb-6 md:pt-36 md:pb-10"
    >
      {/* Canvas de puntos interactivo */}
      <DotCanvas className="absolute inset-0 z-0 h-full w-full" />

      {/* Foto lateral derecha — sutil, solo desktop */}
      <div className="absolute inset-y-0 right-0 z-[1] hidden w-[42%] md:block">
        <Image
          src="/fotos/pexels-mehmet-aksoy-374584031-16764815.webp"
          alt=""
          fill
          sizes="42vw"
          className="object-cover object-center opacity-80"
          priority
        />
        {/* Fusión suave con el fondo blanco */}
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/30 via-transparent to-ink/60" />
      </div>

      <div className="container-x relative z-10">
        {/* Kicker */}
        <p className="eh-sub kicker mb-8">Catálogo de equipos</p>

        {/* Titular */}
        <style>{`.eh-title .sp-word { color: #c9ccc4; }`}</style>
        <ScrollPaintText
          as="h1"
          className="eh-title font-display font-bold display-xl"
          segments={[
            { text: "Equipos para", to: "#0c0e0d", block: true },
            { text: "construcción", to: "#128a3c", block: true },
          ]}
          from="#c9ccc4"
          forceScroll
        />

        {/* Subtítulo — mismo ancho que el titular */}
        <p className="eh-sub mt-12 w-full text-balance text-lg text-mute md:max-w-[54%]">
          Maquinaria certificada y mantenida, lista para tu obra. Filtra por
          categoría o busca el equipo que necesitas.
        </p>

        {/* Contadores — a la derecha */}
        <div className="eh-meta mt-10 flex justify-end gap-10">
          <div>
            <div
              className="font-mono tabular-nums text-4xl font-bold leading-none text-bone md:text-5xl"
            >
              <span className="eh-count" data-to={products.length}>
                {String(products.length).padStart(2, "0")}
              </span>
            </div>
            <p className="mt-2 text-xs font-medium uppercase tracking-widest text-mute">
              Equipos
            </p>
          </div>
          <div>
            <div
              className="font-mono tabular-nums text-4xl font-bold leading-none text-bone md:text-5xl"
            >
              <span className="eh-count" data-to={categories.length}>
                {String(categories.length).padStart(2, "0")}
              </span>
            </div>
            <p className="mt-2 text-xs font-medium uppercase tracking-widest text-mute">
              Categorías
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
