# Conequipos — Alquiler de equipos para construcción

Reconstrucción premium del sitio de [conequipos.com.co](https://conequipos.com.co)
(WordPress/WooCommerce lento) en un stack moderno, rápido y con estética
*dark industrial* nivel AWWWARDS.

## Stack

- **Next.js 16** (App Router, RSC, SSG) + **TypeScript**
- **Tailwind CSS v4** — design system propio en `globals.css`
- **Lenis** — smooth scroll
- **GSAP + ScrollTrigger** — reveals, parallax, timeline del hero
- **next/image** — imágenes locales optimizadas
- Catálogo *quemado* a estático: `src/data/catalog.ts` (95 productos, 10 categorías)

## Diseño

Esencia respetada (verde + negro del logo) elevada a premium:

| Token | Valor | Uso |
|-------|-------|-----|
| `--color-ink` | `#0a0b0c` | fondo casi negro |
| `--color-brand` | `#1fa64a` | verde Conequipos |
| `--color-brand-glow` | `#34e27a` | acentos / glow neón |
| `--color-bone` | `#f3f5f1` | texto |

Fuentes: **Space Grotesk** (display), **Geist** (texto), **Geist Mono** (labels).

## Rutas

- `/` — home (hero animado, categorías, destacados, stats, proceso, CTA)
- `/equipos` — catálogo con filtros + búsqueda
- `/equipos/[slug]` — ficha de producto (95 SSG)
- `/categoria/[slug]` — listado por categoría (10 SSG)
- `/nosotros`, `/experiencias`, `/contacto`

## Desarrollo

```bash
npm run dev      # http://localhost:3000
npm run build    # build de producción (115 páginas estáticas)
npm start
```

## Datos

El catálogo se generó scrapeando la WooCommerce Store API del sitio original.

```bash
node scripts/build-data.mjs   # regenera src/data/catalog.ts + baja imágenes a public/equipos
```

Los datos crudos viven en `/scrape` (gitignored). CTA de venta = WhatsApp
(`(+57) 314 603 2406`), ya que el negocio cotiza por mensaje (sin precios públicos).
