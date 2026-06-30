"use client";

import { useEffect, useState } from "react";
import { waLink } from "@/lib/utils";
import { WhatsAppIcon } from "@/components/icons";

const COTIZAR = waLink("Hola Equipos y Equipos, quiero cotizar el alquiler de un equipo.");

export function FloatingActionMenu() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <a
      href={COTIZAR}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Cotizar por WhatsApp"
      className={`fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full shadow-xl transition-all duration-500 [transition-timing-function:var(--ease-out-expo)] hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(37,211,102,0.45)] ${
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0"
      }`}
      style={{ background: "#25d366" }}
    >
      <WhatsAppIcon className="h-7 w-7 text-white" />
    </a>
  );
}
