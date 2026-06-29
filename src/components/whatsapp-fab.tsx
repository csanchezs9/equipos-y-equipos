"use client";

import { useEffect, useState } from "react";
import { waLink } from "@/lib/utils";
import { WhatsAppIcon } from "@/components/icons";

const WA_GREEN = "#25d366";

export function WhatsAppFab() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const clientMsg = "Hola Equipos y Equipos, quiero cotizar el alquiler de un equipo.";

  return (
    <a
      href={waLink(clientMsg)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Cotizar por WhatsApp"
      className={`group fixed bottom-6 right-6 z-40 flex flex-col items-end transition-all duration-500 [transition-timing-function:var(--ease-out-expo)] ${
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0"
      }`}
    >
      {/* Preview del chat al hover */}
      <div className="pointer-events-none absolute bottom-full right-0 w-72 origin-bottom-right translate-y-3 scale-90 pb-3 opacity-0 transition-all duration-400 [transition-timing-function:var(--ease-out-expo)] group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:scale-100 group-hover:opacity-100">
        <div className="overflow-hidden rounded-2xl bg-white text-[#0a0b0c] shadow-2xl ring-1 ring-black/10">
          <div className="flex items-center gap-3 px-4 py-3" style={{ background: "#075e54" }}>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20">
              <WhatsAppIcon className="h-5 w-5 text-white" />
            </span>
            <div className="leading-tight">
              <p className="text-sm font-semibold text-white">Equipos y Equipos</p>
              <p className="flex items-center gap-1.5 text-[0.7rem] text-white/80">
                <span className="h-1.5 w-1.5 rounded-full bg-green-300" />
                en línea
              </p>
            </div>
          </div>

          <div className="space-y-2 bg-[#ece5dd] px-3 py-3">
            <div className="w-fit max-w-[85%] rounded-2xl rounded-tl-sm bg-white px-3 py-2 text-[0.78rem] shadow-sm">
              ¡Hola! 👋 ¿Qué equipo necesitás cotizar?
            </div>
            <div className="ml-auto w-fit max-w-[90%] rounded-2xl rounded-tr-sm bg-[#d9fdd3] px-3 py-2 text-[0.78rem] shadow-sm">
              {clientMsg}
              <span className="ml-1 align-middle text-[0.6rem] text-black/40">✓✓</span>
            </div>
          </div>

          <div
            className="flex items-center justify-center gap-2 border-t border-black/5 py-2.5 text-xs font-semibold"
            style={{ color: "#075e54" }}
          >
            <WhatsAppIcon className="h-4 w-4" />
            Abrir conversación
          </div>
        </div>
      </div>

      <span
        className="flex h-14 w-14 items-center justify-center rounded-full text-white shadow-2xl transition-all duration-300 [transition-timing-function:var(--ease-out-expo)] group-hover:-translate-y-1"
        style={{ background: WA_GREEN }}
      >
        <WhatsAppIcon className="h-7 w-7" />
      </span>
    </a>
  );
}
