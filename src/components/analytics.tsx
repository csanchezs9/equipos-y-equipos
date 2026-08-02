"use client";

import { useEffect } from "react";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { track } from "@vercel/analytics";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

type Params = Record<string, string>;

declare global {
  interface Window {
    // gtag solo existe si GA_ID está definido; todo el envío pasa por dataLayer.
    dataLayer?: unknown[];
  }
}

function enviar(evento: string, params: Params) {
  // Vercel Analytics: eventos personalizados requieren plan Pro. En Hobby esto
  // no rompe nada, solo no se registra; las visitas sí cuentan igual.
  track(evento, params);

  if (GA_ID && window.dataLayer) {
    window.dataLayer.push({ event: evento, ...params });
  }
}

/**
 * El sitio no vende en línea: la conversión es que alguien escriba por WhatsApp,
 * llame o baje un PDF. Sin medir eso, la analítica solo dice cuánta gente entró,
 * que es justo el dato que no sirve para cobrarle a un cliente.
 *
 * Va por delegación en document en vez de por onClick en cada botón: los links
 * de WhatsApp salen de waLink() y están repartidos en el hero, las tarjetas de
 * línea, el catálogo, cada ficha, el footer y el FAB. Un solo listener los cubre
 * todos y no hay forma de agregar un CTA nuevo y olvidarse de instrumentarlo.
 */
function useEventosDeContacto() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement | null)?.closest?.("a");
      if (!a) return;

      const href = a.getAttribute("href") || "";

      // De qué parte de la página salió el clic. Sirve para saber qué CTA
      // trabaja: el del hero, el del catálogo o el del footer.
      const zona =
        a.closest<HTMLElement>("[data-analytics-zone]")?.dataset.analyticsZone ||
        a.closest("section")?.id ||
        "sin-zona";

      if (href.startsWith("https://wa.me/") || href.startsWith("https://api.whatsapp.com/")) {
        enviar("whatsapp", { zona, ruta: window.location.pathname });
      } else if (href.startsWith("tel:")) {
        enviar("llamada", { zona, numero: href.slice(4) });
      } else if (href.startsWith("mailto:")) {
        enviar("correo", { zona });
      } else if (href.endsWith(".pdf")) {
        enviar("pdf", { zona, archivo: href.split("/").pop() || href });
      }
    };

    // Captura: si algún handler intermedio hiciera stopPropagation, el evento
    // igual pasa por acá antes.
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);
}

export function Analitica() {
  useEventosDeContacto();

  return (
    <>
      <Analytics />
      <SpeedInsights />
      {GA_ID ? (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            strategy="afterInteractive"
          />
          <Script id="ga4" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${GA_ID}');`}
          </Script>
        </>
      ) : null}
    </>
  );
}
