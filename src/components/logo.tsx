import { cn } from "@/lib/utils";

/**
 * Wordmark Equipos & Equipos. Tipografico (no PNG con fondo blanco):
 * nitido sobre lienzo oscuro y escalable. Mantiene la identidad del logo
 * (palabras en azul, "&" y "S.A.S" en ambar) + una cercha como mark.
 */
export function Logo({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2.5 font-display font-bold leading-none tracking-tight",
        className
      )}
    >
      {/* Mark: cercha / techo en ambar */}
      <svg
        viewBox="0 0 40 24"
        className="h-[0.95em] w-auto text-hazard"
        fill="none"
        aria-hidden
      >
        <path d="M2 22 20 4l18 18" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M7 22 20 11l13 11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" opacity="0.7" />
      </svg>
      <span className="text-[1em]">
        <span className="text-brand-glow">Equipos</span>
        <span className="text-hazard">&amp;</span>
        <span className="text-brand-glow">Equipos</span>
        <span className="ml-1 align-top text-[0.42em] font-semibold tracking-normal text-hazard">
          S.A.S
        </span>
      </span>
      <span className="sr-only">Equipos y Equipos S.A.S</span>
    </span>
  );
}
