"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { categories } from "@/data/catalog";
import { SEDES, waLink } from "@/lib/utils";
import { getLenis } from "@/components/smooth-scroll";

/**
 * Navbar de dos estados.
 *
 * Arriba del todo (solo en home, solo desktop) la barra vive dentro del hero:
 * ancho completo, sin caja, tipografía grande. Al scrollear se CONTRAE en una
 * píldora que deja de navegar y se pone a cotizar: elegís línea y sede, y el
 * botón arma el mensaje de WhatsApp ya redactado.
 *
 * En móvil no existe el estado editorial (no cabe): siempre la píldora.
 */

// El menú se monta en un portal a <body>, así que necesitamos saber si ya
// estamos en cliente. useSyncExternalStore da false en SSR/hidratación y true
// después, sin el setState-dentro-de-effect que dispara renders en cascada.
const noSubscribe = () => () => {};
const useIsClient = () =>
  useSyncExternalStore(
    noSubscribe,
    () => true,
    () => false
  );

// Links del estado editorial. El resto (FAQ, sedes) vive en el footer y en el
// menú móvil; arriba solo lo que de verdad se usa.
const LINKS = [
  { label: "Equipos", href: "/equipos" },
  { label: "Nosotros", href: "/#nosotros" },
  { label: "Contacto", href: "/#contacto" },
];

// catalog.ts viene de un scrape y trae el Title Case raro de WordPress.
// No se toca el archivo (es autogenerado), se arregla la vista.
const NOMBRE_BONITO: Record<string, string> = {
  "Formaleteria Para Columna y Muro": "Formaletería para columna y muro",
  "Formaleteria Para Losas": "Formaletería para losas",
  "Equipos De Tracción Vertical": "Equipos de tracción vertical",
  "Básculas 500kgs": "Básculas de 500 kg",
  "Mini-Cargadores": "Mini-cargadores",
  "Vibradores y Compactadores": "Vibradores y compactadores",
  "Rodillos Compactadores": "Rodillos compactadores",
  "Andamio De Carga": "Andamio de carga",
};

function bonito(name: string) {
  return NOMBRE_BONITO[name] ?? name;
}

/** Mensaje de WhatsApp según lo que el usuario haya elegido en la barra. */
function mensajeCotizacion(equipo: string | null, sede: string | null) {
  const qué = equipo
    ? `el alquiler de ${bonito(equipo).toLowerCase()}`
    : "el alquiler de un equipo";
  const dónde = sede ? ` para una obra en ${sede}` : "";
  return `Hola Equipos y Equipos, quiero cotizar ${qué}${dónde}.`;
}

function Chevron({ className = "" }: { className?: string }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

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

/** Botón + panel de un selector de la píldora (línea de equipo / sede). */
function Selector({
  label,
  value,
  open,
  onToggle,
  children,
  width,
}: {
  label: string;
  value: string | null;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  width: string;
}) {
  return (
    <div className="relative">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-haspopup="listbox"
        className={`flex h-9 max-w-[11rem] items-center gap-1.5 rounded-full px-3 text-sm transition-colors ${
          value
            ? "bg-brand/10 font-medium text-brand-deep"
            : "text-neutral-600 hover:bg-neutral-100"
        }`}
      >
        <span className="truncate">{value ? bonito(value) : label}</span>
        <Chevron
          className={`shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            role="listbox"
            aria-label={label}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className={`absolute left-0 top-[calc(100%+0.65rem)] z-50 ${width} overflow-hidden rounded-2xl border border-neutral-200 bg-white p-1.5 shadow-xl shadow-neutral-900/10`}
          >
            {/* data-lenis-prevent: sin esto Lenis (smoothWheel) se traga el
                wheel y el trackpad scrollea la página en vez de la lista. */}
            <div
              data-lenis-prevent
              className="max-h-[19rem] overflow-y-auto overscroll-contain"
            >
              {children}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function Opcion({
  selected,
  onClick,
  children,
  hint,
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <button
      type="button"
      role="option"
      aria-selected={selected}
      onClick={onClick}
      className={`flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2 text-left text-sm transition-colors ${
        selected
          ? "bg-brand/10 font-medium text-brand-deep"
          : "text-neutral-700 hover:bg-neutral-100"
      }`}
    >
      <span className="truncate">{children}</span>
      {hint ? (
        <span className="shrink-0 font-mono text-xs tabular-nums text-neutral-400">
          {hint}
        </span>
      ) : null}
    </button>
  );
}

const menuVariants: Variants = {
  closed: {
    opacity: 0,
    transition: { duration: 0.2, ease: [0.7, 0, 0.84, 0], when: "afterChildren" },
  },
  open: {
    opacity: 1,
    transition: {
      duration: 0.25,
      ease: [0.16, 1, 0.3, 1],
      staggerChildren: 0.05,
      delayChildren: 0.08,
    },
  },
};

const itemVariants: Variants = {
  closed: { y: 18, opacity: 0, transition: { duration: 0.2 } },
  open: { y: 0, opacity: 1, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } },
};

// Franja de destacados del menú. Selección a mano: el catálogo no tiene dato
// de popularidad ni de alquileres, solo cuántos productos hay por línea.
// `nombre` es el del catálogo; `label` es la versión corta para la tarjeta.
// Elegidas por encuadre: las cuatro llenan el cuadro, van centradas y no
// tienen personas dentro (compresor.png y rana.png sí, y descuadran la grilla).
const DESTACADOS = [
  {
    label: "Mini-cargador",
    linea: "Mini-cargadores",
    image: "/equipos/minicargador-con-pala.png",
  },
  {
    label: "Rodillo compactador",
    linea: "Rodillos compactadores",
    image: "/equipos/dd24.png",
  },
  {
    label: "Cortadora de piso",
    linea: "Cortadoras",
    image: "/equipos/cortadora-de-piso.png",
  },
  {
    label: "Allanadora",
    linea: "Allanadoras",
    image: "/equipos/allanadora-con-aspas.png",
  },
];

// Links del menú fullscreen.
const NAV_LINKS = [
  { label: "Inicio", href: "/#top" },
  { label: "Equipos", href: "/equipos" },
  { label: "Nosotros", href: "/#nosotros" },
  { label: "Preguntas frecuentes", href: "/#faq" },
  { label: "Contacto", href: "/#contacto" },
];

export function SiteNav() {
  const pathname = usePathname();
  const router = useRouter();
  const isHome = pathname === "/";

  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [drop, setDrop] = useState<"equipo" | "sede" | null>(null);
  const [equipo, setEquipo] = useState<string | null>(null);
  const [sede, setSede] = useState<string | null>(null);

  const barRef = useRef<HTMLDivElement>(null);
  const isClient = useIsClient();

  // El estado editorial solo existe arriba del todo. 80px basta: apenas te
  // movés, la barra ya es cotizador.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setDrop(null);
      setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Cierra los desplegables al tocar por fuera de la barra.
  useEffect(() => {
    if (!drop) return;
    const onDown = (e: PointerEvent) => {
      if (!barRef.current?.contains(e.target as Node)) setDrop(null);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [drop]);

  // En cualquier página que no sea la home arranca ya contraída.
  const compacta = scrolled || !isHome;
  const cotizar = waLink(mensajeCotizacion(equipo, sede));

  function onNav(e: React.MouseEvent<HTMLAnchorElement>, href: string) {
    setOpen(false);
    setDrop(null);
    if (!href.includes("#")) return;
    e.preventDefault();
    const hash = href.slice(href.indexOf("#"));
    if (isHome) {
      const el = document.querySelector(hash);
      if (!el) return;
      const lenis = getLenis();
      if (lenis) lenis.scrollTo(el as HTMLElement, { offset: -80 });
      else el.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      sessionStorage.setItem("scrollTarget", hash);
      router.push("/");
    }
  }

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-[70] flex justify-center px-3 pt-[calc(env(safe-area-inset-top)+0.5rem)] sm:px-4 sm:pt-[calc(env(safe-area-inset-top)+0.7rem)]">
        <div
          ref={barRef}
          className={`relative flex h-14 w-full max-w-3xl items-center gap-2 rounded-full border border-neutral-200 bg-white/90 pl-4 pr-2 shadow-lg shadow-neutral-900/[0.07] backdrop-blur-xl transition-[max-width,height,background-color,border-color,box-shadow,border-radius,padding] duration-500 [transition-timing-function:var(--ease-out-expo)] ${
            compacta
              ? ""
              : "md:h-20 md:max-w-6xl md:gap-6 md:rounded-none md:border-transparent md:bg-transparent md:pl-1 md:pr-1 md:shadow-none md:backdrop-blur-none"
          }`}
        >
          {/* Logo: único en los dos estados, solo cambia de tamaño. */}
          <Link
            href="/"
            aria-label="Equipos y Equipos, ir al inicio"
            className="relative z-10 shrink-0"
            onClick={(e) => onNav(e, "/#top")}
          >
            {/* Mark recortado en los dos estados: al ser corto aguanta más
                tamaño que el wordmark largo. Solo cambia de alto. */}
            <Image
              src="/brand/ee-mark-croped.png"
              alt=""
              width={860}
              height={511}
              priority
              className={`w-auto transition-[height] duration-500 [transition-timing-function:var(--ease-out-expo)] ${
                compacta ? "h-10" : "h-10 md:h-15"
              }`}
            />
          </Link>

          <div className="relative h-full flex-1">
            {/* ---------- Estado editorial (desktop, arriba del todo) ---------- */}
            <div
              className={`absolute inset-0 hidden items-center justify-end gap-9 transition-all duration-300 md:flex ${
                compacta
                  ? "pointer-events-none -translate-y-1 opacity-0"
                  : "translate-y-0 opacity-100"
              }`}
            >
              {LINKS.map((l) => (
                <Link
                  key={l.label}
                  href={l.href}
                  onClick={(e) => onNav(e, l.href)}
                  className="text-[0.95rem] font-medium text-neutral-700 transition-colors hover:text-brand"
                >
                  {l.label}
                </Link>
              ))}
              <a
                href={cotizar}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-1.5 text-[0.95rem] font-semibold text-neutral-950 transition-colors hover:text-brand"
              >
                Cotizar
                <span
                  aria-hidden
                  className="transition-transform duration-300 [transition-timing-function:var(--ease-out-expo)] group-hover:translate-x-1"
                >
                  &rarr;
                </span>
              </a>
            </div>

            {/* ---------- Estado cotizador (píldora) ---------- */}
            <div
              className={`absolute inset-0 flex items-center justify-end gap-1 transition-all duration-300 ${
                compacta
                  ? "translate-y-0 opacity-100"
                  : "md:pointer-events-none md:translate-y-1 md:opacity-0"
              }`}
            >
              <div className="hidden items-center gap-1 md:flex">
                <Selector
                  label="¿Qué equipo?"
                  value={equipo}
                  open={drop === "equipo"}
                  onToggle={() => setDrop((d) => (d === "equipo" ? null : "equipo"))}
                  width="w-[19rem]"
                >
                  <Opcion
                    selected={equipo === null}
                    onClick={() => {
                      setEquipo(null);
                      setDrop(null);
                    }}
                  >
                    Todavía no sé
                  </Opcion>
                  {categories.map((c) => (
                    <Opcion
                      key={c.id}
                      selected={equipo === c.name}
                      hint={String(c.count)}
                      onClick={() => {
                        setEquipo(c.name);
                        setDrop(null);
                      }}
                    >
                      {bonito(c.name)}
                    </Opcion>
                  ))}
                </Selector>

                <span aria-hidden className="h-5 w-px bg-neutral-200" />

                <Selector
                  label="Sede"
                  value={sede}
                  open={drop === "sede"}
                  onToggle={() => setDrop((d) => (d === "sede" ? null : "sede"))}
                  width="w-[15rem]"
                >
                  {SEDES.map((s) => (
                    <Opcion
                      key={s.ciudad}
                      selected={sede === s.ciudad}
                      onClick={() => {
                        setSede(s.ciudad);
                        setDrop(null);
                      }}
                    >
                      {s.ciudad}
                    </Opcion>
                  ))}
                </Selector>
              </div>

              <a
                href={cotizar}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setDrop(null)}
                className="ml-1 inline-flex h-10 shrink-0 items-center justify-center rounded-full bg-brand px-5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-deep"
              >
                Cotizar
              </a>

              <button
                type="button"
                onClick={() => {
                  setDrop(null);
                  setOpen((v) => !v);
                }}
                aria-label={open ? "Cerrar menú" : "Abrir menú"}
                aria-expanded={open}
                className="relative z-[80] flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-neutral-900 transition-colors hover:bg-neutral-100"
              >
                <MenuToggle open={open} />
              </button>
            </div>
          </div>

          {/* Hairline del estado editorial: la barra se apoya en una línea en
              vez de flotar en una caja. Desaparece al contraerse. */}
          <span
            aria-hidden
            className={`pointer-events-none absolute inset-x-0 bottom-0 hidden h-px bg-neutral-200 transition-opacity duration-300 md:block ${
              compacta ? "opacity-0" : "opacity-100"
            }`}
          />
        </div>
      </header>

      {/* Menú fullscreen. Va en portal a <body> para escapar stacking contexts;
          el fondo blanco es una capa fija sin scroll (el contenido scrollea
          aparte) para que iOS lo pinte bajo la Dynamic Island. */}
      {isClient &&
        createPortal(
          <AnimatePresence>
            {open ? (
              <motion.div
                key="menu"
                variants={menuVariants}
                initial="closed"
                animate="open"
                exit="closed"
                className="fixed inset-0 z-[60] bg-white"
              >
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(120%_80%_at_50%_-20%,rgba(43,143,217,0.14),transparent_70%)]"
                />

                {/* data-lenis-prevent: si no, Lenis se traga el wheel y el
                    menú no scrollea. */}
                <div
                  data-lenis-prevent
                  className="absolute inset-0 overflow-y-auto"
                >
                  {/* Todo se dimensiona contra el alto del viewport (clamp con
                      vh) para que el menú entre en una pantalla sin scroll ni
                      desborde. El overflow-y-auto queda solo de red por si
                      alguien está en una ventana absurdamente baja. */}
                  <div className="relative flex min-h-full flex-col px-6 pb-[calc(env(safe-area-inset-bottom)+1rem)] pt-[calc(env(safe-area-inset-top)+4.75rem)] sm:px-10 lg:px-16 xl:px-24">
                    <nav className="min-h-0 flex-1" aria-label="Menú principal">
                      <motion.p
                        variants={itemVariants}
                        className="kicker mb-[clamp(0.5rem,1.8vh,1.5rem)] text-sm"
                      >
                        Navegar
                      </motion.p>

                      <ul className="flex flex-col items-start">
                        {NAV_LINKS.map((l) => (
                          <motion.li
                            key={l.label}
                            variants={itemVariants}
                            className="py-[clamp(0.1rem,0.5vh,0.45rem)]"
                          >
                            {/* Hover: la palabra se repinta de izquierda a
                                derecha. Dos capas idénticas superpuestas; la de
                                arriba va en azul y se revela animando su ancho
                                de 0 a 100%. Mismo lenguaje que ScrollPaintText,
                                pero CSS puro. */}
                            <Link
                              href={l.href}
                              onClick={(e) => onNav(e, l.href)}
                              className="group relative inline-block font-sans text-[clamp(1.4rem,5vh,3.75rem)] font-semibold leading-[1.1] tracking-tight"
                            >
                              <span className="text-neutral-950">{l.label}</span>
                              <span
                                aria-hidden
                                className="absolute left-0 top-0 w-0 overflow-hidden whitespace-nowrap text-brand transition-[width] duration-[600ms] [transition-timing-function:var(--ease-out-expo)] group-hover:w-full"
                              >
                                {l.label}
                              </span>
                            </Link>
                          </motion.li>
                        ))}
                      </ul>
                    </nav>

                    {/* Franja de destacados al pie, a lo ancho. Los cutouts del
                        catálogo son 400x400 sin alfa (fondo blanco), así que la
                        tarjeta va blanca: cualquier panel tintado dejaría ver
                        el recuadro de la imagen. */}
                    <motion.div
                      variants={itemVariants}
                      className="mt-[clamp(1rem,3vh,3rem)] shrink-0 border-t border-neutral-200 pt-[clamp(0.75rem,2vh,1.75rem)]"
                    >
                      <div className="flex items-baseline justify-between gap-4">
                        <p className="kicker text-sm">Equipos destacados</p>
                        <Link
                          href="/equipos"
                          onClick={() => setOpen(false)}
                          className="group inline-flex items-center gap-1.5 text-sm font-medium text-neutral-600 transition-colors hover:text-brand"
                        >
                          Ver el catálogo
                          <span
                            aria-hidden
                            className="transition-transform duration-300 [transition-timing-function:var(--ease-out-expo)] group-hover:translate-x-1"
                          >
                            &rarr;
                          </span>
                        </Link>
                      </div>

                      {/* A sangre: los márgenes negativos anulan el padding del
                          contenedor para que las tarjetas lleguen a los bordes
                          y cada equipo gane ancho. gap-px sobre fondo gris deja
                          las hairlines entre tarjetas sin usar borders.
                          Siempre una sola fila: dos filas en móvil pasaban de
                          alto. */}
                      <div className="-mx-6 mt-[clamp(0.6rem,1.6vh,1.25rem)] grid grid-cols-4 gap-px bg-neutral-200 sm:-mx-10 lg:-mx-16 xl:-mx-24">
                        {DESTACADOS.map((d) => (
                          <Link
                            key={d.label}
                            href="/equipos"
                            onClick={() => setOpen(false)}
                            className="group block bg-white"
                          >
                            {/* Altura explícita, NO aspect-square + max-h: con
                                aspect-ratio las restricciones max se transfieren
                                a través del ratio, así que el max-h también
                                limitaba el ancho y la caja quedaba cuadrada y
                                pegada a la izquierda de la tarjeta. Con h fija
                                la caja ocupa todo el ancho y el flex centra. */}
                            <div className="flex h-[clamp(7rem,32vh,22rem)] w-full items-center justify-center overflow-hidden p-2 sm:p-4">
                              <Image
                                src={d.image}
                                alt={d.label}
                                width={400}
                                height={400}
                                sizes="25vw"
                                className="h-auto max-h-full w-auto max-w-full object-contain transition-transform duration-500 [transition-timing-function:var(--ease-out-expo)] group-hover:scale-105"
                              />
                            </div>
                            <div className="px-3 pb-3 sm:px-5 sm:pb-5">
                              <p className="truncate font-sans text-xs font-semibold tracking-tight text-neutral-950 sm:text-base">
                                {d.label}
                              </p>
                              <p className="mt-0.5 hidden truncate text-xs text-neutral-500 sm:block">
                                {d.linea}
                              </p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>,
          document.body
        )}
    </>
  );
}
