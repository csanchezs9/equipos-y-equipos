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
// La foto es un plano cenital lleno de varilla y el logo cae justo encima. Con
// poco velo el wordmark se pierde entre el detalle, así que va fuerte y con un
// desenfoque leve: la obra se sigue reconociendo pero deja de competir.
const VELO = 0.68;
const DESENFOQUE = 2.5;
const LOGO_ANCHO = 640;

// Azul de marca aclarado para fondo oscuro (--color-brand-glow del sitio). El
// azul marino original es demasiado oscuro: sobre la foto ya velada queda en
// ~1.5:1 y el wordmark se hunde. Este sigue siendo el azul de la marca, solo
// que en la variante que se usa en reversa.
const AZUL_CLARO = [79, 169, 232];

// Recorte vertical de la foto: deja fuera el cielo y los edificios del fondo y
// centra la cuadrilla sobre la losa.
const FUENTE = join(raiz, "public/fotos/obra-losa-cuadrilla.jpg");
const RECORTE = { left: 0, top: 198, width: 1400, height: 735 };

const foto = await sharp(FUENTE)
  .extract(RECORTE)
  .resize(ANCHO, ALTO, { fit: "cover" })
  .blur(DESENFOQUE)
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
 * El wordmark viene aplanado sobre blanco (297x136, sin transparencia real).
 * Acá se le devuelve el canal alfa deshaciendo esa composición, así conserva
 * sus colores de marca (azul y naranja) y no aparece el rectángulo blanco.
 *
 * La fórmula es la inversa de "componer sobre blanco":
 *   visto = color*a + 255*(1-a)
 * De ahí a = 1 - min(r,g,b)/255, y despejando color = (visto - 255*(1-a)) / a.
 * Funciona también en los bordes suavizados, que salen semitransparentes en vez
 * de con una orla blanca.
 */
async function wordmarkSinFondo() {
  const { data, info } = await sharp(
    join(raiz, "public/brand/equiposyequipos-logo.png")
  )
    .resize({ width: LOGO_ANCHO })
    .flatten({ background: "#ffffff" })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const min = Math.min(r, g, b);
    const a = 255 - min;

    if (a === 0) {
      data[i + 3] = 0;
      continue;
    }

    // Reescala cada canal quitándole el blanco que traía debajo.
    const cr = Math.round(((r - min) * 255) / a);
    const cg = Math.round(((g - min) * 255) / a);
    const cb = Math.round(((b - min) * 255) / a);

    // El naranja del techo y de los filetes se respeta; el azul marino pasa a
    // la variante clara para que se despegue del fondo.
    const esNaranja = cr > 150 && cb < 120 && cr > cb;
    const [nr, ng, nb] = esNaranja ? [cr, cg, cb] : AZUL_CLARO;

    data[i] = nr;
    data[i + 1] = ng;
    data[i + 2] = nb;
    data[i + 3] = a;
  }

  return sharp(data, { raw: info }).png().toBuffer();
}

const logo = await wordmarkSinFondo();
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
