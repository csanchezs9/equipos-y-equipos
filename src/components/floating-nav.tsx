"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { waLink } from "@/lib/utils";

const LINKS = [
  { label: "Inicio", href: "#top" },
  { label: "Equipos", href: "#equipos" },
  { label: "Contacto", href: "#contacto" },
];

export function FloatingNav() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`fixed inset-x-0 top-0 z-50 flex justify-center px-4 transition-all duration-500 [transition-timing-function:var(--ease-out-expo)] ${
        show
          ? "translate-y-0 opacity-100"
          : "pointer-events-none -translate-y-full opacity-0"
      }`}
    >
      <nav className="flex items-center gap-5 rounded-b-xl border border-t-0 border-neutral-200 bg-white px-5 py-1.5 shadow-sm">
        <a href="#top" aria-label="Equipos y Equipos — inicio" className="shrink-0">
          <Image
            src="/brand/ee-mark.png"
            alt="Equipos y Equipos"
            width={1536}
            height={1024}
            className="h-16 w-auto"
          />
        </a>

        <div className="hidden items-center gap-6 sm:flex">
          {LINKS.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="text-xs font-medium text-neutral-900 transition-colors hover:text-brand"
            >
              {l.label}
            </a>
          ))}
        </div>

        <a
          href={waLink("Hola Equipos y Equipos, quiero cotizar un equipo.")}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-8 items-center justify-center rounded-md border border-neutral-200 bg-white px-3.5 text-xs font-medium text-neutral-900 shadow-sm transition-colors hover:bg-neutral-50"
        >
          Cotizar
        </a>
      </nav>
    </div>
  );
}
