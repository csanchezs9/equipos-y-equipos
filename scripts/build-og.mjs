// Genera la imagen de Open Graph del sitio (la que sale cuando pegan el link
// en WhatsApp, Slack o LinkedIn).
//
// Por qué un JPEG estático y no next/og: ImageResponse solo emite PNG, y un PNG
// de 1200x630 con una foto adentro pesa más de 1MB. WhatsApp descarta el
// preview cuando la imagen pesa mucho, así que la foto tiene que ir en JPEG.
// Las fichas sí usan next/og porque son fondo plano y el PNG queda liviano.
//
// Correr con: node scripts/build-og.mjs
import sharp from "sharp";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const raiz = join(dirname(fileURLToPath(import.meta.url)), "..");

const ANCHO = 1200;
const ALTO = 630;
const BANDA = 150; // franja blanca de abajo donde va el logo
const FOTO_ALTO = ALTO - BANDA;
const FILETE = 4; // línea azul de marca entre foto y franja
const BRAND = { r: 0x16, g: 0x65, b: 0xad };

// Recorte vertical de la foto: deja fuera el cielo y los edificios del fondo y
// centra la cuadrilla sobre la losa.
const FUENTE = join(raiz, "public/fotos/obra-losa-cuadrilla.jpg");
const RECORTE = { left: 0, top: 198, width: 1400, height: 735 };

const foto = await sharp(FUENTE)
  .extract(RECORTE)
  .resize(ANCHO, FOTO_ALTO, { fit: "cover" })
  .toBuffer();

const logo = await sharp(join(raiz, "public/brand/equiposyequipos-logo.png"))
  .resize({ height: 88 })
  .toBuffer();
const { width: logoAncho } = await sharp(logo).metadata();

const filete = await sharp({
  create: {
    width: ANCHO,
    height: FILETE,
    channels: 3,
    background: BRAND,
  },
})
  .png()
  .toBuffer();

const salida = await sharp({
  create: {
    width: ANCHO,
    height: ALTO,
    channels: 3,
    background: { r: 255, g: 255, b: 255 },
  },
})
  .composite([
    { input: foto, top: 0, left: 0 },
    { input: filete, top: FOTO_ALTO, left: 0 },
    // El logo trae fondo blanco propio, así que sobre la franja blanca calza
    // sin recorte ni halo.
    {
      input: logo,
      top: FOTO_ALTO + FILETE + Math.round((BANDA - FILETE - 88) / 2),
      left: 56,
    },
  ])
  .jpeg({ quality: 82, mozjpeg: true })
  .toBuffer();

for (const destino of ["src/app/opengraph-image.jpg", "src/app/twitter-image.jpg"]) {
  await sharp(salida).toFile(join(raiz, destino));
}

console.log(
  `og ${ANCHO}x${ALTO} · ${(salida.length / 1024).toFixed(0)}KB · logo ${logoAncho}px`
);
