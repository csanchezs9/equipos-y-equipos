"use client";

import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Envuelve un elemento y lo atrae sutilmente hacia el cursor. */
export function Magnetic({
  children,
  className,
  strength = 0.35,
}: {
  children: ReactNode;
  className?: string;
  strength?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  function onMove(e: React.MouseEvent) {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - (r.left + r.width / 2)) * strength;
    const y = (e.clientY - (r.top + r.height / 2)) * strength;
    el.style.transform = `translate(${x}px, ${y}px)`;
  }

  function onLeave() {
    const el = ref.current;
    if (el) el.style.transform = "translate(0,0)";
  }

  return (
    <span
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={cn(
        "inline-block will-change-transform transition-transform duration-500 [transition-timing-function:var(--ease-out-expo)]",
        className
      )}
    >
      {children}
    </span>
  );
}
