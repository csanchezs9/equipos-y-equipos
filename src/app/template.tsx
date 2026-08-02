"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

// Transición entre rutas. App Router no soporta exit al cambiar de ruta, así
// que animamos la ENTRADA: la página nueva entra con scale + slide + fade.
// template.tsx remonta en cada navegación, por eso alcanza con un efecto.
//
// El clearProps al terminar no es cosmético: deja el elemento SIN transform. Un
// transform residual convertiría este wrapper en bloque contenedor de cualquier
// position:fixed que viva dentro de la página.
export default function Template({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      gsap.set(el, { clearProps: "all" });
      return;
    }

    const tween = gsap.fromTo(
      el,
      { scale: 0.96, y: 30, opacity: 0 },
      {
        scale: 1,
        y: 0,
        opacity: 1,
        duration: 0.5,
        ease: "power2.out",
        clearProps: "transform,opacity",
      }
    );

    return () => {
      tween.kill();
      gsap.set(el, { clearProps: "transform,opacity" });
    };
  }, []);

  // opacity inicial en el markup para que no haya un flash sin animar antes de
  // que corra el efecto.
  return (
    <div ref={ref} style={{ opacity: 0 }}>
      {children}
    </div>
  );
}
