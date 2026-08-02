"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/data/catalog";
import { ArrowRight, WhatsAppIcon } from "@/components/icons";
import { WHATSAPP_DISPLAY, waLink } from "@/lib/utils";

// Lista de equipos destacados con voz humana — NADA de inventario en vivo
// (la empresa no lo maneja). Cada fila muestra el equipo y para qué sirve, con
// su descripción real del catálogo. El hover "enciende" la ficha grande a la
// derecha, donde se habla con un asesor de verdad por WhatsApp.

function waMessage(name: string) {
  return `Hola Equipos y Equipos 👋 Me interesa alquilar el ${name}. ¿Me cuentan disponibilidad y precio?`;
}

export function DispatchBoard({ products }: { products: Product[] }) {
  const [active, setActive] = useState(0);
  const current = products[active];

  return (
    <div
      data-reveal
      className="grid gap-8 lg:grid-cols-[1fr_minmax(0,400px)] lg:items-start"
    >
      {/* COLUMNA IZQ — la lista */}
      <div className="min-w-0 rounded-2xl border border-white/10 bg-white/[0.03]">
        {/* Cabecera humana: dónde estamos + que contesta una persona */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-4 py-4 text-sm text-ink/60 sm:px-5">
          <span className="flex items-center gap-2">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              className="h-4 w-4 shrink-0 text-brand-glow"
              aria-hidden
            >
              <path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z" />
              <circle cx="12" cy="10" r="2.5" />
            </svg>
            Estamos en Itagüí y llevamos a toda Antioquia
          </span>
          <span className="text-ink/45">Nos escribes y te respondemos de una</span>
        </div>

        {/* Encabezado de columnas (sans, sin mono) */}
        <div className="hidden grid-cols-[3rem_1fr_auto] gap-4 px-5 pb-2 pt-3 text-xs text-ink/35 md:grid">
          <span>#</span>
          <span>Equipo</span>
          <span className="text-right">Categoría</span>
        </div>

        {/* Filas */}
        <ul>
          {products.map((p, i) => {
            const isActive = i === active;
            return (
              <li key={p.id}>
                <Link
                  href={`/equipos/${p.slug}`}
                  data-active={isActive}
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  className="group flex items-center gap-3 border-l-2 border-transparent border-b border-white/[0.07] px-4 py-[1.1rem] transition-colors last:border-b-0 hover:bg-white/[0.04] data-[active=true]:border-l-brand-glow data-[active=true]:bg-white/[0.05] sm:gap-4 sm:px-5 md:grid md:grid-cols-[3rem_1fr_auto] md:items-center"
                >
                  {/* Número de lista (no es stock, es orden) */}
                  <span className="font-mono text-xs tabular-nums text-ink/40 transition-colors group-hover:text-brand-glow">
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  {/* Miniatura (solo mobile) + nombre */}
                  <span className="flex min-w-0 flex-1 items-center gap-3 md:flex-none">
                    <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-white md:hidden">
                      {p.image && (
                        <Image
                          src={p.image}
                          alt={p.name}
                          fill
                          sizes="40px"
                          className="object-contain p-1"
                        />
                      )}
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate font-display text-base leading-tight text-ink">
                        {p.name}
                      </span>
                      {/* Categoría bajo el nombre — solo mobile */}
                      {p.categoryNames[0] && (
                        <span className="block truncate text-xs text-ink/40 md:hidden">
                          {p.categoryNames[0]}
                        </span>
                      )}
                    </span>
                  </span>

                  {/* Categoría — columna corta (desktop), alineada a la derecha */}
                  <span className="hidden items-center justify-end gap-3 text-sm text-ink/55 md:flex">
                    <span className="truncate">{p.categoryNames[0]}</span>
                    <ArrowRight className="h-4 w-4 shrink-0 text-ink/20 transition-all group-hover:translate-x-0.5 group-hover:text-brand-glow" />
                  </span>

                  <ArrowRight className="ml-auto h-4 w-4 shrink-0 text-ink/30 transition-all group-hover:translate-x-0.5 group-hover:text-brand-glow md:hidden" />
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Pie humano */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-white/10 px-5 py-3.5 text-sm text-ink/50">
          <span>¿No ves el que buscas? Tenemos mucha más flota.</span>
          <Link
            href="/equipos"
            className="group inline-flex items-center gap-1.5 font-medium text-ink/80 transition-colors hover:text-brand-glow"
          >
            Ver todo el catálogo
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>

      {/* COLUMNA DER — ficha que se "enciende" + asesor real */}
      <div className="hidden lg:block">
        <div className="sticky top-28 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
          <div className="relative aspect-video bg-white">
            {current.image && (
              <Image
                key={current.id}
                src={current.image}
                alt={current.name}
                fill
                sizes="400px"
                className="object-contain p-8 [animation:fadeIn_0.5s_var(--ease-out-expo)]"
              />
            )}
          </div>

          <div className="p-6">
            <span className="text-xs font-medium text-ink/45">
              {current.categoryNames[0] ?? "Equipo"}
            </span>
            <h3 className="mt-1 line-clamp-2 min-h-[2.5em] font-display text-2xl leading-tight text-ink">
              {current.name}
            </h3>
            <p className="mt-3 line-clamp-3 min-h-[3.75rem] text-sm text-ink/55">
              {current.description}
            </p>

            <div className="mt-6 flex flex-col gap-2">
              <a
                href={waLink(waMessage(current.name))}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-center gap-2 rounded-full bg-brand-glow px-5 py-3 text-sm font-semibold text-bone transition-colors hover:bg-white"
              >
                <WhatsAppIcon className="h-4 w-4" />
                Preguntar por este equipo
              </a>
              <Link
                href={`/equipos/${current.slug}`}
                className="group flex items-center justify-center gap-2 rounded-full border border-white/15 px-5 py-3 text-sm font-medium text-ink transition-colors hover:border-white/40"
              >
                Ver ficha completa
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>

            {/* Toque humano: número real, persona detrás */}
            <p className="mt-4 text-center text-xs text-ink/40">
              Te responde un asesor al {WHATSAPP_DISPLAY}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
