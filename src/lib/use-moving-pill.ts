"use client";

import { useCallback, useEffect, useRef } from "react";
import { gsap } from "gsap";

/**
 * Pastilla que se desliza hasta el elemento activo.
 *
 * Reemplaza el `layoutId` de framer-motion. En vez de dos elementos que
 * comparten identidad y framer interpola entre ellos, acá hay UNA sola pastilla
 * absoluta dentro del contenedor, y se le animan posición y tamaño hasta el
 * hijo marcado con `data-pill="<clave>"`.
 *
 * Se mide con getBoundingClientRect del contenedor y del objetivo, y se usa la
 * DIFERENCIA entre ambos: así da igual que haya un ancestro transformado,
 * porque el desplazamiento afecta a los dos rects por igual y se cancela.
 */
export function useMovingPill<C extends HTMLElement>(clave: string | null) {
  const contenedorRef = useRef<C>(null);
  const pastillaRef = useRef<HTMLSpanElement>(null);
  const yaColocada = useRef(false);

  const colocar = useCallback(
    (animar: boolean) => {
      const cont = contenedorRef.current;
      const pastilla = pastillaRef.current;
      if (!cont || !pastilla) return;

      const objetivo = clave
        ? cont.querySelector<HTMLElement>(`[data-pill="${CSS.escape(clave)}"]`)
        : null;

      // Sin activo (o el activo no está en esta lista) la pastilla se esconde.
      if (!objetivo) {
        gsap.killTweensOf(pastilla);
        gsap.to(pastilla, { autoAlpha: 0, duration: 0.15 });
        yaColocada.current = false;
        return;
      }

      const c = cont.getBoundingClientRect();
      const o = objetivo.getBoundingClientRect();

      // Contenedor oculto (el segmented control es sm:inline-flex, en móvil
      // está en display:none): los rects dan cero y colocaríamos la pastilla en
      // la esquina con tamaño 0. Se sale y ya la recolocará el ResizeObserver
      // cuando vuelva a mostrarse.
      if (o.width === 0 && o.height === 0) return;

      const destino = {
        x: o.left - c.left,
        y: o.top - c.top,
        width: o.width,
        height: o.height,
        autoAlpha: 1,
      };

      // La primera vez aparece ya puesta, sin viajar desde la esquina.
      if (!animar || !yaColocada.current) {
        // Matar antes de set: si hay un tween corriendo, seguiría su curso por
        // encima del set y los dos se pelearían la posición.
        gsap.killTweensOf(pastilla);
        gsap.set(pastilla, destino);
        yaColocada.current = true;
        return;
      }

      // overwrite para que clics rápidos no apilen tweens.
      gsap.to(pastilla, {
        ...destino,
        duration: 0.42,
        ease: "power3.out",
        overwrite: "auto",
      });
    },
    [clave]
  );

  // Referencia siempre fresca de `colocar`, para que los observers de abajo NO
  // dependan de él y se monten una sola vez.
  const colocarRef = useRef(colocar);
  useEffect(() => {
    colocarRef.current = colocar;
  }, [colocar]);

  useEffect(() => {
    colocar(true);
  }, [colocar]);

  // Recoloca sin animar cuando cambia el layout: resize, carga de fuentes, o el
  // contenedor apareciendo.
  //
  // Deps [] a propósito. Si dependiera de `colocar`, este efecto se volvería a
  // montar en cada cambio de filtro y el callback INICIAL del ResizeObserver
  // (que dispara apenas hacés observe) plantaría la pastilla en el destino de
  // golpe, pisando la animación que acaba de arrancar.
  useEffect(() => {
    const cont = contenedorRef.current;
    if (!cont) return;

    let primeraLlamada = true;
    const ro = new ResizeObserver(() => {
      // El callback inicial del observe no es un cambio real de layout.
      if (primeraLlamada) {
        primeraLlamada = false;
        return;
      }
      colocarRef.current(false);
    });
    ro.observe(cont);

    const onResize = () => colocarRef.current(false);
    window.addEventListener("resize", onResize);

    // Las fuentes cambian el ancho de los botones al cargar y dejarían la
    // pastilla corrida respecto del texto.
    let vigente = true;
    document.fonts?.ready.then(() => {
      if (vigente) colocarRef.current(false);
    });

    return () => {
      vigente = false;
      ro.disconnect();
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return { contenedorRef, pastillaRef };
}
