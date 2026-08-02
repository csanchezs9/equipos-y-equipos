"use client";

import { useEffect, useLayoutEffect, useRef, type ElementType } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

// useLayoutEffect corre antes del pintado, así el estado inicial del tween ya
// está puesto cuando el navegador dibuja. Con useEffect había un frame con el
// texto completo antes de esconderse, visible en los bloques sobre el fold.
// En el servidor no existe, y usarlo ahí avisa por consola: de ahí el cambio.
const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

type Props = {
  children: string;
  animation?: "slideUp" | "fadeIn";
  by?: "word" | "char";
  /** Segundos que tarda TODO el texto en terminar de entrar, no cada pieza. */
  duration?: number;
  delay?: number;
  as?: "p" | "h1" | "h2" | "h3" | "span" | "div";
  className?: string;
};

/**
 * Texto que entra por partes al llegar a pantalla. Equivale al TextAnimate de
 * Magic UI, reescrito con GSAP porque aquel corre sobre framer-motion y de este
 * proyecto framer ya se sacó.
 *
 * Accesibilidad: el texto se parte en muchos <span>, así que las piezas van
 * aria-hidden y la frase completa viaja en el aria-label del contenedor. Sin
 * eso, un lector de pantalla leería palabra por palabra como fragmentos
 * sueltos.
 */
export function TextAnimate({
  children,
  animation = "slideUp",
  by = "word",
  duration = 1,
  delay = 0,
  as = "p",
  className,
}: Props) {
  const ref = useRef<HTMLElement>(null);

  useIsoLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const piezas = el.querySelectorAll<HTMLElement>("[data-pieza]");
    if (!piezas.length) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      gsap.set(piezas, { clearProps: "all" });
      return;
    }

    const ctx = gsap.context(() => {
      // stagger.amount reparte el escalonado ENTRE todas las piezas en vez de
      // sumar un retraso por pieza. Así el total es siempre `duration`, tenga
      // el texto tres palabras o cuarenta.
      const porPieza = duration * 0.6;

      gsap.from(piezas, {
        // yPercent y no px: se mide contra la altura de la propia palabra, así
        // el desplazamiento acompaña al tamaño de fuente.
        yPercent: animation === "slideUp" ? 60 : 0,
        opacity: 0,
        duration: porPieza,
        delay,
        ease: "power3.out",
        stagger: { amount: duration - porPieza },
        // Aplica el estado inicial al crear el tween, no al dispararse: si no,
        // el texto se vería normal y saltaría a escondido al llegar a pantalla.
        immediateRender: true,
        scrollTrigger: { trigger: el, start: "top 88%", once: true },
      });
    }, el);

    return () => ctx.revert();
  }, [animation, by, duration, delay, children]);

  // Partir conservando los espacios como nodos aparte: si el espacio quedara
  // dentro del span inline-block, el texto no podría cortar la línea ahí.
  const piezas =
    by === "word" ? children.split(/(\s+)/) : Array.from(children);

  const Tag = as as ElementType;

  return (
    <Tag ref={ref} className={className} aria-label={children}>
      {piezas.map((p, i) =>
        /^\s+$/.test(p) ? (
          <span key={i}>{p}</span>
        ) : (
          <span
            key={i}
            data-pieza
            aria-hidden
            className="inline-block will-change-transform"
          >
            {p}
          </span>
        )
      )}
    </Tag>
  );
}
