"use client";

import { useMemo, useState } from "react";
import { ProductCard } from "@/components/product-card";
import { SearchIcon, CloseIcon, ArrowDown } from "@/components/icons";
import type { Category, Product } from "@/data/catalog";
import { cn } from "@/lib/utils";

export function CatalogGrid({
  products,
  categories,
  initialCategory,
}: {
  products: Product[];
  categories: Category[];
  initialCategory?: string;
}) {
  const [cat, setCat] = useState<string>(initialCategory ?? "all");
  const [q, setQ] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const inCat = cat === "all" || p.categories.includes(cat);
      const inQ =
        !q ||
        p.name.toLowerCase().includes(q.toLowerCase()) ||
        p.description.toLowerCase().includes(q.toLowerCase());
      return inCat && inQ;
    });
  }, [products, cat, q]);

  const items = [
    { slug: "all", name: "Todos los equipos", count: products.length },
    ...categories.map((c) => ({ slug: c.slug, name: c.name, count: c.count })),
  ];
  const activeName = items.find((i) => i.slug === cat)?.name ?? "Todos los equipos";

  return (
    <div className="grid gap-10 lg:grid-cols-[clamp(220px,22vw,300px)_1fr] lg:gap-16">
      {/* RAIL DE FILTROS */}
      <aside className="lg:sticky lg:top-24 lg:self-start">
        {/* Buscador */}
        <div className="group relative mb-8">
          <SearchIcon className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-mute transition-colors group-focus-within:text-brand" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar equipo…"
            className="w-full rounded-full border border-line bg-ink-2 py-3 pl-11 pr-10 text-sm text-bone outline-none transition-colors placeholder:text-mute focus:border-brand"
          />
          {q && (
            <button
              onClick={() => setQ("")}
              aria-label="Limpiar búsqueda"
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-mute transition-colors hover:text-bone"
            >
              <CloseIcon />
            </button>
          )}
        </div>

        {/* DROPDOWN — solo móvil */}
        <div className="relative lg:hidden">
          <button
            onClick={() => setFilterOpen((v) => !v)}
            aria-expanded={filterOpen}
            className="flex w-full items-center justify-between rounded-2xl border border-line bg-ink-2 px-5 py-3.5 text-left"
          >
            <span className="flex items-baseline gap-2">
              <span className="text-[0.72rem] font-medium text-mute">
                Categoría
              </span>
              <span className="font-medium text-bone">{activeName}</span>
            </span>
            <ArrowDown
              className={cn("text-mute transition-transform duration-300", filterOpen && "rotate-180")}
            />
          </button>

          <div
            className={cn(
              "grid transition-all duration-300 [transition-timing-function:var(--ease-out-expo)]",
              filterOpen ? "mt-2 grid-rows-[1fr]" : "grid-rows-[0fr]"
            )}
          >
            <div className="min-h-0 overflow-hidden">
              <div className="overflow-hidden rounded-2xl border border-line bg-ink-2">
                {items.map((it) => {
                  const active = cat === it.slug;
                  return (
                    <button
                      key={it.slug}
                      onClick={() => {
                        setCat(it.slug);
                        setFilterOpen(false);
                      }}
                      className={cn(
                        "flex w-full items-center justify-between border-b border-line px-5 py-3 text-left text-sm transition-colors last:border-b-0",
                        active ? "bg-ink-3 text-bone" : "text-mute"
                      )}
                    >
                      <span className="flex items-center gap-2.5">
                        <span
                          className={cn(
                            "h-1.5 w-1.5 rounded-full",
                            active ? "bg-brand" : "bg-line"
                          )}
                        />
                        <span className={cn(active && "font-medium")}>{it.name}</span>
                      </span>
                      <span
                        className={cn(
                          "font-mono text-xs tabular-nums",
                          active ? "text-brand" : "text-mute/70"
                        )}
                      >
                        {String(it.count).padStart(2, "0")}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <p className="kicker mb-4 hidden lg:block">Categorías</p>

        {/* RAIL — solo desktop */}
        <nav className="hidden lg:flex lg:flex-col lg:border-l lg:border-line">
          {items.map((it) => {
            const active = cat === it.slug;
            return (
              <button
                key={it.slug}
                onClick={() => setCat(it.slug)}
                className={cn(
                  "group relative flex items-center justify-between gap-4 py-2.5 pl-5 text-left text-[0.95rem] transition-colors",
                  active ? "text-bone" : "text-mute hover:text-bone"
                )}
              >
                <span
                  className={cn(
                    "absolute left-0 top-1/2 w-0.5 -translate-y-1/2 rounded-full bg-brand transition-all duration-300",
                    active ? "h-6" : "h-0 group-hover:h-3"
                  )}
                />
                <span className={cn(active && "font-medium")}>{it.name}</span>
                <span
                  className={cn(
                    "font-mono text-xs tabular-nums transition-colors",
                    active ? "text-brand" : "text-mute/70"
                  )}
                >
                  {String(it.count).padStart(2, "0")}
                </span>
              </button>
            );
          })}
        </nav>
      </aside>

      {/* RESULTADOS */}
      <div>
        <div className="mb-8 flex items-center justify-between border-b border-line pb-5">
          <p className="text-sm font-medium text-mute">
            {filtered.length} {filtered.length === 1 ? "equipo" : "equipos"}
          </p>
          {(cat !== "all" || q) && (
            <button
              onClick={() => {
                setCat("all");
                setQ("");
              }}
              className="text-sm font-medium text-mute transition-colors hover:text-brand"
            >
              Limpiar
            </button>
          )}
        </div>

        {filtered.length > 0 && (
          <div className="grid grid-cols-2 gap-3 sm:gap-6 xl:grid-cols-3">
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} reveal={false} />
            ))}
          </div>
        )}

        {filtered.length === 0 && (
          <div
            className="relative overflow-hidden rounded-2xl border border-line bg-ink-2 p-16 text-center"
            style={{
              backgroundImage:
                "radial-gradient(var(--color-line) 1px, transparent 1px)",
              backgroundSize: "16px 16px",
            }}
          >
            <div className="relative mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-ink-3">
              <SearchIcon className="h-5 w-5 text-mute" />
            </div>
            <p className="relative mt-5 font-display text-2xl">Sin resultados</p>
            <p className="relative mx-auto mt-2 max-w-xs text-mute">
              No encontramos nada para esa categoría o término. Prueba con otra
              búsqueda.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
