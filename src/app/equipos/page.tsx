import type { Metadata } from "next";
import { Suspense } from "react";
import { Catalog } from "@/components/catalog";

export const metadata: Metadata = {
  title: "Catálogo de equipos",
  description:
    "Catálogo completo de equipos para construcción en alquiler: andamios, formaletería, concretadoras, vibradores, rodillos, compresores y más. Medellín, Pereira y Armenia.",
  alternates: { canonical: "/equipos" },
};

export default function EquiposPage() {
  // Catalog lee ?linea con useSearchParams, que fuerza render en cliente hasta
  // el Suspense más cercano. Con este boundary la ruta se sigue prerenderizando
  // y solo el catálogo se hidrata.
  return (
    <Suspense fallback={<div className="min-h-svh bg-white" />}>
      <Catalog />
    </Suspense>
  );
}
