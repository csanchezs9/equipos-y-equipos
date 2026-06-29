"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";
import { Logo } from "@/components/logo";
import { CloseIcon } from "@/components/icons";
import { getLenis } from "@/components/smooth-scroll";
import "./staggered-menu.css";

const LINKS = [
  { href: "/", label: "Inicio" },
  { href: "/equipos", label: "Equipos" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/experiencias", label: "Experiencias" },
  { href: "/contacto", label: "Contacto" },
];

// Capas verdes que entran escalonadas antes del panel claro.
const PRELAYERS = ["#1fb255", "#128a3c"];

export function StaggeredMenu({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const root = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLElement>(null);
  const preWrap = useRef<HTMLDivElement>(null);
  const backdrop = useRef<HTMLDivElement>(null);
  const openTl = useRef<gsap.core.Timeline | null>(null);
  const closeTl = useRef<gsap.core.Tween[] | null>(null);
  const pathname = usePathname();

  // Coloca todo fuera de pantalla al montar (evita parpadeo). Sin gsap.context:
  // su revert() en StrictMode restauraba el transform inline al 100% del CSS.
  useLayoutEffect(() => {
    const pre = preWrap.current
      ? Array.from(preWrap.current.querySelectorAll<HTMLElement>(".sm-prelayer"))
      : [];
    gsap.set([panel.current, ...pre], { x: 0, xPercent: 100 });
    gsap.set(backdrop.current, { autoAlpha: 0 });
  }, []);

  // Abre / cierra segun `open`.
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const lenis = getLenis();

    const pre = preWrap.current
      ? Array.from(preWrap.current.querySelectorAll<HTMLElement>(".sm-prelayer"))
      : [];
    const labels = panel.current
      ? Array.from(panel.current.querySelectorAll<HTMLElement>(".sm-panel-itemLabel"))
      : [];
    const numbers = panel.current
      ? Array.from(panel.current.querySelectorAll<HTMLElement>(".sm-panel-list[data-numbering] .sm-panel-item"))
      : [];
    const socialTitle = panel.current?.querySelector(".sm-socials-title");
    const socialLinks = panel.current
      ? Array.from(panel.current.querySelectorAll<HTMLElement>(".sm-socials-link"))
      : [];

    // Mata tweens de cierre pendientes.
    closeTl.current?.forEach((t) => t.kill());
    closeTl.current = null;

    if (open) {
      openTl.current?.kill();
      lenis?.stop();
      document.documentElement.style.overflow = "hidden";

      if (reduce) {
        gsap.set([...pre, panel.current], { x: 0, xPercent: 0 });
        gsap.set(backdrop.current, { autoAlpha: 1 });
        gsap.set([...labels], { yPercent: 0, rotate: 0 });
        gsap.set(numbers, { "--sm-num-opacity": 1 });
        gsap.set([socialTitle, ...socialLinks], { opacity: 1, y: 0 });
        return;
      }

      gsap.set(labels, { yPercent: 140, rotate: 8 });
      gsap.set(numbers, { "--sm-num-opacity": 0 });
      if (socialTitle) gsap.set(socialTitle, { opacity: 0 });
      gsap.set(socialLinks, { y: 24, opacity: 0 });

      const tl = gsap.timeline();
      tl.to(backdrop.current, { autoAlpha: 1, duration: 0.4, ease: "power2.out" }, 0);

      pre.forEach((layer, i) => {
        tl.fromTo(
          layer,
          { x: 0, xPercent: 100 },
          { xPercent: 0, duration: 0.5, ease: "power4.out" },
          i * 0.08
        );
      });

      const panelStart = pre.length ? (pre.length - 1) * 0.08 + 0.1 : 0;
      tl.fromTo(
        panel.current,
        { x: 0, xPercent: 100 },
        { xPercent: 0, duration: 0.65, ease: "power4.out" },
        panelStart
      );

      const itemsStart = panelStart + 0.12;
      tl.to(
        labels,
        { yPercent: 0, rotate: 0, duration: 1, ease: "power4.out", stagger: 0.09 },
        itemsStart
      );
      tl.to(
        numbers,
        { "--sm-num-opacity": 1, duration: 0.6, ease: "power2.out", stagger: 0.08 },
        itemsStart + 0.1
      );

      const socialsStart = panelStart + 0.3;
      if (socialTitle) {
        tl.to(socialTitle, { opacity: 1, duration: 0.5, ease: "power2.out" }, socialsStart);
      }
      tl.to(
        socialLinks,
        {
          y: 0,
          opacity: 1,
          duration: 0.55,
          ease: "power3.out",
          stagger: 0.07,
          onComplete: () => gsap.set(socialLinks, { clearProps: "opacity" }),
        },
        socialsStart + 0.05
      );

      openTl.current = tl;
    } else {
      openTl.current?.kill();
      openTl.current = null;
      lenis?.start();
      document.documentElement.style.overflow = "";

      const resetItems = () => {
        gsap.set(labels, { yPercent: 140, rotate: 8 });
        gsap.set(numbers, { "--sm-num-opacity": 0 });
        if (socialTitle) gsap.set(socialTitle, { opacity: 0 });
        gsap.set(socialLinks, { y: 24, opacity: 0 });
      };

      if (reduce) {
        gsap.set([...pre, panel.current], { x: 0, xPercent: 100 });
        gsap.set(backdrop.current, { autoAlpha: 0 });
        resetItems();
        return;
      }

      closeTl.current = [
        gsap.to([...pre, panel.current], {
          x: 0,
          xPercent: 100,
          duration: 0.35,
          ease: "power3.in",
          overwrite: "auto",
          onComplete: resetItems,
        }),
        gsap.to(backdrop.current, { autoAlpha: 0, duration: 0.3, ease: "power2.out" }),
      ];
    }

    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  // ESC para cerrar.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      ref={root}
      aria-hidden={!open}
      data-position="right"
      className={`sm-root fixed inset-0 z-[60] ${
        open ? "pointer-events-auto" : "pointer-events-none"
      }`}
    >
      {/* Click-away + atenuado del fondo */}
      <div
        ref={backdrop}
        onClick={onClose}
        className="absolute inset-0 bg-black/25 backdrop-blur-[2px]"
      />

      {/* Capas verdes escalonadas */}
      <div ref={preWrap} className="sm-prelayers" aria-hidden>
        {PRELAYERS.map((c, i) => (
          <div key={i} className="sm-prelayer" style={{ background: c }} />
        ))}
      </div>

      {/* Panel claro */}
      <aside ref={panel} className="sm-panel" aria-hidden={!open}>
        {/* Top: logo + cerrar */}
        <div className="flex items-center justify-between">
          <Link href="/" onClick={onClose} aria-label="Inicio">
            <Logo className="h-7 md:h-8" />
          </Link>
          <button
            onClick={onClose}
            aria-label="Cerrar menú"
            className="group inline-flex items-center gap-2 rounded-full border border-line px-5 py-2.5 text-sm font-semibold text-bone transition-colors hover:border-brand hover:text-brand"
          >
            Cerrar
            <CloseIcon className="transition-transform duration-300 group-hover:rotate-90" />
          </button>
        </div>

        <div className="sm-panel-inner">
          <ul className="sm-panel-list" data-numbering role="list">
            {LINKS.map((l) => {
              const active = pathname === l.href || (pathname?.startsWith(`${l.href}/`) && l.href !== "/");
              return (
                <li key={l.href} className="sm-panel-itemWrap">
                  <Link
                    href={l.href}
                    onClick={onClose}
                    aria-current={active ? "page" : undefined}
                    className="sm-panel-item"
                    style={active ? { color: "var(--color-brand)" } : undefined}
                  >
                    <span className="sm-panel-itemLabel">{l.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </aside>
    </div>
  );
}
