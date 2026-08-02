"use client";

import { useState } from "react";
import Image from "next/image";
import { SEDES, WHATSAPP, DOCS_LEGALES } from "@/lib/utils";
import { TextAnimate } from "@/components/text-animate";

// Ley 1581 de 2012: recoger nombre y teléfono es tratar datos personales, y el
// titular tiene que autorizarlo de forma previa, expresa e informada. El
// checkbox va sin marcar por defecto (si viniera marcado no es consentimiento)
// y enlaza la política y el aviso que la empresa ya publica.
const POLITICA = DOCS_LEGALES.find((d) =>
  d.href.includes("politica-tratamiento")
);
const AVISO = DOCS_LEGALES.find((d) => d.href.includes("aviso-privacidad"));

export function Contacto() {
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [sede, setSede] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [autoriza, setAutoriza] = useState(false);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!autoriza) return;
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
    // Sin fondo propio: la foto la pone el contenedor de page.tsx y corre
    // también detrás del FAQ. La tarjeta de abajo sí queda blanca.
    <section id="contacto" className="relative text-neutral-900">
      {/* pt corto: FAQ ya cierra con pb-20/pb-28. Con el mismo pt acá los dos
          paddings se sumaban y dejaban demasiado aire entre las dos tarjetas. */}
      <div className="mx-auto max-w-6xl px-6 pb-20 pt-4 md:pb-28 md:pt-6">
        <div className="overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-sm md:grid md:grid-cols-2">
          {/* Imagen */}
          {/* En móvil la tarjeta apila y la foto manda: le damos su propia
              relación 1024x1536 para que object-cover no recorte nada (la foto
              trae texto quemado arriba y se estaba comiendo la primera línea).
              Desde md vuelve a estirarse a la altura del formulario. */}
          <div className="relative aspect-[2/3] md:aspect-auto md:min-h-full">
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
            <TextAnimate
              as="span"
              animation="slideUp"
              by="word"
              duration={1}
              className="inline-block rounded-full border border-hazard bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-900"
            >
              Contacto
            </TextAnimate>
            <TextAnimate
              as="h2"
              animation="slideUp"
              by="word"
              duration={1}
              delay={0.1}
              className="mt-5 font-sans text-3xl font-semibold tracking-normal text-neutral-950 md:text-4xl"
            >
              Cuéntanos tu proyecto
            </TextAnimate>
            <TextAnimate
              as="p"
              animation="slideUp"
              by="word"
              duration={1}
              delay={0.2}
              className="mt-3 text-base leading-7 text-neutral-500"
            >
              Déjanos tus datos y lo que necesitas. Te respondemos por WhatsApp
              con disponibilidad y cotización.
            </TextAnimate>

            {/* El formulario entra como bloque, no palabra por palabra: partir
                el texto de un <label> en spans afecta el nombre accesible del
                campo, y con etiquetas de una palabra el escalonado no se nota.
                data-reveal lo toma el GSAP global de smooth-scroll.tsx. */}
            <form
              onSubmit={onSubmit}
              data-reveal="up"
              className="mt-8 flex flex-col gap-4"
            >
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

              <div className="flex items-start gap-2.5">
                <input
                  id="c-habeas"
                  type="checkbox"
                  required
                  checked={autoriza}
                  onChange={(e) => setAutoriza(e.target.checked)}
                  className="mt-0.5 h-4 w-4 shrink-0 rounded border-neutral-300 accent-brand"
                />
                <label htmlFor="c-habeas" className="text-xs leading-5 text-neutral-500">
                  Autorizo a Equipos y Equipos S.A.S. a tratar mis datos
                  personales para responder esta solicitud, según su{" "}
                  {POLITICA ? (
                    <a
                      href={POLITICA.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-neutral-900 underline underline-offset-2 hover:text-brand"
                    >
                      política de tratamiento de datos
                    </a>
                  ) : (
                    "política de tratamiento de datos"
                  )}
                  {AVISO ? (
                    <>
                      {" y su "}
                      <a
                        href={AVISO.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-neutral-900 underline underline-offset-2 hover:text-brand"
                      >
                        aviso de privacidad
                      </a>
                    </>
                  ) : null}
                  .
                </label>
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
