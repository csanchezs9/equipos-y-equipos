@AGENTS.md

## Qué es esto

Refactor de la web de **Equipos y Equipos S.A.S** (https://www.equiposyequipos.com.co) — alquiler de equipos para construcción. Sedes: Medellín (Itagüí), Pereira, Armenia.

- **Landing de una sola página.** No hay rutas extra (`/equipos`, `/nosotros`, etc. se borraron). Toda la nav son anchors a secciones (`#top`, `#equipos`, `#contacto`).
- Idioma **español Colombia**, voz humana/paisa. Sin em-dash.
- No hay catálogo navegable: los CTA abren **WhatsApp** con mensaje precargado (`waLink`).

## Stack

- **Next.js (App Router)** — OJO: versión con breaking changes, lee `node_modules/next/dist/docs/` antes de escribir código (ver AGENTS.md).
- **Tailwind v4** — tokens en `src/app/globals.css` (`@theme`). Lenis + GSAP para smooth scroll (`smooth-scroll.tsx`).
- Secciones nuevas (hero, líneas, footer, navbar) usan paleta **neutral de Tailwind** (`neutral-*`, blanco) + acentos de marca. El resto del sitio viejo usa los tokens `ink/bone/mute`.

## Estructura

- `src/app/layout.tsx` — `<FloatingNav/>` + `<main>` + `<Footer/>`. Sin `<Header/>` (se borró).
- `src/app/page.tsx` — toda la home: **hero** + sección **líneas** (grid). Datos inline (`IMAGES`, `CELLS`).
- `src/components/floating-nav.tsx` — navbar isla pegado arriba, aparece tras scrollear >600px.
- `src/components/footer.tsx` — footer con video de fondo + tarjeta blanca.
- `src/components/logo.tsx` — wordmark SVG (azul/ámbar). Para el navbar se usa el PNG `public/brand/ee-mark.png`.
- `src/lib/utils.ts` — **fuente de verdad de contacto**: `SEDES`, `WHATSAPP`, `WHATSAPP_DISPLAY`, `EMAIL`, `PHONE`, `waLink()`. No inventar datos de contacto.
- `src/data/catalog.ts` — `categories` (12 líneas) + `products`. **Auto-generado** por `scripts/build-catalog.mjs`, no editar a mano.

## Assets

- `public/brand/` — logos (`equiposyequipos-logo.png` 297×136, `ee-mark.png`).
- `public/hero/` — 3 fotos del hero (orden importa).
- `public/fotos/` — banco de fotos de obra (`.webp`).
- `public/videos/footer/` — `footer-bg.mp4` (recortado/optimizado, ~7MB) + `footer-poster.jpg`. Originales pesados se borran tras optimizar con ffmpeg.

## Bloques de shadcnblocks

Estamos replicando bloques de shadcnblocks.com contextualizados a Equipos y Equipos.

- **Replicar fiel, no copiar el class-soup.** Inspeccionar el bloque con playwright leyendo `getComputedStyle` (font-size, weight, padding, radius, colores) y reconstruir con utilidades Tailwind limpias.
- **Contenido propio** siempre (nuestra copy, fotos, líneas de equipo). Nunca dejar el texto/links demo del bloque.
- Tipografía de los bloques = **Inter** (`--font-sans`). El CSS global fuerza `h1..h4` a Space Grotesk (`--font-display`); en secciones estilo shadcn hay que sobreescribir con `font-sans` + `tracking-normal`.
- Bloques ya portados: hero (hero83), footer (footer25), grid de features/líneas.

## Marca / tokens

- `--color-brand` `#1665ad` (azul), `--color-brand-deep` `#0c3c66`, `--color-brand-glow` `#2b8fd9`.
- `--color-hazard` `#e8821e` (ámbar, acento). Botones CTA azules de marca; links hover azul.

## Verificación

- No verificar todo con playwright; solo cuando el usuario lo pida. `npx tsc --noEmit` para typecheck rápido.

## Tipografía — evita el look "IA genérico"

- NO usar `font-mono` + `uppercase` + `tracking-*` en labels/eyebrows/breadcrumbs/texto. Ese combo se ve plantilla genérica.
- `.kicker` ya es sans (no mono, no uppercase, no tracking) — usarlo para eyebrows.
- `font-mono` SOLO para números/datos tabulares (conteos, precios, `24h`, índices), con `tabular-nums`. Nunca para palabras.
- Evita el em-dash `—` en copy; suena a IA. Usa puntuación normal y voz humana/local (paisa).
