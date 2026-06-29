import Link from "next/link";
import { ArrowRight } from "@/components/icons";

export default function NotFound() {
  return (
    <section className="container-x flex min-h-svh flex-col items-center justify-center py-40 text-center">
      <h1 className="display-xl">Sin señal</h1>
      <p className="mt-6 max-w-sm text-balance text-mute">
        Esta página no existe o el equipo fue movido de obra.
      </p>
      <Link
        href="/"
        className="mt-10 inline-flex items-center gap-2 rounded-full bg-brand px-7 py-4 font-semibold text-white transition-colors hover:bg-brand-glow"
      >
        Volver al inicio
        <ArrowRight />
      </Link>
    </section>
  );
}
