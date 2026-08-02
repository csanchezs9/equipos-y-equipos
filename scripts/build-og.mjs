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
const VELO = 0.58; // cuánto se oscurece la foto para que el logo respire
const LOGO_ANCHO = 520;

// Recorte vertical de la foto: deja fuera el cielo y los edificios del fondo y
// centra la cuadrilla sobre la losa.
const FUENTE = join(raiz, "public/fotos/obra-losa-cuadrilla.jpg");
const RECORTE = { left: 0, top: 198, width: 1400, height: 735 };

const foto = await sharp(FUENTE)
  .extract(RECORTE)
  .resize(ANCHO, ALTO, { fit: "cover" })
  .toBuffer();

const velo = await sharp({
  create: {
    width: ANCHO,
    height: ALTO,
    channels: 4,
    background: { r: 8, g: 8, b: 10, alpha: VELO },
  },
})
  .png()
  .toBuffer();

/**
 * Versión invertida de la marca: el azul pasa a blanco y el naranja se queda.
 *
 * El logo original es azul marino sobre transparente, y sobre la foto ya
 * oscurecida el azul se hunde (queda en ~1.3:1 contra el fondo). Pasarlo a
 * blanco es lo que hace cualquier marca para fondo oscuro, y el naranja del
 * techo aguanta tal cual.
 */
async function marcaEnClaro() {
  const { data, info } = await sharp(join(raiz, "public/brand/ee-mark-croped.png"))
    .resize({ width: LOGO_ANCHO })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] === 0) continue; // transparente, no tocar
    const [r, g, b] = [data[i], data[i + 1], data[i + 2]];
    // El naranja de marca es rojo alto y azul bajo. Todo lo demás (el azul
    // marino y los bordes suavizados contra él) se va a blanco.
    const esNaranja = r > 150 && g > 70 && b < 110;
    if (!esNaranja) {
      data[i] = 255;
      data[i + 1] = 255;
      data[i + 2] = 255;
    }
  }

  return sharp(data, { raw: info }).png().toBuffer();
}

const logo = await marcaEnClaro();
const { width: lw, height: lh } = await sharp(logo).metadata();

const salida = await sharp(foto)
  .composite([
    { input: velo, top: 0, left: 0 },
    {
      input: logo,
      top: Math.round((ALTO - lh) / 2),
      left: Math.round((ANCHO - lw) / 2),
    },
  ])
  .jpeg({ quality: 82, mozjpeg: true })
  .toBuffer();

for (const destino of ["src/app/opengraph-image.jpg", "src/app/twitter-image.jpg"]) {
  await sharp(salida).toFile(join(raiz, destino));
}

console.log(
  `og ${ANCHO}x${ALTO} · ${(salida.length / 1024).toFixed(0)}KB · logo ${lw}x${lh}`
);
