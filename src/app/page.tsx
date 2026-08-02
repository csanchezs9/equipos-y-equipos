import Image from "next/image";
import Link from "next/link";
import { waLink } from "@/lib/utils";
import { Faq } from "@/components/faq";
import { Nosotros } from "@/components/nosotros";
import { Contacto } from "@/components/contacto";
import { TextAnimate } from "@/components/text-animate";

type Foto = { src: string; alt: string };
type Texto = { title: string; desc: string };

/**
 * Par foto + texto que ocupa dos columnas y se comporta como una sola pieza: al
 * pasar el mouse por CUALQUIERA de las dos, la foto se estira sobre el texto y
 * cruza a `ancha`.
 *
 * Van juntas en un mismo item de la grilla y no como celdas sueltas porque
 * group-hover necesita un ancestro común, y las celdas sueltas serían hermanas.
 * La alternativa era estado de React, que volvería client component a toda la
 * home por un hover.
 */
type Par = {
  foto: Foto;
  ancha: Foto;
  texto: Texto;
  /** De qué lado va la foto. La expansión siempre va hacia el texto. */
  fotoEn: "izq" | "der";
};

// El orden importa: en la fila de abajo la foto va a la derecha del texto, así
// que ahí la expansión tiene que ir hacia la izquierda.
const PARES: Par[] = [
  {
    fotoEn: "izq",
    foto: {
      src: "/fotos/pexels-michaela-st-3448542-22857379.jpg",
      alt: "Andamios metálicos en altura",
    },
    ancha: {
      src: "/fotos/andamio-fachada-arnes.jpg",
      alt: "Operario con arnés montando andamio sobre la fachada de un edificio",
    },
    texto: {
      title: "Andamios y alturas",
      desc: "Andamios multidireccionales, tijera y colgantes, más equipos de tracción vertical para trabajar seguro en altura.",
    },
  },
  {
    fotoEn: "izq",
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
    fotoEn: "der",
    foto: {
      src: "/fotos/pexels-rahibyaqubov-23978113.webp",
      alt: "Obra de construcción",
    },
    ancha: {
      src: "/fotos/excavadora-cielo-tormenta.jpg",
      alt: "Máquina sobre un terraplén de tierra bajo un cielo cargado",
    },
    texto: {
      title: "Compactación",
      desc: "Rodillos compactadores, ranas y vibrocompactadores para dejar suelos y bases firmes.",
    },
  },
  {
    fotoEn: "der",
    foto: {
      src: "/fotos/pexels-sofoklis-saripanidis-13143901-31499725.webp",
      alt: "Equipo de construcción",
    },
    ancha: {
      src: "/fotos/excavadora-atardecer.jpg",
      alt: "Máquina moviendo tierra a contraluz al atardecer",
    },
    texto: {
      title: "Corte y demolición",
      desc: "Cortadoras de piso, compresores y martillos para corte y demolición precisa.",
    },
  },
];

// Cada foto del hero cruza a `hover` al pasar el mouse.
const IMAGES: { src: string; alt: string; hover: Foto }[] = [
  {
    src: "/hero/pexels-the-jd-darshan-solanki-215282-11959308.webp",
    alt: "Grúas en obra junto al río",
    hover: {
      src: "/hero/torres-gruas-atardecer.jpg",
      alt: "Torres en construcción con grúas al atardecer",
    },
  },
  {
    src: "/hero/pexels-construccion-total-2464540-14420873.webp",
    alt: "Volqueta y cortadora de piso en obra",
    hover: {
      src: "/hero/cuadrilla-zanja-excavadora.jpg",
      alt: "Dos operarios frente a una zanja con una excavadora trabajando",
    },
  },
  {
    src: "/hero/pexels-construccion-total-2464540-6106878.webp",
    alt: "Mezcladora de concreto en obra",
    hover: {
      src: "/hero/volqueta-descargando-contraluz.jpg",
      alt: "Volqueta descargando material a contraluz bajo un viaducto",
    },
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

          <TextAnimate
            as="p"
            animation="slideUp"
            by="word"
            duration={1}
            className="mt-6 max-w-xl font-sans text-base font-medium leading-6 text-neutral-600"
          >
            Maquinaria mantenida y lista para producir, con soporte técnico en
            Medellín, Pereira y Armenia. Cotizas, despachamos a tu obra y te
            acompañamos.
          </TextAnimate>

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
            /* Cruce entre las dos fotos. Las dos hacen un zoom leve en sentidos
               opuestos: la de abajo entra desde 1.05 mientras la de arriba sale
               hacia 1. Así el cambio se lee como un movimiento y no como dos
               capas prendiéndose y apagándose.
               Solo desde sm: en táctil no hay hover y la segunda foto no se
               alcanzaría nunca. */
            <div
              key={img.src}
              className="group relative aspect-[3/4] overflow-hidden rounded-lg bg-neutral-100"
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="(max-width: 768px) 33vw, 33vw"
                className="object-cover transition-[opacity,transform] duration-700 [transition-timing-function:var(--ease-out-expo)] sm:group-hover:scale-105 sm:group-hover:opacity-0"
              />
              <Image
                src={img.hover.src}
                alt=""
                aria-hidden
                fill
                sizes="(max-width: 768px) 33vw, 33vw"
                className="scale-105 object-cover opacity-0 transition-[opacity,transform] duration-700 [transition-timing-function:var(--ease-out-expo)] sm:group-hover:scale-100 sm:group-hover:opacity-100"
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
          {PARES.map((par, i) => {
            // El par entero es UN item de la grilla y el group vive acá, así el
            // hover se dispara igual sobre la foto que sobre el texto. Adentro
            // va una grilla de dos columnas que reproduce las medidas de la de
            // afuera, así que el layout no cambia en ningún breakpoint.
            const fotoIzq = par.fotoEn === "izq";

            const foto = (
              /* z-10: los items pintan en orden del DOM, sin esto el texto
                 quedaría encima de la foto expandida cuando la foto va primero.
                 Va permanente y no solo en hover, porque si el z se fuera al
                 soltar, la foto se escondería a mitad del repliegue.
                 El 200% resuelve contra la celda (el hijo es absolute): dos
                 columnas justas, más el 1.25rem del gap-5.
                 Solo en lg: con 1 o 2 columnas el par ya ocupa el ancho
                 completo y no hay nada al lado que invadir. */
              <div key="foto" className="relative z-10 aspect-[3/4]">
                {/* El anclaje decide hacia dónde crece: con la foto a la
                    izquierda se fija left-0 y el borde derecho avanza; con la
                    foto a la derecha se fija right-0 y avanza el izquierdo. */}
                <div
                  className={`absolute top-0 h-full w-full overflow-hidden rounded-xl bg-neutral-100 transition-[width] duration-500 [transition-timing-function:var(--ease-out-expo)] lg:group-hover:w-[calc(200%+1.25rem)] ${
                    fotoIzq ? "left-0" : "right-0"
                  }`}
                >
                  <Image
                    src={par.foto.src}
                    alt={par.foto.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, 25vw"
                    className="object-cover transition-opacity duration-500 lg:group-hover:opacity-0"
                  />
                  <Image
                    src={par.ancha.src}
                    alt=""
                    aria-hidden
                    fill
                    sizes="(min-width: 1024px) 50vw, 25vw"
                    className="object-cover opacity-0 transition-opacity duration-500 lg:group-hover:opacity-100"
                  />

                  {/* Título y CTA sobre la foto expandida. Devuelve el link que
                      la foto tapaba al crecer sobre la tarjeta.
                      aria-hidden + tabIndex -1: duplica el link que ya está en
                      la tarjeta de al lado, así no se anuncia dos veces ni se
                      puede tabular a algo invisible. Solo mouse. */}
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 flex flex-col justify-end opacity-0 transition-opacity duration-500 lg:group-hover:pointer-events-auto lg:group-hover:opacity-100"
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/85 via-neutral-950/25 to-transparent" />
                    <div className="relative p-7 md:p-8">
                      <h3 className="font-sans text-2xl font-medium tracking-tight text-white">
                        {par.texto.title}
                      </h3>
                      <a
                        href={waLink(
                          `Hola Equipos y Equipos, quiero información sobre ${par.texto.title}.`
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
            );

            const texto = <TarjetaTexto key="texto" {...par.texto} />;

            return (
              <div key={i} className="group md:col-span-2">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:gap-5">
                  {/* El orden del DOM define el lado en desktop y el apilado en
                      móvil, igual que antes de agrupar los pares. */}
                  {fotoIzq ? [foto, texto] : [texto, foto]}
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
