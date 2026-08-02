import { ScrollTiltedGrid } from "@/components/ui/scroll-tilted-grid";
import { Stats, type Stat } from "@/components/stat-counter";

const STATS: Stat[] = [
  { value: "3", label: "sedes: Medellín, Pereira y Armenia" },
  { value: "+12", label: "líneas de equipo para toda la obra" },
  { value: "24h", label: "respuesta para cotizar y despachar" },
];

export function Nosotros() {
  return (
    <section id="nosotros" className="relative overflow-hidden bg-white text-neutral-900">
      <div className="mx-auto max-w-3xl px-6 pt-20 text-center md:pt-28">
        <span className="rounded-full border border-hazard bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-900">
          Nosotros
        </span>
        <h2 className="mt-5 font-sans text-4xl font-semibold tracking-normal text-neutral-950 md:text-5xl md:leading-tight">
          Equipos que responden, gente que acompaña
        </h2>
        <p className="mt-6 text-base leading-7 text-neutral-500">
          En Equipos y Equipos llevamos años alquilando maquinaria para
          construcción en el Eje Cafetero y Antioquia. No solo entregamos el
          equipo: lo mantenemos a punto, lo despachamos a tu obra y estamos
          pendientes para que nada se te detenga.
        </p>

        <Stats stats={STATS} />
      </div>

      <ScrollTiltedGrid maxWidth="xl" gap={8} rounded="0.75rem" />
    </section>
  );
}
