"use client";

import { useState } from "react";
import Image from "next/image";
import { SEDES, WHATSAPP } from "@/lib/utils";

export function Contacto() {
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [sede, setSede] = useState("");
  const [mensaje, setMensaje] = useState("");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const partes = [
      `Hola Equipos y Equipos, soy ${nombre || "(sin nombre)"}.`,
      telefono ? `Mi teléfono: ${telefono}.` : "",
      sede ? `Sede de interés: ${sede}.` : "",
      mensaje ? `Cuento mi proyecto: ${mensaje}` : "",
    ].filter(Boolean);
    const url = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(
      partes.join(" ")
    )}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }

  return (
    <section id="contacto" className="bg-white text-neutral-900">
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <div className="overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-sm md:grid md:grid-cols-2">
          {/* Imagen */}
          <div className="relative min-h-[320px] md:min-h-full">
            <Image
              src="/contactanos/contacto.webp"
              alt="Equipo revisando planos en obra"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>

          {/* Formulario */}
          <div className="p-7 md:p-12">
            <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-900">
              Contacto
            </span>
            <h2 className="mt-5 font-sans text-3xl font-semibold tracking-normal text-neutral-950 md:text-4xl">
              Cuéntanos tu proyecto
            </h2>
            <p className="mt-3 text-base leading-7 text-neutral-500">
              Déjanos tus datos y lo que necesitas. Te respondemos por WhatsApp
              con disponibilidad y cotización.
            </p>

            <form onSubmit={onSubmit} className="mt-8 flex flex-col gap-4">
              <div>
                <label
                  htmlFor="c-nombre"
                  className="mb-1.5 block text-sm font-medium text-neutral-700"
                >
                  Nombre
                </label>
                <input
                  id="c-nombre"
                  type="text"
                  required
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Tu nombre"
                  className="h-11 w-full rounded-lg border border-neutral-200 bg-white px-3.5 text-base text-neutral-900 outline-none transition-all placeholder:text-neutral-400 focus:border-neutral-300 focus:ring-4 focus:ring-neutral-900/5"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="c-tel"
                    className="mb-1.5 block text-sm font-medium text-neutral-700"
                  >
                    Teléfono
                  </label>
                  <input
                    id="c-tel"
                    type="tel"
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                    placeholder="300 000 0000"
                    className="h-11 w-full rounded-lg border border-neutral-200 bg-white px-3.5 text-base text-neutral-900 outline-none transition-all placeholder:text-neutral-400 focus:border-neutral-300 focus:ring-4 focus:ring-neutral-900/5"
                  />
                </div>
                <div>
                  <label
                    htmlFor="c-sede"
                    className="mb-1.5 block text-sm font-medium text-neutral-700"
                  >
                    Sede
                  </label>
                  <div className="relative">
                    <select
                      id="c-sede"
                      value={sede}
                      onChange={(e) => setSede(e.target.value)}
                      className={`h-11 w-full appearance-none rounded-lg border border-neutral-200 bg-white pl-3.5 pr-10 text-base outline-none transition-all focus:border-neutral-300 focus:ring-4 focus:ring-neutral-900/5 ${
                        sede ? "text-neutral-900" : "text-neutral-400"
                      }`}
                    >
                      <option value="">Cualquiera</option>
                      {SEDES.map((s) => (
                        <option key={s.ciudad} value={s.ciudad} className="text-neutral-900">
                          {s.ciudad}
                        </option>
                      ))}
                    </select>
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      aria-hidden
                      className="pointer-events-none absolute right-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400"
                    >
                      <path
                        d="M7 10l5 5 5-5"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <div>
                <label
                  htmlFor="c-msg"
                  className="mb-1.5 block text-sm font-medium text-neutral-700"
                >
                  ¿Qué necesitas?
                </label>
                <textarea
                  id="c-msg"
                  rows={4}
                  value={mensaje}
                  onChange={(e) => setMensaje(e.target.value)}
                  placeholder="Equipo, fechas, lugar de la obra…"
                  className="w-full resize-none rounded-lg border border-neutral-200 bg-white px-3.5 py-3 text-base text-neutral-900 outline-none transition-all placeholder:text-neutral-400 focus:border-neutral-300 focus:ring-4 focus:ring-neutral-900/5"
                />
              </div>

              <button
                type="submit"
                className="mt-2 inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-neutral-900 px-5 text-sm font-medium text-white transition-colors hover:bg-neutral-900/90"
              >
                Enviar por WhatsApp
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path
                    d="M5 12h14M13 6l6 6-6 6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
