"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

type Segment = {
  text: string;
  to?: string;
  /** Renderiza el segmento en su propia línea. */
  block?: boolean;
  /** Clases extra para el wrapper del segmento (p.ej. sangría). */
  className?: string;
};

// Pinta el texto palabra por palabra, de claro a su color final, a medida que
// se scrollea (efecto scrolly). Soporta segmentos con color destino propio
// (p.ej. un acento de marca) y un color de partida configurable.
export function ScrollPaintText({
  text,
  segments,
  from = "#c9ccc4",
  to = "#0c0e0d",
  as: Tag = "p",
  className,
  forceScroll = false,
}: {
  /** Texto simple (un solo color destino `to`). */
  text?: string;
  /** O segmentos con color destino por tramo. */
  segments?: Segment[];
  from?: string;
  to?: string;
  as?: "p" | "h1" | "h2" | "h3";
  className?: string;
  /** Pinta siempre con el scroll (scrub), aunque ya esté en viewport. */
  forceScroll?: boolean;
}) {
  const root = useRef<HTMLElement>(null);

  const segs: Segment[] = segments ?? [{ text: text ?? "", to }];

  // Cada segmento conserva sus palabras (cada una es un .sp-word que la
  // animación pinta en orden). Un segmento `block` se renderiza en su propia
  // línea y admite clases extra (p.ej. sangría).
  const segWords = segs.map((seg) => ({
    block: seg.block,
    className: seg.className,
    to: seg.to ?? to,
    words: seg.text.split(" ").filter(Boolean),
  }));

  useEffect(() => {
    const el = root.current;
    if (!el) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const wordEls = el.querySelectorAll<HTMLElement>(".sp-word");

    // Con reduce dejamos el texto ya en su color final, sin animar. En mobile
    // el scrub táctil es poco fiable, así que solo lo evitamos cuando NO se
    // fuerza el scroll.
    if (reduce || (!forceScroll && window.innerWidth < 1024)) {
      wordEls.forEach((w) => {
        w.style.color = w.dataset.to || to;
      });
      return;
    }

    // Si el texto ya está en viewport al montar (p.ej. primer bloque de la
    // página), no hay recorrido de scroll para pintarlo: lo pintamos una vez,
    // temporizado. Si está bajo el fold, se pinta con el scroll (scrub).
    // forceScroll ignora esto y usa siempre el scrub.
    const rect = el.getBoundingClientRect();
    const inViewOnMount =
      !forceScroll && rect.top < window.innerHeight * 0.85 && rect.bottom > 0;

    const ctx = gsap.context(() => {
      if (inViewOnMount) {
        const tl = gsap.timeline({ delay: 0.15 });
        wordEls.forEach((w, i) => {
          tl.fromTo(
            w,
            { color: from },
            { color: w.dataset.to || to, ease: "none", duration: 0.6 },
            i * 0.08 // ola suave on-load
          );
        });
        return;
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          end: "bottom 70%",
          scrub: 1.5,
        },
      });
      wordEls.forEach((w, i) => {
        tl.fromTo(
          w,
          { color: from },
          { color: w.dataset.to || to, ease: "none", duration: 1 },
          i * 0.25 // stagger solapado -> ola suave
        );
      });
    }, root);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Tag ref={root as never} className={className}>
      {segWords.map((seg, si) => {
        const inner = seg.words.map((w, wi) => (
          <span key={wi} className="sp-word" data-to={seg.to}>
            {w}
            {wi < seg.words.length - 1 ? " " : ""}
          </span>
        ));
        // Inline: une los segmentos con un espacio entre ellos.
        if (!seg.block) {
          return (
            <span key={si}>
              {inner}
              {si < segWords.length - 1 && !segWords[si + 1].block ? " " : ""}
            </span>
          );
        }
        return (
          <span key={si} className={`block ${seg.className ?? ""}`}>
            {inner}
          </span>
        );
      })}
    </Tag>
  );
}
