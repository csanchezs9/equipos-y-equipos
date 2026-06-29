"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { waLink } from "@/lib/utils";
import { WhatsAppIcon } from "@/components/icons";

const WA_GREEN = "#25d366";

function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M6.5 3.5h-2A1.5 1.5 0 003 5c0 8.284 6.716 15 15 15a1.5 1.5 0 001.5-1.5v-2a1.5 1.5 0 00-1.2-1.47l-2.7-.54a1.5 1.5 0 00-1.46.61l-.5.7a11.5 11.5 0 01-5.24-5.24l.7-.5a1.5 1.5 0 00.6-1.46l-.53-2.7A1.5 1.5 0 006.5 3.5z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MapPinIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M12 21s7-5.5 7-11a7 7 0 10-14 0c0 5.5 7 11 7 11z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

type Action = {
  label: string;
  href: string;
  external?: boolean;
  icon: (p: { className?: string }) => React.ReactNode;
  bg: string;
};

const ACTIONS: Action[] = [
  {
    label: "Ubicación",
    href: "/#contacto",
    icon: (p) => <MapPinIcon {...p} />,
    bg: "#0c0e0d",
  },
  {
    label: "Llamar",
    href: "tel:+573113095760",
    icon: (p) => <PhoneIcon {...p} />,
    bg: "#1665ad",
  },
  {
    label: "Cotizar",
    href: waLink("Hola Equipos y Equipos, quiero cotizar el alquiler de un equipo."),
    external: true,
    icon: (p) => <WhatsAppIcon {...p} />,
    bg: WA_GREEN,
  },
];

const itemVariants: Variants = {
  closed: (i: number) => ({
    opacity: 0,
    y: 12,
    scale: 0.8,
    transition: { duration: 0.2, delay: (ACTIONS.length - 1 - i) * 0.03 },
  }),
  open: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.32, ease: [0.16, 1, 0.3, 1], delay: i * 0.05 },
  }),
};

export function FloatingActionMenu() {
  const [show, setShow] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div
      className={`fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3 transition-all duration-500 [transition-timing-function:var(--ease-out-expo)] ${
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0"
      }`}
    >
      {/* click-catcher */}
      <AnimatePresence>
        {open ? (
          <motion.button
            type="button"
            aria-label="Cerrar acciones"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 -z-10 cursor-default"
          />
        ) : null}
      </AnimatePresence>

      {/* Acciones */}
      <AnimatePresence>
        {open ? (
          <div className="flex flex-col items-end gap-3">
            {ACTIONS.map((a, i) => (
              <motion.a
                key={a.label}
                custom={i}
                variants={itemVariants}
                initial="closed"
                animate="open"
                exit="closed"
                href={a.href}
                target={a.external ? "_blank" : undefined}
                rel={a.external ? "noopener noreferrer" : undefined}
                onClick={() => setOpen(false)}
                className="group flex items-center gap-3"
              >
                <span className="rounded-full bg-white px-3 py-1.5 text-sm font-medium text-neutral-900 shadow-md ring-1 ring-black/5">
                  {a.label}
                </span>
                <span
                  className="flex h-12 w-12 items-center justify-center rounded-full text-white shadow-lg transition-transform group-hover:scale-105"
                  style={{ background: a.bg }}
                >
                  {a.icon({ className: "h-6 w-6" })}
                </span>
              </motion.a>
            ))}
          </div>
        ) : null}
      </AnimatePresence>

      {/* FAB principal */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Cerrar menú de contacto" : "Abrir menú de contacto"}
        aria-expanded={open}
        className="relative flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl text-white shadow-2xl ring-1 ring-black/5 transition-all duration-300 [transition-timing-function:var(--ease-out-expo)] hover:-translate-y-1"
        style={{ background: open ? "#0c0e0d" : "#ffffff" }}
      >
        {open ? (
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M12 5v14M5 12h14"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        ) : (
          <Image
            src="/brand/ee-fab.png"
            alt="Equipos y Equipos"
            fill
            sizes="56px"
            className="object-cover"
          />
        )}
      </button>
    </div>
  );
}
