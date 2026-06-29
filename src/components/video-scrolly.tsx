import Link from "next/link";
import { ArrowRight } from "@/components/icons";

// Hero simple: un solo video de fondo a pantalla completa. Texto + CTA encima.
export function VideoScrolly() {
  return (
    <section
      data-video-hero
      className="relative isolate h-svh overflow-hidden bg-black"
    >
      <video
        className="absolute inset-0 h-full w-full object-cover"
        src="/videos/hero.mp4"
        muted
        loop
        playsInline
        autoPlay
        preload="auto"
      />

      {/* Scrims para legibilidad */}
      <div className="absolute inset-0 z-[5] bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
      <div className="absolute inset-x-0 top-0 z-[5] h-28 bg-gradient-to-b from-black/50 to-transparent" />

      {/* Texto */}
      <div className="container-x relative z-10 flex h-full items-end pb-16 md:pb-24">
        <div>
          <h2 className="font-display font-bold text-white display-lg">
            <span className="block">Maquinaria que</span>
            <span className="block text-brand-glow">no para tu obra.</span>
          </h2>
          <p className="mt-5 max-w-md text-balance text-white/75">
            Equipos certificados y mantenidos, listos para producir desde el
            primer día.
          </p>

          <div className="mt-9">
            <Link
              href="/equipos"
              className="group relative inline-flex items-center gap-4 overflow-hidden rounded-full bg-brand py-2.5 pl-8 pr-2.5 text-base font-bold text-white shadow-[0_12px_45px_-12px] shadow-black/40 transition-all duration-500 [transition-timing-function:var(--ease-out-expo)] hover:-translate-y-0.5 hover:bg-brand-deep md:text-lg"
            >
              <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 [transition-timing-function:var(--ease-out-expo)] group-hover:translate-x-full" />
              <span className="relative block overflow-hidden">
                <span className="block transition-transform duration-400 [transition-timing-function:var(--ease-out-expo)] group-hover:-translate-y-full">
                  Ver catálogo
                </span>
                <span
                  aria-hidden
                  className="absolute inset-0 block translate-y-full transition-transform duration-400 [transition-timing-function:var(--ease-out-expo)] group-hover:translate-y-0"
                >
                  Ver catálogo
                </span>
              </span>
              <span className="relative flex h-11 w-11 items-center justify-center rounded-full bg-white text-brand transition-transform duration-500 [transition-timing-function:var(--ease-out-expo)] group-hover:translate-x-1">
                <ArrowRight />
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* Hint de scroll */}
      <div className="absolute bottom-5 left-1/2 z-10 -translate-x-1/2 text-[0.7rem] font-medium tracking-wide text-white/50">
        Scroll
      </div>
    </section>
  );
}
