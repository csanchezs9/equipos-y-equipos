import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// NAP verificado (scrape de equiposyequipos.com.co). NO inventar datos.
export const WHATSAPP = "573113095760";
export const WHATSAPP_DISPLAY = "(+57) 311 309 5760";
export const PHONE = "(604) 444 4880"; // Sede principal Medellín / Itagüí
export const EMAIL = "info@equiposyequiposltda.com.co";

// Formato de vinculación de clientes (razón social, NIT, datos de la obra,
// facturación y cláusulas del contrato). Copiado del WordPress viejo a
// public/docs para que la web nueva no dependa de que ese sitio siga en pie.
export const FORMATO_VINCULACION = "/docs/solicitud-vinculacion-eye-sas.pdf";

// Documentos de habeas data + pagaré, tal como los publican hoy. Mismo criterio
// que arriba: servidos desde public/docs, no desde el WordPress.
export const DOCS_LEGALES: { label: string; href: string }[] = [
  {
    label: "Tratamiento de bases de datos personales",
    href: "/docs/politica-tratamiento-bases-datos.pdf",
  },
  {
    label: "Aviso de privacidad bases de datos",
    href: "/docs/aviso-privacidad-bases-datos.pdf",
  },
  {
    label: "Autorización tratamiento datos personales",
    href: "/docs/autorizacion-tratamiento-datos-personales.pdf",
  },
  {
    label: "Circular clientes y proveedores",
    href: "/docs/circular-clientes-y-proveedores.pdf",
  },
  { label: "Pagaré", href: "/docs/pagare-eye-sas.pdf" },
];

export type Sede = {
  ciudad: string;
  detalle: string;
  direccion: string;
  telefono: string;
  email: string;
};

// Tres sedes verificadas. Tels/PBX tal como aparecen en su sitio.
export const SEDES: Sede[] = [
  {
    ciudad: "Medellín",
    detalle: "Itagüí · San Fernando",
    direccion: "Cra 50GG # 12 sur 80, Itagüí",
    telefono: "(604) 444 4880",
    email: "info@equiposyequiposltda.com.co",
  },
  {
    ciudad: "Pereira",
    detalle: "Centro",
    direccion: "Av. del Río Cra 1 # 4 - 89, Local 5",
    telefono: "(606) 316 0646",
    email: "pereira@equiposyequiposltda.com.co",
  },
  {
    ciudad: "Armenia",
    detalle: "Centro",
    direccion: "Cra 19 # 23 - 32",
    telefono: "(606) 741 1562",
    email: "armenia@equiposyequiposltda.com.co",
  },
];

export function waLink(message: string) {
  return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(message)}`;
}
