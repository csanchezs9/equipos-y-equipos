import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function ArrowRight({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={cn("h-4 w-4", className)}
      aria-hidden
    >
      <path
        d="M5 12h14M13 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ArrowDown({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={cn("h-4 w-4", className)}
      aria-hidden
    >
      <path
        d="M12 5v14M6 13l6 6 6-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function SearchIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={cn("h-4 w-4", className)} aria-hidden>
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
      <path d="m20 20-3.2-3.2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function CloseIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={cn("h-4 w-4", className)} aria-hidden>
      <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={cn("h-5 w-5", className)} fill="currentColor" aria-hidden>
      <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 1.67c2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.42 5.82c0 4.54-3.7 8.24-8.25 8.24a8.2 8.2 0 0 1-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24Zm-2.7 4.43c-.13 0-.34.05-.52.24-.18.2-.69.68-.69 1.65 0 .98.71 1.92.81 2.05.1.13 1.39 2.12 3.37 2.97.47.2.84.33 1.13.42.47.15.9.13 1.24.08.38-.06 1.17-.48 1.33-.94.16-.46.16-.86.12-.94-.05-.08-.18-.13-.38-.23-.2-.1-1.17-.58-1.35-.64-.18-.07-.31-.1-.44.1-.13.2-.5.64-.62.77-.11.13-.23.15-.42.05-.2-.1-.84-.31-1.6-.99-.59-.53-.99-1.18-1.1-1.38-.12-.2-.01-.3.09-.4.09-.09.2-.23.3-.35.1-.12.13-.2.2-.34.06-.13.03-.25-.02-.35-.05-.1-.44-1.08-.62-1.48-.16-.38-.32-.33-.44-.34l-.38-.01Z" />
    </svg>
  );
}

// Iconos por categoría — line art 24x24, hereda color via currentColor.
const CAT_PATHS: Record<string, ReactNode> = {
  "accesorios-y-herramientas": (
    <path d="M14.5 5.5a3.5 3.5 0 0 0-4.6 4.3L4 15.7 8.3 20l5.9-5.9a3.5 3.5 0 0 0 4.3-4.6l-2.2 2.2-2.3-.6-.6-2.3 2.1-2.1ZM6 18l1-1" />
  ),
  "andamios-y-formaletas": (
    <path d="M4 4v16M20 4v16M4 9h16M4 15h16M9 4v16M15 4v16" />
  ),
  "compresores-de-aire": (
    <>
      <circle cx="12" cy="13" r="6" />
      <path d="M12 13v-3M12 4v2M9 5.5l1 1.7M15 5.5l-1 1.7" />
    </>
  ),
  "equipos-de-compactacion": (
    <>
      <circle cx="8" cy="16" r="3.5" />
      <path d="M11.5 16H19l-2-7h-4l-1.5 4M4 20h13" />
    </>
  ),
  "equipos-de-concreto": (
    <>
      <circle cx="11" cy="12" r="6" />
      <path d="M11 6v12M5.5 9.5l11 5M5.5 14.5l11-5M19 18l2 3" />
    </>
  ),
  "equipos-de-elevacion": (
    <path d="M12 3v12M8 7l4-4 4 4M5 21h14M5 21v-4M19 21v-4" />
  ),
  "equipos-de-iluminacion": (
    <path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3 11.2c.6.4 1 1 1 1.8h4c0-.8.4-1.4 1-1.8A6 6 0 0 0 12 3Z" />
  ),
  "equipos-de-movimiento-de-tierra": (
    <path d="M3 20h18M5 20v-4h6v4M11 16l2-7 5 1.5M13 9l-1-3M6 13h3" />
  ),
  "equipos-electromecanicos": (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1" />
    </>
  ),
  "equipos-generadores-de-energia": (
    <path d="M13 3 4 14h6l-1 7 9-11h-6l1-7Z" />
  ),
};

export function CategoryIcon({
  slug,
  className,
}: {
  slug: string;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("h-9 w-9", className)}
      aria-hidden
    >
      {CAT_PATHS[slug] ?? (
        <path d="M4 7h16M4 12h16M4 17h10" />
      )}
    </svg>
  );
}
