import Image from "next/image";
import Link from "next/link";
import { waLink } from "@/lib/utils";
import { Faq } from "@/components/faq";
import { Nosotros } from "@/components/nosotros";
import { Contacto } from "@/components/contacto";

type Foto = { src: string; alt: string };
type Texto = { title: string; desc: string };

type Cell =
  | ({ type: "image" } & Foto)
  | ({ type: "text" } & Texto)
  /**
   * Par foto + texto que ocupa dos columnas y se comporta como una sola pieza:
   * al pasar el mouse por CUALQUIERA de las dos, la foto se estira sobre el
   * texto y cruza a `ancha`.
   *
   * Van juntas en un mismo item de la grilla y no como celdas sueltas porque
   * group-hover necesita un ancestro común, y las celdas sueltas son hermanas.
   * La alternativa era estado de React, que volvería client component a toda la
   * home por un hover.
   */
  | { type: "duo"; foto: Foto; ancha: Foto; texto: Texto };

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
    type: "duo",
    foto: {
      src: "/fotos/pexels-ritesh-arya-1423700-3097103.webp",
      alt: "Maquinaria de construcción",
    },
    ancha: {
      src: "/fotos/obra-losa-cuadrilla.jpg",
      alt: "Cuadrilla sobre la losa vaciada, con el acero de la siguiente placa al fondo",
    },
    texto: {
      title: "Concreto y acabado",
      desc: "Concretadoras, vibradores y allanadoras para vaciar, compactar y dar acabado al concreto.",
    },
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

const IMAGES = [
  {
    src: "/hero/pexels-the-jd-darshan-solanki-215282-11959308.webp",
    alt: "Grúas en obra junto al río",
  },
  {
    src: "/hero/pexels-construccion-total-2464540-14420873.webp",
    alt: "Volqueta y cortadora de piso en obra",
  },
  {
    src: "/hero/pexels-construccion-total-2464540-6106878.webp",
    alt: "Mezcladora de concreto en obra",
  },
];

function TarjetaTexto({ title, desc }: Texto) {
  return (
    <div className="flex aspect-[3/4] flex-col justify-between rounded-xl bg-neutral-50 p-7 md:p-8">
      <h3 className="font-sans text-2xl font-medium tracking-tight text-neutral-950">
        {title}
      </h3>
      <div>
        <p className="text-sm leading-relaxed text-neutral-500">{desc}</p>
        <a
          href={waLink(`Hola Equipos y Equipos, quiero información sobre ${title}.`)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-block text-sm font-medium text-neutral-900 underline underline-offset-4 transition-colors hover:text-brand"
        >
          Más información
        </a>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <>
    <section id="top" className="bg-white text-neutral-900">
      {/* pt deja aire para la navbar fija (h-14 en móvil, h-20 editorial en desktop) */}
      <div className="mx-auto max-w-5xl px-6 pt-24 md:pt-32">
        <div className="flex flex-col items-center text-center">
          <span className="rounded-full border border-hazard bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-900">
            Alquiler de maquinaria para construcción
          </span>

          <h1 className="mt-6 max-w-3xl font-sans text-4xl font-semibold tracking-normal text-neutral-950 leading-tight md:text-6xl md:leading-none">
            Equipos para tu obra, sin que nada se detenga
          </h1>

          <p className="mt-6 max-w-xl font-sans text-base font-medium leading-6 text-neutral-600">
            Maquinaria mantenida y lista para producir, con soporte técnico en
            Medellín, Pereira y Armenia. Cotizas, despachamos a tu obra y te
            acompañamos.
          </p>

          <div className="mt-8 flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row">
            <a
              href={waLink(
                "Hola Equipos y Equipos, quiero cotizar el alquiler de un equipo."
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-10 w-full items-center justify-center gap-1.5 whitespace-nowrap rounded-md bg-neutral-900 px-2.5 text-sm font-medium text-white transition-colors hover:bg-neutral-900/90 sm:w-auto"
            >
              Cotizar por WhatsApp
            </a>
            <Link
              href="/equipos"
              className="inline-flex h-10 w-full items-center justify-center gap-1.5 whitespace-nowrap rounded-md border border-neutral-200 bg-white px-2.5 text-sm font-medium text-neutral-900 shadow-sm transition-colors hover:bg-neutral-100 sm:w-auto"
            >
              Ver equipos
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-12 max-w-6xl px-6 md:mt-16">
        <div className="grid grid-cols-3 gap-4 md:gap-6">
          {IMAGES.map((img) => (
            <div
              key={img.src}
              className="relative aspect-[3/4] overflow-hidden rounded-lg bg-neutral-100"
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="(max-width: 768px) 33vw, 33vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </section>

    <section id="equipos" className="bg-white text-neutral-900">
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <div className="flex max-w-2xl flex-col items-start text-left">
          <span className="rounded-full border border-hazard bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-900">
            Líneas
          </span>
          <h2 className="mt-5 font-sans text-4xl font-semibold tracking-normal text-neutral-950 md:text-5xl md:leading-tight">
            Equipos para cada etapa de tu obra
          </h2>
          <p className="mt-5 text-base leading-7 text-neutral-500">
            Maquinaria mantenida y lista para despacho. De la cimentación al
            acabado, cubrimos cada frente de tu obra.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {CELLS.map((cell, i) => {
            if (cell.type === "text") return <TarjetaTexto key={i} {...cell} />;

            if (cell.type === "image")
              return (
                <div
                  key={i}
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
              );

            // duo: el par entero es UN item de la grilla y el group vive acá,
            // así el hover se dispara igual sobre la foto que sobre el texto.
            // Adentro va una grilla de dos columnas que reproduce exactamente
            // las medidas de la de afuera, así que el layout no cambia.
            return (
              <div key={i} className="group md:col-span-2">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:gap-5">
                  {/* z-10: los items pintan en orden del DOM, sin esto el texto
                      quedaría encima de la foto expandida. Va permanente y no
                      solo en hover, porque si el z se fuera al soltar, la foto
                      se escondería a mitad del repliegue.
                      El 200% resuelve contra la celda (el hijo es absolute):
                      dos columnas justas, más el 1.25rem del gap-5.
                      Solo en lg: con 1 o 2 columnas el par ya ocupa el ancho
                      completo y no hay nada al lado que invadir. */}
                  <div className="relative z-10 aspect-[3/4]">
                    <div className="absolute left-0 top-0 h-full w-full overflow-hidden rounded-xl bg-neutral-100 transition-[width] duration-500 [transition-timing-function:var(--ease-out-expo)] lg:group-hover:w-[calc(200%+1.25rem)]">
                      <Image
                        src={cell.foto.src}
                        alt={cell.foto.alt}
                        fill
                        sizes="(max-width: 768px) 100vw, 25vw"
                        className="object-cover transition-opacity duration-500 lg:group-hover:opacity-0"
                      />
                      <Image
                        src={cell.ancha.src}
                        alt=""
                        aria-hidden
                        fill
                        sizes="(min-width: 1024px) 50vw, 25vw"
                        className="object-cover opacity-0 transition-opacity duration-500 lg:group-hover:opacity-100"
                      />

                      {/* Título y CTA sobre la foto expandida. Devuelve el link
                          que la foto tapaba al crecer sobre la tarjeta.
                          aria-hidden + tabIndex -1: duplica el link que ya está
                          en la tarjeta de abajo, así no se anuncia dos veces ni
                          se puede tabular a algo invisible. Solo mouse. */}
                      <div
                        aria-hidden
                        className="pointer-events-none absolute inset-0 flex flex-col justify-end opacity-0 transition-opacity duration-500 lg:group-hover:pointer-events-auto lg:group-hover:opacity-100"
                      >
                        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/85 via-neutral-950/25 to-transparent" />
                        <div className="relative p-7 md:p-8">
                          <h3 className="font-sans text-2xl font-medium tracking-tight text-white">
                            {cell.texto.title}
                          </h3>
                          <a
                            href={waLink(
                              `Hola Equipos y Equipos, quiero información sobre ${cell.texto.title}.`
                            )}
                            target="_blank"
                            rel="noopener noreferrer"
                            tabIndex={-1}
                            className="mt-3 inline-block text-sm font-medium text-white underline underline-offset-4 transition-colors hover:text-hazard"
                          >
                            Más información
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>

                  <TarjetaTexto {...cell.texto} />
                </div>
              </div>
            );
          })}
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

    <Nosotros />

    <Faq />

    <Contacto />
    </>
  );
}
