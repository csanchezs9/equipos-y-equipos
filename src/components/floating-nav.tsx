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

const GROUPS: {
  label: string;
  links: { label: string; href: string; external?: boolean }[];
}[] = [
  {
    label: "Navegar",
    links: [
      { label: "Inicio", href: "/" },
      { label: "Equipos", href: "/equipos" },
      { label: "Nosotros", href: "/#nosotros" },
      { label: "Preguntas frecuentes", href: "/#faq" },
    ],
  },
  {
    label: "Contacto",
    links: [
      { label: "Cotizar por WhatsApp", href: COTIZAR, external: true },
      { label: "Llamar", href: "tel:+573113095760" },
      { label: "Cómo llegar", href: "/#contacto" },
    ],
  },
];

const menuVariants: Variants = {
  closed: {
    opacity: 0,
    transition: { duration: 0.25, ease: [0.7, 0, 0.84, 0], when: "afterChildren" },
  },
  open: {
    opacity: 1,
    transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1], staggerChildren: 0.04, delayChildren: 0.1 },
  },
};

const itemVariants: Variants = {
  closed: { y: 18, opacity: 0, transition: { duration: 0.2 } },
  open: { y: 0, opacity: 1, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
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

      {/* Menú fullscreen (estilo Linear) */}
      <AnimatePresence>
        {open ? (
          <motion.div
            key="menu"
            variants={menuVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="fixed inset-0 z-[60] overflow-y-auto bg-white sm:hidden"
          >
            <div className="flex min-h-full flex-col px-7 pb-12 pt-28">
              {GROUPS.map((g) => (
                <div key={g.label} className="mb-9">
                  <motion.p
                    variants={itemVariants}
                    className="mb-3 text-sm font-medium text-neutral-400"
                  >
                    {g.label}
                  </motion.p>
                  <div className="flex flex-col">
                    {g.links.map((l) => (
                      <motion.div key={l.label} variants={itemVariants}>
                        {l.external ? (
                          <a
                            href={l.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => setOpen(false)}
                            className="block py-2 font-sans text-3xl font-semibold tracking-tight text-neutral-950 transition-colors hover:text-brand"
                          >
                            {l.label}
                          </a>
                        ) : (
                          <Link
                            href={l.href}
                            onClick={() => setOpen(false)}
                            className="block py-2 font-sans text-3xl font-semibold tracking-tight text-neutral-950 transition-colors hover:text-brand"
                          >
                            {l.label}
                          </Link>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
