"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
}

/**
 * El scroll es NATIVO. Antes había Lenis (smooth scroll por wheel virtual) y se
 * sacó: mantenía su propia posición interna y la sincronizaba con ScrollTrigger
 * a mano vía `lenis.on("scroll", ScrollTrigger.update)`. Cuando un
 * ScrollTrigger.refresh() caía con una animación de Lenis en vuelo, la posición
 * nativa y la virtual quedaban desfasadas y la rueda dejaba de mover la página.
 * Además obligaba a marcar con data-lenis-prevent cada contenedor scrolleable
 * interno (dropdowns, menú), y olvidarse de uno lo dejaba muerto.
 *
 * Acá solo quedan los saltos programáticos, animados con ScrollToPlugin. No se
 * usa `scroll-behavior: smooth` en CSS a propósito: haría animado también el
 * scroll que ScrollTrigger restaura en cada refresh, que es justo la clase de
 * pelea que estamos sacando.
 */
export function scrollToEl(el: Element, offset = 90, duration = 0.9) {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduce) {
    const y = window.scrollY + el.getBoundingClientRect().top - offset;
    window.scrollTo(0, Math.max(0, y));
    return;
  }

  gsap.to(window, {
    duration,
    ease: "power3.inOut",
    // autoKill: si el usuario toca la rueda, la animación se corta en vez de
    // pelearle.
    scrollTo: { y: el, offsetY: offset, autoKill: true },
  });
}

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Reveals globales — re-corre por ruta
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Intención de scroll cross-page (sessionStorage, un solo uso). La pone el
    // navbar al saltar desde otra ruta a un ancla del home. Si no hay, arranca
    // arriba.
    window.scrollTo(0, 0);
    const target = sessionStorage.getItem("scrollTarget");
    let hashTimer: number | undefined;
    let onHashLoad: (() => void) | undefined;
    if (target && document.querySelector(target)) {
      sessionStorage.removeItem("scrollTarget");
      const goToHash = () => {
        const el = document.querySelector(target);
        if (el) scrollToEl(el);
      };
      onHashLoad = goToHash;
      // Espera a que imágenes/layout asienten para no caer corto.
      hashTimer = window.setTimeout(goToHash, 350);
      window.addEventListener("load", goToHash);
    } else {
      sessionStorage.removeItem("scrollTarget");
    }

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
      if (hashTimer) window.clearTimeout(hashTimer);
      if (onHashLoad) window.removeEventListener("load", onHashLoad);
      ctx.revert();
    };
  }, [pathname]);

  return <>{children}</>;
}
