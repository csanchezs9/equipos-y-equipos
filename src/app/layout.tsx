import type { Metadata, Viewport } from "next";
import { Inter, Geist_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/smooth-scroll";
import { SiteNav } from "@/components/site-nav";
import { Footer } from "@/components/footer";
import { FloatingActionMenu } from "@/components/floating-action-menu";
import { JsonLd } from "@/components/json-ld";
import { Analitica } from "@/components/analytics";
import {
  organizationSchema,
  localBusinessSchema,
  websiteSchema,
} from "@/lib/schema";
import { SITE_URL, INDEXABLE } from "@/lib/site";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  preload: false, // solo se usa en números puntuales
});
const space = Space_Grotesk({
  variable: "--font-space",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

// La imagen de Open Graph NO se declara acá: la toman por convención de
// src/app/opengraph-image.jpg y src/app/twitter-image.jpg, y así Next emite
// og:image:type, :width y :height correctos. Antes se apuntaba a mano a un
// .webp vertical de 2400x3601 declarado como 1200x630: WhatsApp no renderiza
// webp y las medidas eran mentira. Se regenera con `node scripts/build-og.mjs`.

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Equipos y Equipos · Alquiler de equipos para construcción",
    template: "%s · Equipos y Equipos",
  },
  description:
    "Alquiler y venta de maquinaria certificada para construcción en Itagüí, Medellín y todo Antioquia. Logística ágil, soporte experto y 95% de disponibilidad.",
  applicationName: "Equipos y Equipos",
  authors: [{ name: "Equipos y Equipos" }],
  creator: "Equipos y Equipos",
  publisher: "Equipos y Equipos S.A.S.",
  category: "Construcción",
  keywords: [
    "alquiler de maquinaria",
    "alquiler de equipos para construcción",
    "alquiler maquinaria Itagüí",
    "alquiler maquinaria Medellín",
    "equipos de construcción Antioquia",
    "Valle de Aburrá",
    "andamios",
    "compresores de aire",
    "plantas eléctricas",
    "equipos de concreto",
    "equipos de compactación",
  ],
  alternates: { canonical: "/" },
  // Mientras viva en el dominio de Vercel es un demo y va cerrado. Ver
  // src/lib/site.ts.
  robots: INDEXABLE
    ? {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          "max-image-preview": "large",
          "max-snippet": -1,
          "max-video-preview": -1,
        },
      }
    : { index: false, follow: false, nocache: true },
  openGraph: {
    type: "website",
    locale: "es_CO",
    siteName: "Equipos y Equipos",
    url: "/",
    title: "Equipos y Equipos · Alquiler de equipos para construcción",
    description:
      "Maquinaria certificada para tu obra en Itagüí, Medellín y todo Antioquia. Entrega en obra y soporte experto.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Equipos y Equipos · Alquiler de equipos para construcción",
    description:
      "Maquinaria certificada para tu obra en Itagüí, Medellín y todo Antioquia.",
  },
  formatDetection: { telephone: true, email: true, address: true },
};

// viewport-fit=cover expone env(safe-area-inset-*) para respetar la
// Dynamic Island / notch del iPhone en el navbar fijo.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="es"
      className={`${inter.variable} ${geistMono.variable} ${space.variable} h-full overflow-x-clip`}
    >
      <body className="min-h-full overflow-x-clip bg-ink text-bone grain">
        <JsonLd data={[organizationSchema, localBusinessSchema, websiteSchema]} />
        <SmoothScroll>
          <SiteNav />
          {/* .nav-push se corre a la izquierda cuando el menú lateral abre.
              Solo envuelve el contenido en flujo: los elementos fijos (navbar,
              FAB) van por fuera con .nav-push-fixed, porque un ancestro con
              transform les rompería el position:fixed. */}
          <div className="nav-push">
            <main className="overflow-x-clip">{children}</main>
            <Footer />
          </div>
          <FloatingActionMenu />
        </SmoothScroll>
        <Analitica />
      </body>
    </html>
  );
}
