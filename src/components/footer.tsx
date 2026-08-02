import Image from "next/image";
import {
  SEDES,
  WHATSAPP_DISPLAY,
  EMAIL,
  FORMATO_VINCULACION,
  DOCS_LEGALES,
  waLink,
} from "@/lib/utils";
import { categories } from "@/data/catalog";

const COL_A = categories.slice(0, 6);

/**
 * Fondo del cierre de la página. Envuelve lo que va sobre la foto: en la home
 * son el FAQ, contacto y el footer; en el resto de rutas solo el footer.
 *
 * Existe como componente y no como clase suelta porque el footer salió del
 * layout: cada página lo monta, y todas tienen que envolverlo igual para que el
 * cierre se vea del mismo material.
 *
 * isolate + -z-10: la foto queda detrás de todo lo de adentro sin tener que
 * ponerle z-index a cada hijo, y el stacking context propio la mantiene dentro
 * del bloque.
 */
export function CierreConFondo({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative isolate">
      <Image
        src="/fondos/estructura-atardecer.webp"
        alt=""
        aria-hidden
        fill
        sizes="100vw"
        className="-z-10 object-cover"
      />
      {children}
    </div>
  );
}

const linkCls =
  "border-b border-transparent text-sm text-neutral-500 transition-all duration-300 ease-in-out hover:border-[#F58226] hover:text-neutral-900";

export function Footer() {
  return (
    // Sin fondo propio: en la home lo pone el contenedor que comparte con el
    // FAQ y contacto. Antes acá iba un mp4 de 2.4MB en autoplay, y un fade
    // blanco arriba para empalmar con una sección blanca que ya no existe.
    //
    // role="contentinfo" explícito: en la home el footer cuelga de <main>, y un
    // <footer> descendiente de <main> pierde ese landmark. El rol se lo
    // devuelve.
    <footer
      id="sedes"
      role="contentinfo"
      data-analytics-zone="footer"
      className="relative w-full overflow-hidden py-20 md:py-32"
    >
      <div className="container-x relative">
        <div className="mx-auto max-w-7xl rounded-lg bg-white p-8 text-neutral-900 shadow-lg md:p-12">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4 lg:gap-12">
            {/* Marca + CTA */}
            <div className="flex flex-col items-center text-center lg:col-span-1 lg:items-start lg:text-left">
              <Image
                src="/brand/equiposyequipos-logo.png"
                alt="Equipos y Equipos S.A.S"
                width={297}
                height={136}
                className="h-20 w-auto"
              />
              <p className="mt-4 mb-6 max-w-xs text-sm leading-relaxed text-neutral-500">
                Alquiler de equipos para la construcción. Maquinaria mantenida,
                entrega en obra y soporte técnico en Medellín, Pereira y Armenia.
              </p>
              <a
                href={waLink(
                  "Hola Equipos y Equipos, quiero cotizar el alquiler de un equipo."
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-9 items-center justify-center gap-1.5 whitespace-nowrap rounded-md bg-brand px-4 text-sm font-medium text-white transition-colors hover:bg-brand-deep"
              >
                Cotizar por WhatsApp
              </a>
            </div>

            {/* Equipos */}
            <div>
              <h3 className="mb-4 text-sm font-medium uppercase tracking-wider text-neutral-900">
                Equipos
              </h3>
              <ul className="space-y-3 text-sm">
                {COL_A.map((c) => (
                  <li key={c.slug}>
                    <a
                      href={waLink(
                        `Hola Equipos y Equipos, quiero cotizar la línea ${c.name}.`
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={linkCls}
                    >
                      {c.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Tratamiento de datos */}
            <div>
              <h3 className="mb-4 text-sm font-medium uppercase tracking-wider text-neutral-900">
                Tratamiento de datos
              </h3>
              <ul className="space-y-3 text-sm">
                {DOCS_LEGALES.map((d) => (
                  <li key={d.href}>
                    <a
                      href={d.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={linkCls}
                    >
                      {d.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contacto */}
            <div>
              <h3 className="mb-4 text-sm font-medium uppercase tracking-wider text-neutral-900">
                Contacto
              </h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <a href="tel:+573113095760" className={linkCls}>
                    {WHATSAPP_DISPLAY}
                  </a>
                </li>
                <li>
                  <a href={`mailto:${EMAIL}`} className={linkCls}>
                    {EMAIL}
                  </a>
                </li>
                <li className="text-neutral-500">
                  {SEDES.map((s) => s.ciudad).join(" · ")}
                </li>
                <li className="pt-1">
                  <a
                    href={FORMATO_VINCULACION}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={linkCls}
                  >
                    Formato de vinculación (PDF)
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-4 border-t border-neutral-200 pt-6 text-xs text-neutral-500 md:flex-row md:items-center md:justify-between">
            <p>
              © {new Date().getFullYear()} Equipos y Equipos S.A.S. Todos los
              derechos reservados.
            </p>
            <div className="flex items-center gap-6">
              <a
                href="/docs/politica-tratamiento-bases-datos.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-neutral-900"
              >
                Tratamiento de datos
              </a>
              <a
                href="/docs/aviso-privacidad-bases-datos.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-neutral-900"
              >
                Aviso de privacidad
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
