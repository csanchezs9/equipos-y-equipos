import type { Metadata } from "next";
import { Catalog } from "@/components/catalog";

export const metadata: Metadata = {
  title: "Catálogo de equipos",
  description:
    "Catálogo completo de equipos para construcción en alquiler: andamios, formaletería, concretadoras, vibradores, rodillos, compresores y más. Medellín, Pereira y Armenia.",
  alternates: { canonical: "/equipos" },
};

export default function EquiposPage() {
  return <Catalog />;
}
