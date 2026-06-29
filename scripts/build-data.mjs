// Procesa el scrape de WooCommerce -> dataset limpio + imagenes locales.
// Uso: node scripts/build-data.mjs <rutaScrapeData>
import fs from "node:fs";
import path from "node:path";
import https from "node:https";

const SRC = process.argv[2] || path.join(process.cwd(), "scrape", "data");
const ROOT = process.cwd();
const IMG_DIR = path.join(ROOT, "public", "equipos");
const OUT = path.join(ROOT, "src", "data", "catalog.ts");

fs.mkdirSync(IMG_DIR, { recursive: true });
fs.mkdirSync(path.dirname(OUT), { recursive: true });

const products = JSON.parse(fs.readFileSync(path.join(SRC, "products.json"), "utf8"));
const categories = JSON.parse(fs.readFileSync(path.join(SRC, "categories.json"), "utf8"));

const NAMED = {
  amp: "&", aacute: "á", eacute: "é", iacute: "í", oacute: "ó", uacute: "ú",
  ntilde: "ñ", Aacute: "Á", Eacute: "É", Iacute: "Í", Oacute: "Ó", Uacute: "Ú",
  Ntilde: "Ñ", nbsp: " ", ndash: "–", mdash: "—", hellip: "…",
  laquo: "«", raquo: "»", deg: "°", ordm: "º", ordf: "ª",
  quot: '"', apos: "'", lsquo: "‘", rsquo: "’", ldquo: "“", rdquo: "”",
};

const decode = (s) =>
  (s || "")
    .replace(/&#x([0-9a-fA-F]+);/g, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(parseInt(d, 10)))
    .replace(/&([a-zA-Z]+);/g, (m, n) => (n in NAMED ? NAMED[n] : m));

const stripHtml = (s) =>
  decode((s || "").replace(/<\/(p|li|br|h\d)>/gi, " ").replace(/<[^>]+>/g, " "))
    .replace(/\s+/g, " ")
    .trim();

const download = (url, dest) =>
  new Promise((resolve) => {
    if (fs.existsSync(dest)) return resolve(true);
    const file = fs.createWriteStream(dest);
    https
      .get(url, { headers: { "User-Agent": "Mozilla/5.0" } }, (res) => {
        if (res.statusCode !== 200) {
          file.close();
          fs.rmSync(dest, { force: true });
          return resolve(false);
        }
        res.pipe(file);
        file.on("finish", () => file.close(() => resolve(true)));
      })
      .on("error", () => {
        fs.rmSync(dest, { force: true });
        resolve(false);
      });
  });

// Categorias con conteo > 0
const cats = categories
  .filter((c) => c.count > 0)
  .map((c) => ({
    id: c.id,
    name: decode(c.name),
    slug: c.slug,
    count: c.count,
  }));

const out = [];
let dl = 0;
for (const p of products) {
  const slug = p.slug;
  const img = p.images?.[0]?.src || null;
  let localImg = null;
  if (img) {
    const ext = (img.split(".").pop() || "jpg").split("?")[0].toLowerCase();
    const filename = `${slug}.${ext}`;
    const ok = await download(img, path.join(IMG_DIR, filename));
    if (ok) {
      localImg = `/equipos/${filename}`;
      dl++;
    }
  }
  out.push({
    id: p.id,
    name: decode(p.name).trim(),
    slug,
    description: stripHtml(p.description) || stripHtml(p.short_description),
    image: localImg,
    categories: (p.categories || []).map((c) => c.slug),
    categoryNames: (p.categories || []).map((c) => decode(c.name)),
  });
}

const ts = `// AUTO-GENERADO por scripts/build-data.mjs — no editar a mano.
// Fuente: conequipos.com.co (WooCommerce Store API)

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

export const categories: Category[] = ${JSON.stringify(cats, null, 2)};

export const products: Product[] = ${JSON.stringify(out, null, 2)};

export const getProduct = (slug: string) =>
  products.find((p) => p.slug === slug);

export const getCategory = (slug: string) =>
  categories.find((c) => c.slug === slug);

export const productsByCategory = (slug: string) =>
  products.filter((p) => p.categories.includes(slug));
`;

fs.writeFileSync(OUT, ts);
console.log(`OK: ${out.length} productos, ${cats.length} categorias, ${dl} imagenes bajadas.`);
console.log(`-> ${OUT}`);
