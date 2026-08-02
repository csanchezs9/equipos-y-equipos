import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { JsonLd } from "@/components/json-ld";
import { faqSchema } from "@/lib/schema";
import { FORMATO_VINCULACION } from "@/lib/utils";

const FAQS: {
  q: string;
  a: string;
  link?: { label: string; href: string };
}[] = [
  {
    q: "¿Despachan los equipos hasta la obra?",
    a: "Sí. Llevamos la maquinaria directo a tu obra en Medellín y el Valle de Aburrá, Pereira, Armenia y municipios cercanos. Coordinamos el despacho y la recogida cuando termines.",
  },
  {
    q: "¿Cuál es el tiempo mínimo de alquiler?",
    a: "Manejamos alquiler por día, semana y mes. Para obras largas damos mejor tarifa por periodo. Cuéntanos cuántos días la necesitas y te armamos la cotización.",
  },
  {
    q: "¿Los equipos están mantenidos y listos para trabajar?",
    a: "Todos salen revisados y a punto. Hacemos mantenimiento entre cada alquiler para que el equipo llegue produciendo y no te frene la obra. Si algo falla en el alquiler, respondemos.",
  },
  {
    q: "¿Qué necesito para alquilar?",
    a: "Para personas: cédula y un anticipo o garantía según el equipo. Para empresas: llenas el formato de vinculación con la razón social, el NIT, los datos de la obra y a dónde te mandamos la factura. Te explicamos todo por WhatsApp en la cotización.",
    link: {
      label: "Descargar el formato de vinculación (PDF)",
      href: FORMATO_VINCULACION,
    },
  },
  {
    q: "¿Ustedes operan los equipos o solo los alquilan?",
    a: "La mayoría se entregan en alquiler para que tu personal los opere; te damos la indicación de uso y seguridad. Para equipos que requieren operario lo coordinamos aparte. Pregúntanos por el equipo que necesitas.",
  },
  {
    q: "¿Cómo cotizo y cuánto demora?",
    a: "Nos escribes por WhatsApp con el equipo, las fechas y la sede de la obra. Te pasamos precio y disponibilidad el mismo día. Sin vueltas.",
  },
];

export function Faq() {
  return (
    <section id="faq" className="bg-white text-neutral-900">
      {/* El marcado sale del mismo array que se pinta abajo, así no puede
          quedar diciendo algo distinto a lo que el usuario lee. */}
      <JsonLd data={faqSchema(FAQS)} />

      <div className="mx-auto max-w-3xl px-6 py-20 md:py-28">
        <div className="flex flex-col items-start text-left">
          <span className="rounded-full border border-hazard bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-900">
            Preguntas frecuentes
          </span>
          <h2 className="mt-5 font-sans text-4xl font-semibold tracking-normal text-neutral-950 md:text-5xl md:leading-tight">
            Lo que más nos preguntan
          </h2>
          <p className="mt-5 text-base leading-7 text-neutral-500">
            Resolvemos las dudas comunes sobre alquiler, despacho y soporte. Si
            te queda algo, escríbenos y te respondemos al toque.
          </p>
        </div>

        <Accordion type="single" collapsible className="mt-12 w-full">
          {FAQS.map((item, i) => (
            <AccordionItem key={i} value={`item-${i}`}>
              <AccordionTrigger>{item.q}</AccordionTrigger>
              <AccordionContent className="text-base leading-7 text-neutral-500">
                {item.a}
                {item.link && (
                  <a
                    href={item.link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group mt-3 flex w-fit items-center gap-2 text-sm font-medium text-brand transition-colors hover:text-brand-deep"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden
                    >
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <path d="M7 10l5 5 5-5" />
                      <path d="M12 15V3" />
                    </svg>
                    {item.link.label}
                  </a>
                )}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
