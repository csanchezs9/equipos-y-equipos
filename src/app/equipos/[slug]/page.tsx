import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { categories, products } from "@/data/catalog";
import { grupoDeCategoria } from "@/data/grupos";
import { JsonLd } from "@/components/json-ld";
import { SEDES, WHATSAPP_DISPLAY, WHATSAPP, waLink } from "@/lib/utils";

// Todas las fichas se prerenderizan; un slug que no exista da 404 en vez de
// intentar generarse al vuelo.
export const dynamicParams = false;

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

function getProducto(slug: string) {
  return products.find((p) => p.slug === slug);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = getProducto(slug);
  if (!p) return {};

  const linea = p.categoryNames[0];
  const description = `${p.description} Alquiler en Medellín, Pereira y Armenia, con entrega en obra.`;

  return {
    title: p.name,
    description,
    alternates: { canonical: `/equipos/${p.slug}` },
    openGraph: {
      type: "website",
      locale: "es_CO",
      title: `${p.name} en alquiler`,
      description,
      url: `/equipos/${p.slug}`,
      ...(p.image
        ? { images: [{ url: p.image, width: 400, height: 400, alt: p.name }] }
        : {}),
    },
    keywords: [
      `alquiler ${p.name}`,
      ...(linea ? [`alquiler ${linea}`] : []),
      "alquiler maquinaria Medellín",
      "alquiler maquinaria Itagüí",
    ],
  };
}

export default async function FichaEquipo({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = getProducto(slug);
  if (!p) notFound();

  const lineaSlug = p.categories[0];
  const linea = categories.find((c) => c.slug === lineaSlug);
  const lineaNombre = p.categoryNames[0] ?? "Equipos";
  const grupo = grupoDeCategoria(lineaSlug);

  // Otros equipos de la misma línea, sin repetir el actual.
  const relacionados = products
    .filter((o) => o.slug !== p.slug && o.categories.includes(lineaSlug))
    .slice(0, 4);

  const cotizar = waLink(
    `Hola Equipos y Equipos, quiero cotizar el alquiler de: ${p.name}.`
  );

  // Schema.org: es un alquiler, no una venta, y no publicamos precios. Por eso
  // el Product va sin offers; inventar un price seria dato falso.
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    description: p.description,
    ...(p.image ? { image: `https://equiposyequipos.com.co${p.image}` } : {}),
    category: lineaNombre,
    brand: { "@type": "Brand", name: "Equipos y Equipos S.A.S." },
  };

  return (
    <section className="bg-white text-neutral-900">
      <JsonLd data={schema} />

      <div className="mx-auto max-w-6xl px-6 pb-20 pt-28 md:pb-28 md:pt-36">
        {/* Migas */}
        <nav aria-label="Ruta" className="flex flex-wrap items-center gap-1.5 text-sm">
          <Link
            href="/equipos"
            className="text-neutral-500 transition-colors hover:text-brand"
          >
            Equipos
          </Link>
          <span aria-hidden className="text-neutral-300">
            /
          </span>
          {/* Devuelve al catálogo con el filtro de su etapa de obra ya puesto
              (Rodillos Compactadores -> ?linea=compactacion). */}
          {grupo ? (
            <Link
              href={`/equipos?linea=${grupo.id}`}
              className="text-neutral-500 transition-colors hover:text-brand"
            >
              {lineaNombre}
            </Link>
          ) : (
            <span className="text-neutral-500">{lineaNombre}</span>
          )}
          <span aria-hidden className="text-neutral-300">
            /
          </span>
          <span className="text-neutral-900">{p.name}</span>
        </nav>

        <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Imagen */}
          {/* fill, no width/height: con w-auto la imagen se planta en su tamaño
              intrínseco (400px) y queda chica en una caja de ~600. Con fill
              ocupa la caja entera y object-contain la mantiene sin recortar. */}
          <div className="relative aspect-square overflow-hidden rounded-2xl border border-neutral-200 bg-gradient-to-br from-neutral-50 via-neutral-100 to-neutral-200">
            <div
              aria-hidden
              className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,white,transparent_70%)] opacity-60"
            />
            {p.image ? (
              <Image
                src={p.image}
                alt={p.name}
                fill
                priority
                sizes="(min-width: 1024px) 45vw, 90vw"
                className="object-contain p-6 drop-shadow-sm sm:p-10"
              />
            ) : (
              <span className="absolute inset-0 flex items-center justify-center text-sm text-neutral-400">
                Sin foto por ahora
              </span>
            )}
          </div>

          {/* Datos */}
          <div className="flex flex-col">
            {linea ? (
              <Link
                href={grupo ? `/equipos?linea=${grupo.id}` : "/equipos"}
                className="kicker w-fit text-sm"
              >
                {lineaNombre}
              </Link>
            ) : null}

            <h1 className="mt-3 font-sans text-3xl font-semibold leading-tight tracking-tight text-neutral-950 md:text-4xl">
              {p.name}
            </h1>

            <p className="mt-5 text-base leading-7 text-neutral-600">
              {p.description}
            </p>

            {/* Sin precios: el alquiler se cotiza segun dias, sede y obra. */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href={cotizar}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-brand px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-deep"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden
                >
                  <path d="M12.04 2a9.9 9.9 0 0 0-8.46 15.01L2 22l5.13-1.34A9.9 9.9 0 1 0 12.04 2Zm0 1.8a8.1 8.1 0 0 1 6.88 12.36l-.2.32.7 2.56-2.63-.69-.31.18a8.1 8.1 0 1 1-4.44-14.93Zm-3.1 4.07c-.15 0-.4.06-.6.29-.21.23-.8.78-.8 1.9 0 1.12.82 2.2.93 2.36.11.15 1.6 2.56 3.96 3.5 1.96.77 2.36.62 2.79.58.43-.04 1.38-.56 1.58-1.11.2-.55.2-1.02.14-1.12-.06-.1-.21-.16-.45-.28-.24-.12-1.38-.68-1.6-.76-.21-.08-.37-.12-.52.12-.15.23-.6.76-.73.91-.13.16-.27.18-.5.06-.24-.12-1-.37-1.9-1.18-.7-.62-1.18-1.4-1.32-1.63-.13-.24-.01-.37.1-.49.11-.11.24-.27.36-.41.12-.15.16-.25.24-.41.08-.16.04-.3-.02-.42-.06-.12-.52-1.28-.72-1.75-.19-.46-.38-.4-.52-.4l-.45-.01Z" />
                </svg>
                Cotizar por WhatsApp
              </a>
              <a
                href={`tel:+${WHATSAPP}`}
                className="inline-flex items-center justify-center rounded-full border border-neutral-200 px-6 py-3.5 text-sm font-semibold text-neutral-900 transition-colors hover:border-neutral-400"
              >
                Llamar al {WHATSAPP_DISPLAY}
              </a>
            </div>

            <dl className="mt-10 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-200 sm:grid-cols-3">
              <div className="bg-white p-4">
                <dt className="text-xs text-neutral-500">Modalidad</dt>
                <dd className="mt-1 text-sm font-medium text-neutral-950">
                  Día, semana o mes
                </dd>
              </div>
              <div className="bg-white p-4">
                <dt className="text-xs text-neutral-500">Entrega</dt>
                <dd className="mt-1 text-sm font-medium text-neutral-950">
                  En tu obra
                </dd>
              </div>
              <div className="bg-white p-4">
                <dt className="text-xs text-neutral-500">Sedes</dt>
                <dd className="mt-1 text-sm font-medium text-neutral-950">
                  {SEDES.map((s) => s.ciudad).join(" · ")}
                </dd>
              </div>
            </dl>

            <p className="mt-4 text-sm leading-6 text-neutral-500">
              El precio depende de los días, la sede y el tipo de obra. Escríbenos
              y te pasamos la cotización el mismo día.
            </p>
          </div>
        </div>

        {/* Otros de la misma línea */}
        {relacionados.length > 0 ? (
          <div className="mt-20 border-t border-neutral-200 pt-10 md:mt-28">
            <div className="flex items-baseline justify-between gap-4">
              <h2 className="font-sans text-xl font-semibold tracking-tight text-neutral-950">
                Más de {lineaNombre.toLowerCase()}
              </h2>
              <Link
                href="/equipos"
                className="group inline-flex items-center gap-1.5 text-sm font-medium text-neutral-600 transition-colors hover:text-brand"
              >
                Ver el catálogo
                <span
                  aria-hidden
                  className="transition-transform duration-300 [transition-timing-function:var(--ease-out-expo)] group-hover:translate-x-1"
                >
                  &rarr;
                </span>
              </Link>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4 lg:gap-5">
              {relacionados.map((o) => (
                <Link
                  key={o.id}
                  href={`/equipos/${o.slug}`}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-neutral-300 hover:shadow-lg"
                >
                  <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-neutral-50 via-neutral-100 to-neutral-200">
                    <div
                      aria-hidden
                      className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,white,transparent_70%)] opacity-60"
                    />
                    {o.image ? (
                      <Image
                        src={o.image}
                        alt={o.name}
                        fill
                        sizes="(max-width: 768px) 50vw, 25vw"
                        className="object-contain p-5 drop-shadow-sm transition-transform duration-500 [transition-timing-function:var(--ease-out-expo)] group-hover:scale-110"
                      />
                    ) : null}
                  </div>
                  <div className="p-4">
                    <h3 className="font-sans text-sm font-medium leading-snug text-neutral-950">
                      {o.name}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
