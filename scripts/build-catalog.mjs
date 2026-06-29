// Construye src/data/catalog.ts desde el scrape de equiposyequipos.com.co (WordPress).
// Copia las imagenes reales de producto a public/equipos/.
// Uso: node scripts/build-catalog.mjs
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const PAGES = path.join(ROOT, "scrape", "data", "pages.json");
const SRC_IMG = path.join(ROOT, "scrape", "img");
const DST_IMG = path.join(ROOT, "public", "equipos");
const OUT = path.join(ROOT, "src", "data", "catalog.ts");

const LOGO_FILE = "equipos-y-equipos-sas.png";
const SKIP_SLUGS = new Set(["home", "nuestra-empresa", "sedes", "contactenos"]);
const SKIP_RE = /politica|aviso|tratamiento|circular|solicitud|pagare|autorizacion/i;

// Blurb por categoria (copy provisional, voz humana; revisar/afinar). TODO: copy final.
const BLURB = {
  "andamios": "Andamios de carga, tijera, modulares y colgantes para trabajo seguro en altura.",
  "formaleteria-para-columna-y-muro": "Formaletas metalicas para columnas cuadradas, circulares y muros pantalla.",
  "formaleteria-para-losas": "Tacos, tableros y cerchas metalicas para el encofrado de losas.",
  "concretadoras": "Concretadoras electricas para mezcla uniforme de concreto en obra.",
  "vibradores-y-compactadores": "Vibradores de concreto y vibrocompactadores tipo canguro y rana.",
  "mini-cargadores": "Minicargadores Caterpillar con pala para carga y movimiento de material.",
  "cortadoras": "Cortadoras de piso y de adobe con disco para cortes precisos.",
  "compresores": "Compresores con martillos neumaticos para demolicion y perforacion.",
  "equipos-de-traccion-vertical": "Molinetes, poleas, plumas grua y diferenciales para izaje de carga.",
  "rodillos-compactadores": "Rodillos Ingersoll Rand de doble tambor para bases y asfalto.",
  "basculas-500kgs": "Basculas industriales de hasta 500 kg para control de peso en obra.",
  "allanadoras": "Allanadoras de 36'' con plato o aspas para acabado fino del concreto.",
};

const slugify = (s) =>
  s.toLowerCase()
    .normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const pages = JSON.parse(fs.readFileSync(PAGES, "utf8"));
fs.mkdirSync(DST_IMG, { recursive: true });

// Limpia /equipos previos (eran del proyecto base, no de esta marca)
for (const f of fs.readdirSync(DST_IMG)) fs.rmSync(path.join(DST_IMG, f), { force: true });

const categories = [];
const products = [];
const usedSlug = new Set();
let copied = 0;

for (const pg of pages) {
  if (SKIP_SLUGS.has(pg.slug) || SKIP_RE.test(pg.slug) || !pg.slug) continue;
  const names = (pg.headings.h1 || []).slice(2); // [0]=categoria, [1]="Nuestros Productos"
  if (!names.length) continue;
  const catName = pg.headings.h1[0];
  const catSlug = pg.slug;
  const imgs = (pg.images || []).filter((i) => i !== LOGO_FILE && !/transparent|blank/i.test(i));

  let count = 0;
  names.forEach((rawName, i) => {
    const name = rawName.replace(/\s+/g, " ").trim();
    let slug = slugify(name);
    let n = 2;
    const base = slug;
    while (usedSlug.has(slug)) slug = `${base}-${n++}`;
    usedSlug.add(slug);

    // imagen: copia a public/equipos manteniendo nombre legible
    let image = null;
    const file = imgs[i];
    if (file && fs.existsSync(path.join(SRC_IMG, file))) {
      fs.copyFileSync(path.join(SRC_IMG, file), path.join(DST_IMG, file));
      image = `/equipos/${file}`;
      copied++;
    }
    products.push({
      id: products.length + 1,
      name,
      slug,
      description: BLURB[catSlug] || "",
      image,
      categories: [catSlug],
      categoryNames: [catName],
    });
    count++;
  });

  categories.push({ id: categories.length + 1, name: catName, slug: catSlug, count });
}

const ts = `// AUTO-GENERADO por scripts/build-catalog.mjs — no editar a mano.
// Fuente: equiposyequipos.com.co (scrape). Descripciones provisionales (TODO: copy final).

export type Category = {
  id: number;
  name: string;
  slug: string;
  count: number;
};

export type Product = {
  id: number;
  name: string;
  slug: string;
  description: string;
  image: string | null;
  categories: string[];
  categoryNames: string[];
};

export const categories: Category[] = ${JSON.stringify(categories, null, 2)};

export const products: Product[] = ${JSON.stringify(products, null, 2)};

export const getProduct = (slug: string) =>
  products.find((p) => p.slug === slug);

export const getCategory = (slug: string) =>
  categories.find((c) => c.slug === slug);

export const productsByCategory = (slug: string) =>
  products.filter((p) => p.categories.includes(slug));
`;

fs.writeFileSync(OUT, ts);
console.log(`OK: ${products.length} productos, ${categories.length} categorias, ${copied} imagenes copiadas.`);
console.log("Categorias:", categories.map((c) => `${c.slug}(${c.count})`).join(", "));
