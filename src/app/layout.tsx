import type { Metadata } from "next";
import { Inter, Geist_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/smooth-scroll";
import { FloatingNav } from "@/components/floating-nav";
import { Footer } from "@/components/footer";
import { WhatsAppFab } from "@/components/whatsapp-fab";
import { JsonLd } from "@/components/json-ld";
import {
  organizationSchema,
  localBusinessSchema,
  websiteSchema,
} from "@/lib/schema";

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

const OG_IMAGE = "/fotos/pexels-ritesh-arya-1423700-3097103.webp";

export const metadata: Metadata = {
  metadataBase: new URL("https://equiposyequipos.com.co"),
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
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "es_CO",
    siteName: "Equipos y Equipos",
    url: "/",
    title: "Equipos y Equipos · Alquiler de equipos para construcción",
    description:
      "Maquinaria certificada para tu obra en Itagüí, Medellín y todo Antioquia. Entrega en obra y soporte experto.",
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "Equipos y Equipos" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Equipos y Equipos · Alquiler de equipos para construcción",
    description:
      "Maquinaria certificada para tu obra en Itagüí, Medellín y todo Antioquia.",
    images: [OG_IMAGE],
  },
  formatDetection: { telephone: true, email: true, address: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="es"
      className={`${inter.variable} ${geistMono.variable} ${space.variable} h-full overflow-x-hidden`}
    >
      <body className="min-h-full overflow-x-hidden bg-ink text-bone grain">
        <JsonLd data={[organizationSchema, localBusinessSchema, websiteSchema]} />
        <SmoothScroll>
          <FloatingNav />
          <main className="overflow-x-hidden">{children}</main>
          <Footer />
          <WhatsAppFab />
        </SmoothScroll>
      </body>
    </html>
  );
}
