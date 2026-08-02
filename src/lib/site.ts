/**
 * Origen del sitio, en un solo lugar.
 *
 * Todo lo que se sirve a buscadores y a crawlers de redes tiene que ser
 * absoluto: og:image, canonical, sitemap, robots y el JSON-LD. Antes esa base
 * estaba escrita a mano como https://equiposyequipos.com.co en cuatro archivos
 * distintos, y como el dominio todavía apunta al WordPress viejo, la imagen de
 * Open Graph resolvía a una URL que da 404. Resultado: el link pegado en
 * WhatsApp salía sin preview.
 *
 * Mientras no se apunte el dominio, la base es la URL de Vercel (que sí sirve
 * estos archivos) y el sitio va en noindex: publicar una copia del negocio del
 * cliente, con su NAP y su LocalBusiness, en un dominio ajeno solo le compite
 * al original y le ensucia los datos a Google.
 *
 * Al entregar: definir NEXT_PUBLIC_SITE_URL con el dominio real. Eso arregla
 * las URLs absolutas y habilita la indexación de una sola vez.
 */
const FALLBACK = "https://equipos-y-equipos.vercel.app";

const configurado = process.env.NEXT_PUBLIC_SITE_URL?.trim();

export const SITE_URL = (configurado || FALLBACK).replace(/\/+$/, "");

/** Solo indexamos cuando el sitio corre en su dominio definitivo. */
export const INDEXABLE = Boolean(configurado);
