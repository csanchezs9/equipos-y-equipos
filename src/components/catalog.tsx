"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { categories, products } from "@/data/catalog";
import { waLink } from "@/lib/utils";

// Las 12 líneas agrupadas por etapa de obra. El orden manda en la nav.
const GROUPS: { label: string; slugs: string[] }[] = [
  {
    label: "Estructura y altura",
    slugs: [
      "andamios",
      "formaleteria-para-columna-y-muro",
      "formaleteria-para-losas",
      "equipos-de-traccion-vertical",
    ],
  },
  {
    label: "Concreto y acabado",
    slugs: ["concretadoras", "allanadoras"],
  },
  {
    label: "Compactación",
    slugs: ["vibradores-y-compactadores", "rodillos-compactadores"],
  },
  {
    label: "Corte y demolición",
    slugs: ["cortadoras", "compresores"],
  },
  {
    label: "Otros equipos",
    slugs: ["mini-cargadores", "basculas-500kgs"],
  },
];

function norm(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
      <path
        d="M20 20l-3.5-3.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Catalog() {
  const [query, setQuery] = useState("");
  const [group, setGroup] = useState<string>("all");
  const [filterOpen, setFilterOpen] = useState(false);

  const blocks = useMemo(() => {
    const q = norm(query.trim());
    const allowed =
      group === "all"
        ? null
        : new Set(GROUPS.find((g) => g.label === group)?.slugs ?? []);

    return categories
      .filter((cat) => !allowed || allowed.has(cat.slug))
      .map((cat) => {
        const items = products.filter((p) => {
          if (!p.categories.includes(cat.slug)) return false;
          if (!q) return true;
          return norm(p.name).includes(q) || norm(cat.name).includes(q);
        });
        return { cat, items };
      })
      .filter((b) => b.items.length > 0);
  }, [query, group]);

  const total = useMemo(
    () => blocks.reduce((n, b) => n + b.items.length, 0),
    [blocks]
  );

  const tabs = ["all", ...GROUPS.map((g) => g.label)];

  return (
    <section className="bg-white text-neutral-900">
      {/* Header */}
      <div className="mx-auto max-w-6xl px-6 pt-28 md:pt-32">
        <div className="flex max-w-2xl flex-col items-start text-left">
          <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-900">
            Catálogo
          </span>
          <h1 className="mt-5 font-sans text-4xl font-semibold tracking-normal text-neutral-950 md:text-5xl md:leading-tight">
            Todos los equipos, listos para tu obra
          </h1>
          <p className="mt-5 text-base leading-7 text-neutral-500">
            {products.length} equipos mantenidos y listos para despacho en
            Medellín, Pereira y Armenia. Busca el que necesitas y cotiza por
            WhatsApp.
          </p>
        </div>

        {/* Buscador */}
        <div className="mt-10 max-w-md">
          <div className="relative">
            <SearchIcon className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar equipo o línea…"
              className="h-12 w-full rounded-lg border border-neutral-200 bg-white pl-11 pr-10 text-base text-neutral-900 shadow-sm outline-none transition-colors placeholder:text-neutral-400 focus:border-neutral-400"
            />
            {query ? (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Limpiar búsqueda"
                className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700"
              >
                ✕
              </button>
            ) : null}
          </div>
        </div>

        {/* Filtros macro */}
        {/* Mobile: dropdown custom */}
        <div className="relative mt-6 sm:hidden">
          <button
            type="button"
            onClick={() => setFilterOpen((v) => !v)}
            aria-expanded={filterOpen}
            className="flex h-12 w-full items-center justify-between rounded-lg border border-neutral-200 bg-white px-4 text-base font-medium text-neutral-900 shadow-sm transition-colors hover:border-neutral-300"
          >
            <span>{group === "all" ? "Todas las líneas" : group}</span>
            <motion.svg
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden
              animate={{ rotate: filterOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              className="h-5 w-5 text-neutral-400"
            >
              <path
                d="M7 10l5 5 5-5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </motion.svg>
          </button>

          <AnimatePresence>
            {filterOpen ? (
              <>
                <button
                  type="button"
                  aria-label="Cerrar filtro"
                  onClick={() => setFilterOpen(false)}
                  className="fixed inset-0 z-20 cursor-default"
                />
                <motion.ul
                  initial={{ opacity: 0, y: -6, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.98 }}
                  transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                  style={{ originY: 0 }}
                  className="absolute left-0 right-0 top-full z-30 mt-2 overflow-hidden rounded-xl border border-neutral-200 bg-white p-1.5 shadow-xl"
                >
                  {tabs.map((t) => {
                    const on = group === t;
                    return (
                      <li key={t}>
                        <button
                          type="button"
                          onClick={() => {
                            setGroup(t);
                            setFilterOpen(false);
                          }}
                          className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-base font-medium transition-colors ${
                            on
                              ? "bg-neutral-100 text-neutral-900"
                              : "text-neutral-600 hover:bg-neutral-50"
                          }`}
                        >
                          {t === "all" ? "Todas las líneas" : t}
                          {on ? (
                            <svg
                              viewBox="0 0 24 24"
                              fill="none"
                              aria-hidden
                              className="h-4 w-4 text-neutral-900"
                            >
                              <path
                                d="M5 12l5 5L20 7"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          ) : null}
                        </button>
                      </li>
                    );
                  })}
                </motion.ul>
              </>
            ) : null}
          </AnimatePresence>
        </div>

        {/* Desktop: segmented control con pastilla deslizante */}
        <div className="mt-6 hidden flex-wrap gap-1 rounded-full bg-neutral-100 p-1 sm:inline-flex">
          {tabs.map((t) => {
            const on = group === t;
            const label = t === "all" ? "Todos" : t;
            return (
              <button
                key={t}
                type="button"
                onClick={() => setGroup(t)}
                className="relative whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors"
              >
                {on ? (
                  <motion.span
                    layoutId="filterPill"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    className="absolute inset-0 rounded-full bg-neutral-900"
                  />
                ) : null}
                <span
                  className={`relative z-10 ${
                    on ? "text-white" : "text-neutral-500 hover:text-neutral-900"
                  }`}
                >
                  {label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Resultados */}
      <div className="mx-auto max-w-6xl px-6 pb-24 pt-10 md:pb-32">
        {query ? (
          <p className="mb-2 text-sm text-neutral-500">
            {total} {total === 1 ? "equipo" : "equipos"} para “{query}”
          </p>
        ) : null}

        {blocks.length === 0 ? (
          <div className="mt-16 flex flex-col items-center text-center">
            <h2 className="font-sans text-xl font-semibold text-neutral-950">
              {query ? `Sin resultados para “${query}”` : "Sin equipos en esta línea"}
            </h2>
            <p className="mt-2 max-w-sm text-sm leading-6 text-neutral-500">
              Escríbenos por WhatsApp y te ayudamos a ubicar lo que necesitas.
            </p>
            <a
              href={waLink(
                `Hola Equipos y Equipos, busco ${
                  query ? `"${query}"` : "un equipo"
                } para alquilar. ¿Lo tienen?`
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex h-10 items-center justify-center rounded-md bg-neutral-900 px-5 text-sm font-medium text-white transition-colors hover:bg-neutral-900/90"
            >
              Preguntar por WhatsApp
            </a>
          </div>
        ) : (
          blocks.map(({ cat, items }) => (
            <div key={cat.slug} className="pt-12 first:pt-0 md:pt-16">
              <div className="flex items-baseline justify-between gap-4 border-b border-neutral-200 pb-4">
                <h2 className="font-sans text-2xl font-semibold tracking-normal text-neutral-950 md:text-3xl">
                  {cat.name}
                </h2>
                <span className="shrink-0 font-mono text-sm tabular-nums text-neutral-400">
                  {items.length}
                </span>
              </div>

              <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-5">
                {items.map((p) => (
                  <article
                    key={p.id}
                    className="group flex flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white transition-shadow hover:shadow-md"
                  >
                    <div className="relative aspect-square overflow-hidden bg-neutral-50">
                      {p.image ? (
                        <Image
                          src={p.image}
                          alt={p.name}
                          fill
                          sizes="(max-width: 768px) 50vw, 25vw"
                          className="object-contain p-5 transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : null}
                    </div>

                    <div className="flex flex-1 flex-col p-4">
                      <h3 className="mb-4 font-sans text-sm font-medium leading-snug text-neutral-950">
                        {p.name}
                      </h3>
                      <a
                        href={waLink(
                          `Hola Equipos y Equipos, quiero cotizar el alquiler de: ${p.name}.`
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-auto inline-flex h-9 w-full items-center justify-center gap-1.5 whitespace-nowrap rounded-md bg-neutral-900 px-3 text-sm font-medium text-white transition-colors hover:bg-neutral-900/90"
                      >
                        Cotizar
                      </a>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
