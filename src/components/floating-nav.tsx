"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { waLink } from "@/lib/utils";
import { getLenis } from "@/components/smooth-scroll";

const LINKS = [
  { label: "Inicio", href: "/" },
  { label: "Equipos", href: "/equipos" },
  { label: "Contacto", href: "/#contacto" },
];

const COTIZAR = waLink("Hola Equipos y Equipos, quiero cotizar un equipo.");
const TEL = "tel:+573113095760";

/* ----- Toggle hamburguesa -> X ----- */
function MenuToggle({ open }: { open: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden>
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

// Menú móvil agrupado (patrón Linear: label gris + links grandes).
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
      { label: "Llamar", href: TEL },
      { label: "Cómo llegar", href: "/#sedes" },
    ],
  },
];

const menuVariants: Variants = {
  closed: {
    opacity: 0,
    scale: 0.96,
    y: -10,
    transition: { duration: 0.25, ease: [0.7, 0, 0.84, 0], when: "afterChildren" },
  },
  open: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1], staggerChildren: 0.045, delayChildren: 0.1 },
  },
};

const itemVariants: Variants = {
  closed: { y: 18, opacity: 0, transition: { duration: 0.2 } },
  open: { y: 0, opacity: 1, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } },
};

export function FloatingNav() {
  const pathname = usePathname();
  const router = useRouter();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [condensed, setCondensed] = useState(false);
  const [open, setOpen] = useState(false);

  // Isla reactiva: aparece tras 600px y se "condensa" (más sólida y
  // compacta) al seguir bajando, en vez de solo aparecer/desaparecer.
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 600);
      setCondensed(y > 740);
    };
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

  // Anchors (#contacto, #faq…). En home: scroll suave con Lenis. Cross-page:
  // guarda la intención en sessionStorage y navega (lo consume el home al
  // montar). Sin hash pegado en la URL para no re-disparar después.
  function onNav(e: React.MouseEvent<HTMLAnchorElement>, href: string) {
    setOpen(false);
    if (!href.includes("#")) return;
    e.preventDefault();
    const hash = href.slice(href.indexOf("#"));
    if (isHome) {
      const el = document.querySelector(hash);
      const lenis = getLenis();
      if (el) {
        if (lenis) lenis.scrollTo(el as HTMLElement, { offset: -90 });
        else el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    } else {
      sessionStorage.setItem("scrollTarget", hash);
      router.push("/");
    }
  }

  return (
    <>
      {/* Isla flotante centrada. Baja un poco con pt env() para librar la
          Dynamic Island / notch del iPhone sin pegarse al borde. */}
      <header
        className={`fixed inset-x-0 top-0 z-[70] flex justify-center px-3 pt-[calc(env(safe-area-inset-top)+0.6rem)] transition-all duration-500 [transition-timing-function:var(--ease-out-expo)] sm:px-4 sm:pt-[calc(env(safe-area-inset-top)+0.9rem)] ${
          show ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-4 opacity-0"
        }`}
      >
        <nav
          className={`flex w-auto max-w-[calc(100%-1.25rem)] items-center gap-2.5 rounded-full border border-neutral-200/70 pl-5 pr-2 ring-1 ring-white/50 backdrop-blur-xl transition-all duration-300 [transition-timing-function:var(--ease-out-expo)] sm:gap-3 sm:pl-6 ${
            condensed
              ? "h-13 bg-white/90 shadow-lg shadow-neutral-900/10 sm:h-14"
              : "h-14 bg-white/75 shadow-md shadow-neutral-900/5 sm:h-15"
          }`}
        >
          {/* Logo a la izquierda */}
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
              className="h-10 w-auto sm:h-9"
              priority
            />
          </Link>

          {/* Links centro (desktop) */}
          <div className="hidden items-center gap-6 pl-2 sm:flex">
            {LINKS.map((l) => (
              <Link
                key={l.label}
                href={l.href}
                onClick={(e) => onNav(e, l.href)}
                className="text-sm font-medium text-neutral-700 transition-colors hover:text-brand"
              >
                {l.label}
              </Link>
            ))}
          </div>

          {/* Acciones a la derecha */}
          <div className="flex items-center gap-1.5">
            <a
              href={COTIZAR}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden h-10 items-center justify-center rounded-full bg-brand px-5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-deep sm:inline-flex"
            >
              Cotizar
            </a>

            {/* Mobile: toggle hamburguesa dentro de la isla */}
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={open}
              className="relative z-[80] flex h-10 w-10 items-center justify-center rounded-full text-neutral-900 transition-colors hover:bg-neutral-100 sm:hidden"
            >
              <MenuToggle open={open} />
            </button>
          </div>
        </nav>
      </header>

      {/* Menú móvil fullscreen (patrón Linear, fondo claro de marca) */}
      <AnimatePresence>
        {open ? (
          <motion.div
            key="menu"
            variants={menuVariants}
            initial="closed"
            animate="open"
            exit="closed"
            style={{ transformOrigin: "top center" }}
            className="fixed inset-0 z-[60] flex flex-col overflow-y-auto bg-white sm:hidden"
          >
            {/* halo de marca arriba */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(120%_80%_at_50%_-20%,rgba(43,143,217,0.14),transparent_70%)]"
            />

            <div className="relative flex min-h-full flex-col px-7 pb-10 pt-[calc(env(safe-area-inset-top)+6rem)]">
              {GROUPS.map((g) => (
                <div key={g.label} className="mb-9">
                  <motion.p
                    variants={itemVariants}
                    className="kicker mb-3 text-sm text-neutral-400"
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
                            onClick={(e) => onNav(e, l.href)}
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

              {/* CTA WhatsApp */}
              <motion.a
                variants={itemVariants}
                href={COTIZAR}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="mt-2 flex items-center justify-center gap-2 rounded-2xl bg-brand px-5 py-4 text-base font-semibold text-white shadow-lg shadow-brand/25 transition-colors hover:bg-brand-deep"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M12.04 2a9.9 9.9 0 0 0-8.46 15.01L2 22l5.13-1.34A9.9 9.9 0 1 0 12.04 2Zm0 1.8a8.1 8.1 0 0 1 6.88 12.36l-.2.32.7 2.56-2.63-.69-.31.18a8.1 8.1 0 1 1-4.44-14.93Zm-3.1 4.07c-.15 0-.4.06-.6.29-.21.23-.8.78-.8 1.9 0 1.12.82 2.2.93 2.36.11.15 1.6 2.56 3.96 3.5 1.96.77 2.36.62 2.79.58.43-.04 1.38-.56 1.58-1.11.2-.55.2-1.02.14-1.12-.06-.1-.21-.16-.45-.28-.24-.12-1.38-.68-1.6-.76-.21-.08-.37-.12-.52.12-.15.23-.6.76-.73.91-.13.16-.27.18-.5.06-.24-.12-1-.37-1.9-1.18-.7-.62-1.18-1.4-1.32-1.63-.13-.24-.01-.37.1-.49.11-.11.24-.27.36-.41.12-.15.16-.25.24-.41.08-.16.04-.3-.02-.42-.06-.12-.52-1.28-.72-1.75-.19-.46-.38-.4-.52-.4l-.45-.01Z" />
                </svg>
                Cotizar por WhatsApp
              </motion.a>

              {/* Pie: sedes + llamar */}
              <motion.div
                variants={itemVariants}
                className="mt-auto flex items-center justify-between pt-8 text-sm text-neutral-400"
              >
                <span>Itagüí · Pereira · Armenia</span>
                <a href={TEL} className="font-medium text-neutral-600 transition-colors hover:text-brand">
                  Llamar
                </a>
              </motion.div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
