import type { MetadataRoute } from "next";
import { SITE_URL, INDEXABLE } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  // Sin dominio propio el sitio es un demo: se cierra entero para que no
  // compita con el sitio real del cliente ni duplique su ficha de negocio.
  //
  // Los bots de previsualización van aparte y sí entran: facebookexternalhit
  // (el que usa WhatsApp para armar la tarjeta del link) respeta robots.txt,
  // así que un Disallow global dejaría el link sin imagen justo cuando uno se
  // lo manda al cliente para mostrárselo. No indexan nada, solo leen los meta.
  if (!INDEXABLE) {
    return {
      rules: [
        {
          userAgent: [
            "facebookexternalhit",
            "WhatsApp",
            "Twitterbot",
            "LinkedInBot",
            "Slackbot-LinkExpanding",
            "TelegramBot",
            "Discordbot",
          ],
          allow: "/",
        },
        { userAgent: "*", disallow: "/" },
      ],
    };
  }

  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
