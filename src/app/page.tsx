import Image from "next/image";
import Link from "next/link";
import { waLink } from "@/lib/utils";
import { Faq } from "@/components/faq";
import { Nosotros } from "@/components/nosotros";
import { Contacto } from "@/components/contacto";
import { Marquee } from "@/components/marquee";
import { ArrowRight } from "@/components/icons";
import { products, type Product } from "@/data/catalog";

const DESTACADOS_SLUGS = [
  "andamio-de-carga",
  "concretadora-electrica",
  "vibrocompactador-canguro",
  "mini-cargador-caterpillar-236b2-con-pala",
  "cortadora-de-piso",
  "compresor-1-y-o-2-martillos",
  "rodillo-compactador-dd-24-ingersoll-rand",
  "allanadoras-de-36-con-plato-flotante",
];

const DESTACADOS: Product[] = DESTACADOS_SLUGS.map((slug) =>
  products.find((p) => p.slug === slug)
).filter((p): p is Product => Boolean(p));

const MARQUEE_ITEMS = [
  "Itagüí",
  "Pereira",
  "Armenia",
  "Mantenimiento entre cada alquiler",
  "Despacho a obra",
  "Respuesta en 24h",
  "+12 líneas de equipo",
];

type Cell =
  | { type: "image"; src: string; alt: string }
  | { type: "text"; title: string; desc: string };

const CELLS: Cell[] = [
  {
    type: "image",
    src: "/fotos/pexels-michaela-st-3448542-22857379.jpg",
    alt: "Andamios metálicos en altura",
  },
  {
    type: "text",
    title: "Andamios y alturas",
    desc: "Andamios multidireccionales, tijera y colgantes, más equipos de tracción vertical para trabajar seguro en altura.",
  },
  {
    type: "image",
    src: "/fotos/pexels-ritesh-arya-1423700-3097103.webp",
    alt: "Maquinaria de construcción",
  },
  {
    type: "text",
    title: "Concreto y acabado",
    desc: "Concretadoras, vibradores y allanadoras para vaciar, compactar y dar acabado al concreto.",
  },
  {
    type: "text",
    title: "Compactación",
    desc: "Rodillos compactadores, ranas y vibrocompactadores para dejar suelos y bases firmes.",
  },
  {
    type: "image",
    src: "/fotos/pexels-rahibyaqubov-23978113.webp",
    alt: "Obra de construcción",
  },
  {
    type: "text",
    title: "Corte y demolición",
    desc: "Cortadoras de piso, compresores y martillos para corte y demolición precisa.",
  },
  {
    type: "image",
    src: "/fotos/pexels-sofoklis-saripanidis-13143901-31499725.webp",
    alt: "Equipo de construcción",
  },
];

export default function Home() {
  return (
    <>
    <section id="top" className="relative h-svh w-full overflow-hidden bg-neutral-950 text-white">
      <video
        className="absolute inset-0 h-full w-full object-cover"
        src="/videos/hero/hero-bg.mp4"
        poster="/videos/hero/hero-poster.jpg"
        autoPlay
        loop
        muted
        playsInline
      />
      <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/85 via-neutral-950/25 to-neutral-950/55" />

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
        <span data-reveal className="rounded-full bg-white/10 px-2 py-0.5 text-xs font-medium text-white ring-1 ring-white/15 backdrop-blur">
          Alquiler de maquinaria para construcción
        </span>

        <h1 data-reveal className="mt-6 max-w-3xl font-sans text-4xl font-semibold tracking-normal text-white leading-tight md:text-6xl md:leading-none">
          Tu obra no para. Nosotros tampoco.
        </h1>

        <p data-reveal className="mt-6 max-w-xl font-sans text-base font-medium leading-6 text-white/70">
          Maquinaria mantenida y lista para producir, con soporte técnico en
          Medellín, Pereira y Armenia. Cotizas, despachamos a tu obra y te
          acompañamos.
        </p>

        <div data-reveal className="mt-8 flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row">
          <a
            href={waLink(
              "Hola Equipos y Equipos, quiero cotizar el alquiler de un equipo."
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-10 w-full items-center justify-center gap-1.5 whitespace-nowrap rounded-md bg-brand px-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-deep sm:w-auto"
          >
            Cotizar por WhatsApp
          </a>
          <a
            href="/equipos"
            className="inline-flex h-10 w-full items-center justify-center gap-1.5 whitespace-nowrap rounded-md border border-white/25 bg-white/10 px-2.5 text-sm font-medium text-white shadow-sm backdrop-blur transition-colors hover:bg-white/20 sm:w-auto"
          >
            Ver equipos
          </a>
        </div>
      </div>

      <Marquee
        items={MARQUEE_ITEMS}
        className="absolute inset-x-0 bottom-0 z-10 border-t border-white/10 bg-neutral-950/60 backdrop-blur-sm"
      />
    </section>

    <section id="equipos" className="bg-white text-neutral-900">
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <div className="flex max-w-2xl flex-col items-start text-left">
          <span data-reveal className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-900">
            Líneas
          </span>
          <h2 data-reveal className="mt-5 font-sans text-4xl font-semibold tracking-normal text-neutral-950 md:text-5xl md:leading-tight">
            Equipos para cada etapa de tu obra
          </h2>
          <p data-reveal className="mt-5 text-base leading-7 text-neutral-500">
            Maquinaria mantenida y lista para despacho. De la cimentación al
            acabado, cubrimos cada frente de tu obra.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {CELLS.map((cell, i) =>
            cell.type === "image" ? (
              <div
                key={i}
                data-reveal="scale"
                className="relative aspect-[3/4] overflow-hidden rounded-xl bg-neutral-100"
              >
                <Image
                  src={cell.src}
                  alt={cell.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 25vw"
                  className="object-cover"
                />
              </div>
            ) : (
              <div
                key={i}
                data-reveal
                className="flex aspect-[3/4] flex-col justify-between rounded-xl bg-neutral-50 p-7 md:p-8"
              >
                <h3 className="font-sans text-2xl font-medium tracking-tight text-neutral-950">
                  {cell.title}
                </h3>
                <div>
                  <p className="text-sm leading-relaxed text-neutral-500">
                    {cell.desc}
                  </p>
                  <a
                    href={waLink(
                      `Hola Equipos y Equipos, quiero información sobre ${cell.title}.`
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 inline-block text-sm font-medium text-neutral-900 underline underline-offset-4 transition-colors hover:text-brand"
                  >
                    Más información
                  </a>
                </div>
              </div>
            )
          )}
        </div>

        <div className="mt-12 flex justify-center">
          <Link
            href="/equipos"
            className="inline-flex h-11 items-center justify-center gap-1.5 whitespace-nowrap rounded-md border border-neutral-200 bg-white px-6 text-sm font-medium text-neutral-900 shadow-sm transition-colors hover:bg-neutral-50"
          >
            Ver todos los equipos
          </Link>
        </div>
      </div>
    </section>

    <section id="destacados" className="bg-neutral-50 text-neutral-900">
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <div className="flex max-w-2xl flex-col items-start text-left">
          <span data-reveal className="rounded-full bg-white px-3 py-1 text-xs font-medium text-neutral-900 ring-1 ring-neutral-200">
            Destacados
          </span>
          <h2 data-reveal className="mt-5 font-sans text-4xl font-semibold tracking-normal text-neutral-950 md:text-5xl md:leading-tight">
            Equipos que más nos piden
          </h2>
          <p data-reveal className="mt-5 text-base leading-7 text-neutral-500">
            Una muestra de la flota. Pregunta por el que necesites y te
            contamos disponibilidad al toque.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-2 gap-4 md:grid-cols-4 lg:gap-5">
          {DESTACADOS.map((p, i) => (
            <div
              key={p.id}
              data-reveal="scale"
              className="group flex flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white transition-colors hover:border-brand/40"
            >
              <div className="relative aspect-square bg-white">
                <span className="absolute left-3 top-3 z-10 font-mono text-xs tabular-nums text-neutral-300">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {p.image && (
                  <Image
                    src={p.image}
                    alt={p.name}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-contain p-8 transition-transform duration-300 group-hover:scale-[1.04]"
                  />
                )}
              </div>
              <div className="flex flex-1 flex-col border-t border-neutral-100 p-5">
                <span className="w-fit rounded-full bg-hazard/10 px-2.5 py-0.5 text-[11px] font-medium text-hazard-deep">
                  {p.categoryNames[0]}
                </span>
                <h3 className="mt-3 line-clamp-2 min-h-[2.6em] font-sans text-base font-semibold leading-tight text-neutral-950">
                  {p.name}
                </h3>
                <a
                  href={waLink(
                    `Hola Equipos y Equipos, quiero información sobre ${p.name}.`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto flex items-center gap-1.5 pt-4 text-sm font-medium text-brand transition-colors hover:text-brand-deep"
                >
                  Preguntar disponibilidad
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <Link
            href="/equipos"
            className="inline-flex h-11 items-center justify-center gap-1.5 whitespace-nowrap rounded-md border border-neutral-200 bg-white px-6 text-sm font-medium text-neutral-900 shadow-sm transition-colors hover:bg-neutral-100"
          >
            Ver todo el catálogo
          </Link>
        </div>
      </div>
    </section>

    <Nosotros />

    <Faq />

    <Contacto />
    </>
  );
}
