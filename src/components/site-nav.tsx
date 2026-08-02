"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { gsap } from "gsap";
import { categories } from "@/data/catalog";
import { SEDES, waLink } from "@/lib/utils";
import { scrollToEl } from "@/components/smooth-scroll";

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
  const arriba = useRef<SVGPathElement>(null);
  const medio = useRef<SVGPathElement>(null);
  const abajo = useRef<SVGPathElement>(null);

  // GSAP interpola los números dentro del atributo `d`. Funciona porque las
  // tres rectas tienen la misma estructura de comandos (M x y L x y): solo
  // cambian las coordenadas.
  useEffect(() => {
    const t = gsap.timeline();
    t.to(
      arriba.current,
      {
        attr: { d: open ? "M5 5 L19 19" : "M3 7 L21 7" },
        duration: 0.3,
        ease: "expo.out",
      },
      0
    )
      .to(medio.current, { opacity: open ? 0 : 1, duration: 0.2 }, 0)
      .to(
        abajo.current,
        {
          attr: { d: open ? "M5 19 L19 5" : "M3 17 L21 17" },
          duration: 0.3,
          ease: "expo.out",
        },
        0
      );
    return () => {
      t.kill();
    };
  }, [open]);

  const linea = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
  };

  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden>
      <path ref={arriba} {...linea} d={open ? "M5 5 L19 19" : "M3 7 L21 7"} />
      <path ref={medio} {...linea} d="M3 12 L21 12" opacity={open ? 0 : 1} />
      <path ref={abajo} {...linea} d={open ? "M5 19 L19 5" : "M3 17 L21 17"} />
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

      {/* Siempre montado. invisible (visibility:hidden) lo saca del foco y del
          árbol de accesibilidad, así se puede animar la salida sin coordinar un
          desmontaje diferido. */}
      <div
        role="listbox"
        aria-label={label}
        className={`absolute left-0 top-[calc(100%+0.65rem)] z-50 ${width} overflow-hidden rounded-2xl border border-neutral-200 bg-white p-1.5 shadow-xl shadow-neutral-900/10 transition-all duration-200 [transition-timing-function:var(--ease-out-expo)] ${
          open
            ? "visible translate-y-0 opacity-100"
            : "invisible -translate-y-1.5 opacity-0"
        }`}
      >
        <div className="max-h-[19rem] overflow-y-auto overscroll-contain">
          {children}
        </div>
      </div>
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

// Franja de destacados del menú. Selección a mano: el catálogo no tiene dato
// de popularidad ni de alquileres, solo cuántos productos hay por línea.
// `nombre` es el del catálogo; `label` es la versión corta para la tarjeta.
// Elegidas por encuadre: las cuatro llenan el cuadro, van centradas y no
// tienen personas dentro (compresor.png y rana.png sí, y descuadran la grilla).
// `slug` es el del producto en catalog.ts: la tarjeta lleva a su ficha.
// `label` es la versión corta, porque el nombre del catálogo no entra.
const DESTACADOS = [
  {
    slug: "mini-cargador-caterpillar-236b2-con-pala",
    label: "Mini-cargador",
    linea: "Mini-cargadores",
    image: "/equipos/minicargador-con-pala.png",
  },
  {
    slug: "rodillo-compactador-dd-24-ingersoll-rand",
    label: "Rodillo compactador",
    linea: "Rodillos compactadores",
    image: "/equipos/dd24.png",
  },
  {
    slug: "cortadora-de-piso",
    label: "Cortadora de piso",
    linea: "Cortadoras",
    image: "/equipos/cortadora-de-piso.png",
  },
  {
    slug: "allanadoras-de-36-con-aspas",
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
  const contenidoRef = useRef<HTMLDivElement>(null);
  const isClient = useIsClient();

  // El estado editorial solo existe arriba del todo. 80px basta: apenas te
  // movés, la barra ya es cotizador.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // data-nav-open en <html> dispara el empuje del contenido (.nav-push /
  // .nav-push-fixed en globals.css). El scroll se bloquea con overflow del
  // body, que con scroll nativo alcanza y sobra.
  useEffect(() => {
    const root = document.documentElement;
    if (!open) {
      delete root.dataset.navOpen;
      return;
    }

    root.dataset.navOpen = "true";
    const previo = document.body.style.overflow;
    // Compensa el ancho de la barra de scroll para que la página no pegue un
    // salto lateral al ocultarla (en macOS con barras superpuestas da 0).
    const barra = window.innerWidth - root.clientWidth;
    document.body.style.overflow = "hidden";
    if (barra > 0) document.body.style.paddingRight = `${barra}px`;

    return () => {
      delete root.dataset.navOpen;
      document.body.style.overflow = previo;
      document.body.style.paddingRight = "";
    };
  }, [open]);

  // Stagger del contenido del panel. Reemplaza menuVariants/itemVariants: los
  // hijos marcados con data-stagger entran en cascada al abrir y se repliegan
  // al cerrar.
  useEffect(() => {
    const cont = contenidoRef.current;
    if (!cont) return;

    const items = cont.querySelectorAll<HTMLElement>("[data-stagger]");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduce) {
      gsap.set(items, { y: 0, opacity: 1 });
      gsap.set(cont, { opacity: 1 });
      return;
    }

    const tl = gsap.timeline();
    if (open) {
      tl.to(cont, { opacity: 1, duration: 0.25, ease: "expo.out" }, 0).fromTo(
        items,
        { y: 18, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.45, ease: "expo.out", stagger: 0.05 },
        0.08
      );
    } else {
      tl.to(items, { y: 18, opacity: 0, duration: 0.2 }, 0).to(
        cont,
        { opacity: 0, duration: 0.2 },
        0
      );
    }

    return () => {
      tl.kill();
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

      // Desbloquear ACÁ y no dejarlo al efecto de `open`: setOpen es asíncrono,
      // el efecto que quita el overflow del body corre después de este handler,
      // y para entonces el tween ya arrancó contra un body bloqueado. No puede
      // mover la página, el autoKill lo lee como interferencia y lo mata. El
      // efecto igual va a dejar estos mismos valores al desmontar el bloqueo.
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";

      scrollToEl(el, 80);
    } else {
      sessionStorage.setItem("scrollTarget", hash);
      router.push("/");
    }
  }

  return (
    <>
      {/* nav-push-fixed: la barra se corre con el resto del contenido, así el
          empuje se lee como una sola pieza y no queda flotando sobre el panel.
          Seguro porque el header no usa utilidades translate-* propias. */}
      <header
        data-analytics-zone="navbar"
        className="nav-push-fixed fixed inset-x-0 top-0 z-[70] flex justify-center px-3 pt-[calc(env(safe-area-inset-top)+0.5rem)] sm:px-4 sm:pt-[calc(env(safe-area-inset-top)+0.7rem)]"
      >
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

      {/* Panel lateral. Va en portal a <body> para escapar stacking contexts.
          Se queda SIEMPRE montado y se mueve con una transición CSS: así usa
          exactamente la misma duración y easing que el empuje del contenido
          (.nav-push en globals.css) y las dos capas viajan pegadas. Con
          montaje/desmontaje era imposible sincronizarlas. */}
      {isClient &&
        createPortal(
          <>
            {/* Capa transparente: clic sobre el contenido corrido para cerrar.
                Sin oscurecer, para que el empuje se lea como empuje y no como
                un modal con backdrop. */}
            <div
              aria-hidden
              onClick={() => setOpen(false)}
              className={`fixed inset-0 z-[62] ${open ? "" : "pointer-events-none"}`}
            />

            <aside
              aria-label="Menú"
              data-analytics-zone="menu"
              inert={!open}
              className={`fixed right-0 top-0 z-[65] flex h-full w-[var(--nav-panel-w)] flex-col border-l border-neutral-200 bg-white shadow-2xl shadow-neutral-950/10 transition-transform duration-700 [transition-timing-function:var(--ease-out-expo)] ${
                open ? "translate-x-0" : "translate-x-full"
              }`}
            >
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-[radial-gradient(120%_80%_at_50%_-20%,rgba(43,143,217,0.14),transparent_70%)]"
              />

              {/* Cerrar propio del panel: en móvil el panel ocupa 100vw y la
                  píldora queda fuera de pantalla, así que su X no alcanza. */}
              <div className="relative flex justify-end px-5 pt-[calc(env(safe-area-inset-top)+1rem)] sm:px-7">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Cerrar menú"
                  className="flex h-10 w-10 items-center justify-center rounded-full text-neutral-900 transition-colors hover:bg-neutral-100"
                >
                  <MenuToggle open />
                </button>
              </div>

              <div
                ref={contenidoRef}
                className="relative flex flex-1 flex-col overflow-y-auto overscroll-contain px-5 pb-[calc(env(safe-area-inset-bottom)+1.25rem)] pt-2 sm:px-7"
              >
                <nav className="flex-1" aria-label="Menú principal">
                  <p data-stagger className="kicker mb-3 text-sm">
                    Navegar
                  </p>

                  <ul className="flex flex-col items-start">
                    {NAV_LINKS.map((l) => (
                      <li
                        key={l.label}
                        data-stagger
                        className="py-[clamp(0.1rem,0.5vh,0.4rem)]"
                      >
                        {/* Hover: la palabra se repinta de izquierda a derecha.
                            Dos capas idénticas superpuestas; la de arriba va en
                            azul y se revela animando su ancho de 0 a 100%.
                            Mismo lenguaje que ScrollPaintText, pero CSS puro. */}
                        <Link
                          href={l.href}
                          onClick={(e) => onNav(e, l.href)}
                          className="group relative inline-block font-sans text-[clamp(1.5rem,4vh,2.25rem)] font-semibold leading-[1.15] tracking-tight"
                        >
                          <span className="text-neutral-950">{l.label}</span>
                          <span
                            aria-hidden
                            className="absolute left-0 top-0 w-0 overflow-hidden whitespace-nowrap text-brand transition-[width] duration-[600ms] [transition-timing-function:var(--ease-out-expo)] group-hover:w-full"
                          >
                            {l.label}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>

                {/* Destacados. En el panel angosto van 2x2, no 4 en fila. Los
                    cutouts del catálogo son 400x400 sin alfa (fondo blanco), así
                    que la tarjeta va blanca: un panel tintado dejaría ver el
                    recuadro de la imagen. */}
                <div
                  data-stagger
                  className="mt-6 shrink-0 border-t border-neutral-200 pt-5"
                >
                  <div className="flex items-baseline justify-between gap-4">
                    <p className="kicker text-sm">Equipos destacados</p>
                    <Link
                      href="/equipos"
                      onClick={() => setOpen(false)}
                      className="group inline-flex items-center gap-1.5 text-sm font-medium text-hazard transition-colors hover:text-hazard-deep"
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

                  {/* A sangre dentro del panel: los márgenes negativos anulan su
                      padding. gap-px sobre fondo gris dibuja las hairlines sin
                      usar borders. */}
                  <div className="-mx-5 mt-4 grid grid-cols-2 gap-px bg-neutral-200 sm:-mx-7">
                    {DESTACADOS.map((d) => (
                      <Link
                        key={d.slug}
                        href={`/equipos/${d.slug}`}
                        onClick={() => setOpen(false)}
                        className="group block bg-white"
                      >
                        {/* Altura explícita, NO aspect-square + max-h: con
                            aspect-ratio las restricciones max se transfieren a
                            través del ratio, así que el max-h limitaba también
                            el ancho y la caja quedaba pegada a la izquierda. */}
                        <div className="flex h-[clamp(6rem,15vh,10rem)] w-full items-center justify-center overflow-hidden p-3">
                          <Image
                            src={d.image}
                            alt={d.label}
                            width={400}
                            height={400}
                            sizes="(min-width: 640px) 16rem, 50vw"
                            className="h-auto max-h-full w-auto max-w-full object-contain transition-transform duration-500 [transition-timing-function:var(--ease-out-expo)] group-hover:scale-105"
                          />
                        </div>
                        <div className="px-4 pb-4">
                          <p className="truncate font-sans text-sm font-semibold tracking-tight text-neutral-950">
                            {d.label}
                          </p>
                          <p className="mt-0.5 truncate text-xs text-neutral-500">
                            {d.linea}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </aside>
          </>,
          document.body
        )}
    </>
  );
}
