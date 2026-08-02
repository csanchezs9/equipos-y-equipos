import type { MetadataRoute } from "next";
import { products } from "@/data/catalog";

const BASE = "https://equiposyequipos.com.co";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    {
      url: BASE,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${BASE}/equipos`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    // Una entrada por ficha de equipo.
    ...products.map((p) => ({
      url: `${BASE}/equipos/${p.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
