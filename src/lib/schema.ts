// Datos estructurados schema.org centralizados. NAP (nombre/dirección/teléfono)
// en un solo lugar para SEO local + GEO (que los motores generativos citen bien
// quiénes somos, dónde y a quién atendemos).
import { EMAIL } from "@/lib/utils";
import type { Product } from "@/data/catalog";
import { SITE_URL } from "@/lib/site";

const ORG_ID = `${SITE_URL}/#organization`;
const BIZ_ID = `${SITE_URL}/#localbusiness`;

// Teléfono fijo de la sede principal (Medellín / Itagüí) en E.164 (Colombia +57).
const TEL = "+576044444880";
// TODO: redes sociales oficiales (no verificadas en el sitio actual).
const SOCIAL: string[] = [];
const LOGO = `${SITE_URL}/brand/equiposyequipos-logo.png`;

// Ciudades de las 3 sedes + área metropolitana (señal local fuerte).
const AREAS = [
  "Medellín",
  "Itagüí",
  "Envigado",
  "Sabaneta",
  "Bello",
  "Pereira",
  "Dosquebradas",
  "Armenia",
];

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": ORG_ID,
  name: "Equipos y Equipos",
  legalName: "Equipos y Equipos S.A.S.",
  url: SITE_URL,
  logo: LOGO,
  image: LOGO,
  email: EMAIL,
  telephone: TEL,
  description:
    "Alquiler de maquinaria y equipos para construcción con sedes en Medellín, Pereira y Armenia.",
  sameAs: SOCIAL,
  contactPoint: {
    "@type": "ContactPoint",
    telephone: TEL,
    contactType: "sales",
    email: EMAIL,
    areaServed: "CO",
    availableLanguage: ["es-CO", "es"],
  },
};

export const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": BIZ_ID,
  name: "Equipos y Equipos",
  url: SITE_URL,
  logo: LOGO,
  image: LOGO,
  email: EMAIL,
  telephone: TEL,
  priceRange: "$$",
  currenciesAccepted: "COP",
  description:
    "Alquiler de maquinaria y equipos para construcción con sedes en Medellín, Pereira y Armenia: andamios, formaletería, concretadoras, vibradores, rodillos compactadores, minicargadores, compresores y más. Entrega en obra y soporte técnico.",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Cra 50GG # 12 sur 80, San Fernando",
    addressLocality: "Itagüí",
    addressRegion: "Antioquia",
    addressCountry: "CO",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 6.1719,
    longitude: -75.6116,
  },
  areaServed: [
    { "@type": "State", name: "Antioquia" },
    { "@type": "State", name: "Risaralda" },
    { "@type": "State", name: "Quindío" },
    ...AREAS.map((name) => ({ "@type": "City", name })),
  ],
  // Horario estimado — confirmar y ajustar si difiere.
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "07:00",
      closes: "17:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: "Saturday",
      opens: "07:00",
      closes: "12:00",
    },
  ],
  sameAs: SOCIAL,
};

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  url: SITE_URL,
  name: "Equipos y Equipos",
  inLanguage: "es-CO",
  publisher: { "@id": ORG_ID },
};

/**
 * FAQPage a partir de las preguntas que de verdad se ven en la página.
 *
 * Es una función y no una constante a propósito: Google exige que el marcado de
 * FAQ coincida con el contenido visible, y una lista escrita aparte se
 * desincroniza sola en cuanto alguien edita el acordeón. La fuente es el array
 * FAQS de src/components/faq.tsx.
 */
export function faqSchema(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: `${SITE_URL}${it.path}`,
    })),
  };
}

export function productSchema(p: Product) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    sku: p.slug,
    ...(p.image ? { image: [`${SITE_URL}${p.image}`] } : {}),
    description:
      p.description ||
      `Alquiler de ${p.name} para construcción en Medellín, Pereira y Armenia.`,
    ...(p.categoryNames[0] ? { category: p.categoryNames[0] } : {}),
    brand: { "@type": "Brand", name: "Equipos y Equipos" },
    url: `${SITE_URL}/equipos/${p.slug}`,
    // Sin `offers` a propósito. El alquiler se cotiza caso por caso y no hay
    // tarifa publicada; un Offer sin `price` no es "incompleto" para Google,
    // es un error de validación. Mejor Product sin oferta (aviso menor) que
    // Product con oferta inválida. Quién arrienda y dónde va acá abajo.
    provider: { "@id": ORG_ID },
    areaServed: [
      { "@type": "State", name: "Antioquia" },
      { "@type": "State", name: "Risaralda" },
      { "@type": "State", name: "Quindío" },
    ],
  };
}
