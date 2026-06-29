"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { waLink } from "@/lib/utils";

const LINKS = [
  { label: "Inicio", href: "/" },
  { label: "Equipos", href: "/equipos" },
  { label: "Contacto", href: "/#contacto" },
];

const COTIZAR = waLink("Hola Equipos y Equipos, quiero cotizar un equipo.");

/* ----- Toggle hamburguesa -> X ----- */
function MenuToggle({ open }: { open: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden>
      <motion.path
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        initial={false}
        animate={open ? { d: "M5 5 L19 19" } : { d: "M3 7 L21 7" }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      />
      <motion.path
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        d="M3 12 L21 12"
        initial={false}
        animate={open ? { opacity: 0 } : { opacity: 1 }}
        transition={{ duration: 0.2 }}
      />
      <motion.path
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        initial={false}
        animate={open ? { d: "M5 19 L19 5" } : { d: "M3 17 L21 17" }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      />
    </svg>
  );
}

const cardVariants: Variants = {
  closed: {
    opacity: 0,
    y: -8,
    scale: 0.96,
    transition: { duration: 0.2, ease: [0.7, 0, 0.84, 0] },
  },
  open: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.35,
      ease: [0.16, 1, 0.3, 1],
      staggerChildren: 0.05,
      delayChildren: 0.08,
    },
  },
};

const itemVariants: Variants = {
  closed: { y: 8, opacity: 0 },
  open: { y: 0, opacity: 1, transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] } },
};

export function FloatingNav() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Bloquea scroll del body mientras el menú está abierto.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Cierra con Escape.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const show = !isHome || scrolled;

  return (
    <>
      <div
        className={`fixed inset-x-0 top-0 z-[70] flex justify-center px-4 transition-all duration-500 [transition-timing-function:var(--ease-out-expo)] ${
          show
            ? "translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-full opacity-0"
        }`}
      >
        <nav className="flex items-center gap-5 rounded-b-xl border border-t-0 border-neutral-200 bg-white px-5 py-1.5 shadow-sm">
          <Link
            href="/"
            aria-label="Equipos y Equipos — inicio"
            className="shrink-0"
            onClick={() => setOpen(false)}
          >
            <Image
              src="/brand/ee-mark.png"
              alt="Equipos y Equipos"
              width={1536}
              height={1024}
              className="h-16 w-auto"
            />
          </Link>

          <div className="hidden items-center gap-6 sm:flex">
            {LINKS.map((l) => (
              <Link
                key={l.label}
                href={l.href}
                className="text-xs font-medium text-neutral-900 transition-colors hover:text-brand"
              >
                {l.label}
              </Link>
            ))}
          </div>

          {/* Desktop: Cotizar */}
          <a
            href={COTIZAR}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden h-8 items-center justify-center rounded-md border border-neutral-200 bg-white px-3.5 text-xs font-medium text-neutral-900 shadow-sm transition-colors hover:bg-neutral-50 sm:inline-flex"
          >
            Cotizar
          </a>

          {/* Mobile: toggle */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={open}
            className="flex h-9 w-9 items-center justify-center rounded-md text-neutral-900 transition-colors hover:bg-neutral-100 sm:hidden"
          >
            <MenuToggle open={open} />
          </button>
        </nav>
      </div>

      {/* Menú compacto (dropdown) */}
      <AnimatePresence>
        {open ? (
          <div className="sm:hidden">
            {/* click-catcher */}
            <motion.button
              type="button"
              aria-label="Cerrar menú"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-[55] cursor-default bg-neutral-950/10 backdrop-blur-[2px]"
            />

            <motion.div
              key="card"
              variants={cardVariants}
              initial="closed"
              animate="open"
              exit="closed"
              style={{ originY: 0 }}
              className="fixed left-1/2 top-[84px] z-[65] w-[min(88vw,19rem)] -translate-x-1/2 overflow-hidden rounded-2xl border border-neutral-200 bg-white p-2 shadow-xl"
            >
              {LINKS.map((l) => (
                <motion.div key={l.label} variants={itemVariants}>
                  <Link
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="group flex items-center justify-between rounded-xl px-4 py-3 text-base font-medium text-neutral-900 transition-colors hover:bg-neutral-50"
                  >
                    {l.label}
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      aria-hidden
                      className="text-neutral-300 transition-all group-hover:translate-x-0.5 group-hover:text-neutral-500"
                    >
                      <path
                        d="M9 6l6 6-6 6"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </Link>
                </motion.div>
              ))}

              <motion.div variants={itemVariants} className="p-2 pt-1">
                <a
                  href={COTIZAR}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setOpen(false)}
                  className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-neutral-900 px-4 text-sm font-medium text-white transition-colors hover:bg-neutral-900/90"
                >
                  Cotizar por WhatsApp
                </a>
              </motion.div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
