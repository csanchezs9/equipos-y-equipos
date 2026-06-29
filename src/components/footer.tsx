import Image from "next/image";
import { SEDES, WHATSAPP_DISPLAY, EMAIL, waLink } from "@/lib/utils";
import { categories } from "@/data/catalog";

const COL_A = categories.slice(0, 6);
const COL_B = categories.slice(6, 12);

const linkCls =
  "border-b border-transparent text-sm text-neutral-500 transition-all duration-300 ease-in-out hover:border-[#F58226] hover:text-neutral-900";

export function Footer() {
  return (
    <footer id="sedes" className="relative w-full overflow-hidden bg-cover bg-center py-20 md:py-32">
      {/* Fondo en video */}
      <video
        className="absolute inset-0 h-full w-full object-cover"
        autoPlay
        loop
        muted
        playsInline
        poster="/videos/footer/footer-poster.jpg"
      >
        <source src="/videos/footer/footer-bg.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-neutral-950/40" />
      {/* Fade blanco de transición desde la sección de equipos */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-white to-transparent md:h-40" />

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

            {/* Más líneas */}
            <div>
              <h3 className="mb-4 text-sm font-medium uppercase tracking-wider text-neutral-900">
                Más líneas
              </h3>
              <ul className="space-y-3 text-sm">
                {COL_B.map((c) => (
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
              </ul>
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-4 border-t border-neutral-200 pt-6 text-xs text-neutral-500 md:flex-row md:items-center md:justify-between">
            <p>
              © {new Date().getFullYear()} Equipos y Equipos S.A.S. Todos los
              derechos reservados.
            </p>
            <div className="flex items-center gap-6">
              <a href="#" className="transition-colors hover:text-neutral-900">
                Tratamiento de datos
              </a>
              <a href="#" className="transition-colors hover:text-neutral-900">
                Política de privacidad
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
