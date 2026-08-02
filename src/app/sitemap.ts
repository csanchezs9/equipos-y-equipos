import type { MetadataRoute } from "next";
import { products } from "@/data/catalog";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/equipos`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    // Una entrada por ficha de equipo.
    ...products.map((p) => ({
      url: `${SITE_URL}/equipos/${p.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
