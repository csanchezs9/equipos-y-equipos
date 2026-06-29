"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

let lenis: Lenis | null = null;

export function getLenis() {
  return lenis;
}

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Lenis + RAF (una sola vez)
  useEffect(() => {
    lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.6,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const raf = (time: number) => {
      lenis?.raf(time * 1000);
    };
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(raf);
      lenis?.destroy();
      lenis = null;
    };
  }, []);

  // Reveals globales — re-corre por ruta
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    lenis?.scrollTo(0, { immediate: true });

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
        const t = el.dataset.reveal;

        // Las reveals corren para todos (con reduce solo achicamos el
        // movimiento: nada de blur y menos recorrido, para no marear).
        const from: gsap.TweenVars = { opacity: 0 };
        if (t === "left") from.x = reduce ? -24 : -64;
        else if (t === "right") from.x = reduce ? 24 : 64;
        else if (t === "scale") {
          from.scale = reduce ? 0.97 : 0.9;
          from.y = reduce ? 14 : 36;
        } else if (t === "blur") {
          from.y = reduce ? 14 : 32;
          if (!reduce) from.filter = "blur(18px)";
        } else from.y = reduce ? 18 : 48; // up

        // Stagger: posicion entre los hermanos [data-reveal] del mismo padre,
        // para que cada grid/seccion entre en cascada (no de golpe).
        const siblings = el.parentElement
          ? Array.from(el.parentElement.children).filter((c) =>
              c.hasAttribute("data-reveal")
            )
          : [el];
        // Tope al stagger: en grids largos (catalogo) la card N no puede
        // esperar N*delay. Maximo ~6 pasos.
        const idx = Math.min(Math.max(0, siblings.indexOf(el)), 6);

        // toggleActions: entra al bajar, se revierte al subir (y re-entra).
        gsap.fromTo(
          el,
          from,
          {
            opacity: 1,
            x: 0,
            y: 0,
            scale: 1,
            filter: "blur(0px)",
            duration: reduce ? 0.6 : 0.85,
            ease: "power3.out",
            delay: idx * (reduce ? 0.03 : 0.06),
            scrollTrigger: {
              trigger: el,
              // Override por-elemento via data-reveal-start (ej. "top 98%"
              // para que aparezca un poco antes en el viewport).
              start: el.dataset.revealStart || "top 88%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });

      // Contornos dibujandose: cualquier [data-draw] traza sus paths con
      // stroke-dashoffset a medida que entra en viewport.
      if (!reduce) {
        gsap.utils.toArray<SVGElement>("[data-draw]").forEach((node) => {
          const shapes = (
            node.tagName.toLowerCase() === "path"
              ? [node]
              : Array.from(
                  node.querySelectorAll(
                    "path, line, circle, rect, polyline, polygon"
                  )
                )
          ) as SVGGeometryElement[];

          shapes.forEach((sh, i) => {
            const len = sh.getTotalLength?.();
            if (!len) return;
            gsap.set(sh, { strokeDasharray: len, strokeDashoffset: len });
            gsap.to(sh, {
              strokeDashoffset: 0,
              duration: 1.5,
              ease: "power2.inOut",
              delay: i * 0.07,
              scrollTrigger: {
                trigger: node,
                start: "top 85%",
                toggleActions: "play none none reverse",
              },
            });
          });
        });
      }
    });

    // Recalcula posiciones cuando el pin del hero y las imagenes ya cargaron.
    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", onLoad);
    const t = window.setTimeout(() => ScrollTrigger.refresh(), 500);
    ScrollTrigger.refresh();

    return () => {
      window.removeEventListener("load", onLoad);
      window.clearTimeout(t);
      ctx.revert();
    };
  }, [pathname]);

  return <>{children}</>;
}
