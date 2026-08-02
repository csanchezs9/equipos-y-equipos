"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

export type Stat = { value: string; label: string };

/**
 * Separa el número de lo que lo rodea: "+12" -> "+" / 12 / "", "24h" -> "" / 24
 * / "h". Si no hay número (un valor tipo "24/7") se devuelve entero y no se
 * cuenta, solo entra con el reveal.
 */
function partir(value: string) {
  const m = value.match(/^(\D*)(\d+)(\D*)$/);
  if (!m) return { prefijo: value, numero: null, sufijo: "" };
  return { prefijo: m[1], numero: Number(m[2]), sufijo: m[3] };
}

export function Stats({ stats }: { stats: Stat[] }) {
  const root = useRef<HTMLDListElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;

    const items = el.querySelectorAll<HTMLElement>("[data-stat]");
    const numeros = el.querySelectorAll<HTMLElement>("[data-num]");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    // Los números salen del servidor con su valor final, así que valen para
    // SEO y para quien no tenga JS. Se ponen en cero acá, antes de que el
    // bloque entre en pantalla: como está bajo el fold, nadie ve el cambio.
    numeros.forEach((n) => {
      n.textContent = "0";
    });

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: el, start: "top 85%", once: true },
      });

      tl.from(items, {
        y: 24,
        opacity: 0,
        duration: 0.7,
        ease: "power3.out",
        stagger: 0.12,
      });

      // Un contador por dato, arrancando con el mismo escalonado que la entrada
      // para que cada cifra empiece a correr junto con su tarjeta.
      numeros.forEach((n, i) => {
        const destino = Number(n.dataset.num);
        const contador = { v: 0 };
        tl.to(
          contador,
          {
            v: destino,
            duration: 1.1,
            ease: "power2.out",
            onUpdate: () => {
              n.textContent = String(Math.round(contador.v));
            },
          },
          0.1 + i * 0.12
        );
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <dl ref={root} className="mt-10 grid grid-cols-3 gap-4">
      {stats.map((s) => {
        const { prefijo, numero, sufijo } = partir(s.value);
        return (
          <div key={s.label} data-stat className="flex flex-col items-center">
            <dt className="font-mono text-3xl font-semibold tabular-nums text-neutral-950 md:text-4xl">
              {prefijo}
              {numero === null ? null : <span data-num={numero}>{numero}</span>}
              {sufijo}
            </dt>
            <dd className="mt-2 text-xs leading-5 text-neutral-500">{s.label}</dd>
          </div>
        );
      })}
    </dl>
  );
}
