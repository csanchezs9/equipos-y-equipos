"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { categories } from "@/data/catalog";

export function CategoryStrip() {
  const params = useSearchParams();
  const active = params.get("categoria") ?? null;

  return (
    <div className="border-b border-line bg-ink-2">
      <div className="container-x">
        <div className="flex items-center gap-2 overflow-x-auto py-3 scrollbar-hide">
          {/* Todos */}
          <Link
            href="/equipos"
            className={`shrink-0 rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
              !active
                ? "border-brand bg-brand text-white"
                : "border-line bg-ink text-mute hover:border-brand/40 hover:text-bone"
            }`}
          >
            Todos
          </Link>

          {categories.map((cat) => {
            const isActive = active === cat.slug;
            return (
              <Link
                key={cat.slug}
                href={`/equipos?categoria=${cat.slug}`}
                className={`shrink-0 rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "border-brand bg-brand text-white"
                    : "border-line bg-ink text-mute hover:border-brand/40 hover:text-bone"
                }`}
              >
                {cat.name}
                <span className="ml-1.5 font-mono tabular-nums text-xs opacity-60">
                  {cat.count}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
