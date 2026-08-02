import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { products } from "@/data/catalog";

/**
 * Tarjeta 1200x630 por ficha, para cuando pegan el link de un equipo suelto en
 * WhatsApp. Antes se mandaba el PNG de catálogo tal cual: 400x400 sobre fondo
 * blanco, que sale como miniatura cuadrada al lado del texto en vez de tarjeta
 * grande.
 *
 * Acá sí conviene next/og aunque emita PNG: el fondo es plano y la única foto
 * es el recorte del equipo, así que el archivo queda liviano. La portada del
 * sitio, que es una foto a sangre, va por JPEG estático (scripts/build-og.mjs).
 */
export const alt = "Equipo en alquiler · Equipos y Equipos";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

const BRAND = "#1665ad";
const HAZARD = "#e8821e";

async function comoDataUri(rutaPublica: string) {
  const buf = await readFile(join(process.cwd(), "public", rutaPublica));
  const tipo = rutaPublica.endsWith(".png") ? "image/png" : "image/jpeg";
  return `data:${tipo};base64,${buf.toString("base64")}`;
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = products.find((x) => x.slug === slug);

  const nombre = p?.name ?? "Equipos y Equipos";
  const linea = p?.categoryNames[0] ?? "Alquiler de equipos";

  const logo = await comoDataUri("brand/equiposyequipos-logo.png");
  const foto = p?.image ? await comoDataUri(p.image.replace(/^\//, "")) : null;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "#ffffff",
        }}
      >
        <div style={{ display: "flex", flex: 1 }}>
          {/* Texto */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              width: foto ? 660 : 1200,
              padding: "0 64px",
            }}
          >
            <div
              style={{
                display: "flex",
                fontSize: 26,
                color: HAZARD,
                letterSpacing: -0.2,
              }}
            >
              {linea}
            </div>
            <div
              style={{
                display: "flex",
                marginTop: 18,
                fontSize: nombre.length > 34 ? 58 : 72,
                fontWeight: 700,
                color: "#0a0a0a",
                lineHeight: 1.05,
                letterSpacing: -1.5,
              }}
            >
              {nombre}
            </div>
            <div
              style={{
                display: "flex",
                marginTop: 22,
                fontSize: 28,
                color: "#737373",
              }}
            >
              En alquiler · Medellín, Pereira y Armenia
            </div>
          </div>

          {/* Foto del equipo */}
          {foto ? (
            <div
              style={{
                display: "flex",
                width: 540,
                alignItems: "center",
                justifyContent: "center",
                // Blanco y no gris: los PNG del catálogo vienen recortados
                // sobre fondo blanco opaco, y sobre un panel gris se les nota
                // el cuadrado.
                background: "#ffffff",
              }}
            >
              <img src={foto} alt="" width={430} height={430} style={{ objectFit: "contain" }} />
            </div>
          ) : null}
        </div>

        {/* Pie: filete de marca + logo */}
        <div style={{ display: "flex", height: 6, background: BRAND }} />
        <div
          style={{
            display: "flex",
            height: 132,
            alignItems: "center",
            padding: "0 64px",
          }}
        >
          <img src={logo} alt="" width={192} height={88} />
        </div>
      </div>
    ),
    size
  );
}
