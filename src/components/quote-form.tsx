"use client";

import { useState } from "react";
import { categories } from "@/data/catalog";
import { waLink } from "@/lib/utils";
import { WhatsAppIcon, ArrowRight } from "@/components/icons";

// Formulario de cotizacion sin backend: arma un mensaje de WhatsApp con lo que
// el usuario llena y abre el chat. Cero fricción, cero servidor.
export function QuoteForm() {
  const [form, setForm] = useState({
    nombre: "",
    equipo: "",
    desde: "",
    hasta: "",
    obra: "",
    detalle: "",
  });

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  function buildMessage() {
    const L: string[] = ["Hola Equipos y Equipos, quiero cotizar un equipo."];
    if (form.equipo) L.push(`• Equipo: ${form.equipo}`);
    if (form.desde || form.hasta)
      L.push(`• Fechas: ${form.desde || "—"} a ${form.hasta || "—"}`);
    if (form.obra) L.push(`• Obra en: ${form.obra}`);
    if (form.nombre) L.push(`• Soy: ${form.nombre}`);
    if (form.detalle) L.push(`• Detalle: ${form.detalle}`);
    return L.join("\n");
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    window.open(waLink(buildMessage()), "_blank", "noopener,noreferrer");
  }

  const fieldClass =
    "w-full rounded-xl border border-line bg-ink-2 px-4 py-3 text-bone outline-none transition-colors placeholder:text-mute focus:border-brand";
  const labelClass = "mb-2 block text-xs font-medium text-mute";

  return (
    <form onSubmit={onSubmit}>
      <div className="grid gap-5">
        <div>
          <label htmlFor="equipo" className={labelClass}>
            ¿Qué equipo necesitas?
          </label>
          <select
            id="equipo"
            value={form.equipo}
            onChange={set("equipo")}
            className={fieldClass}
          >
            <option value="">Selecciona una categoría…</option>
            {categories.map((c) => (
              <option key={c.slug} value={c.name}>
                {c.name}
              </option>
            ))}
            <option value="Aún no lo sé / asesórenme">
              Aún no lo sé / asesórenme
            </option>
          </select>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="desde" className={labelClass}>
              Desde
            </label>
            <input
              id="desde"
              type="date"
              value={form.desde}
              onChange={set("desde")}
              className={fieldClass}
            />
          </div>
          <div>
            <label htmlFor="hasta" className={labelClass}>
              Hasta
            </label>
            <input
              id="hasta"
              type="date"
              value={form.hasta}
              onChange={set("hasta")}
              className={fieldClass}
            />
          </div>
        </div>

        <div>
          <label htmlFor="obra" className={labelClass}>
            ¿Dónde es la obra?
          </label>
          <input
            id="obra"
            type="text"
            value={form.obra}
            onChange={set("obra")}
            placeholder="Ciudad o barrio"
            className={fieldClass}
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="nombre" className={labelClass}>
              Tu nombre
            </label>
            <input
              id="nombre"
              type="text"
              value={form.nombre}
              onChange={set("nombre")}
              placeholder="Cómo te saludamos"
              className={fieldClass}
            />
          </div>
          <div>
            <label htmlFor="detalle" className={labelClass}>
              Detalle (opcional)
            </label>
            <input
              id="detalle"
              type="text"
              value={form.detalle}
              onChange={set("detalle")}
              placeholder="Marca, capacidad…"
              className={fieldClass}
            />
          </div>
        </div>
      </div>

      <button
        type="submit"
        className="group mt-8 flex w-full items-center justify-center gap-2 rounded-full bg-brand px-7 py-4 font-semibold text-white transition-colors hover:bg-brand-glow"
      >
        <WhatsAppIcon className="h-5 w-5" />
        Enviar pedido por WhatsApp
        <ArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
      </button>
      <p className="mt-3 text-center text-xs text-mute">
        No se guarda nada. Abre el chat con tu pedido escrito.
      </p>
    </form>
  );
}
