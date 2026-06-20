import type { MetadataRoute } from "next";
import { getCertifications, getRoadmaps, getBooks, safe } from "../lib/api";

// Generado en cada petición con datos en vivo de la API (safe() evita que un
// fallo de la API rompa el sitemap: en ese caso devuelve solo las páginas fijas).
export const dynamic = "force-dynamic";

const BASE =
  process.env.NEXT_PUBLIC_SITE_URL ||
  "https://certpath-web-production.up.railway.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [certs, roadmaps, books] = await Promise.all([
    safe(getCertifications(), []),
    safe(getRoadmaps(), []),
    safe(getBooks(), []),
  ]);

  const now = new Date();
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE}/certificaciones`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}/roadmaps`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}/libros`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/recursos`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
  ];

  const certPages: MetadataRoute.Sitemap = certs.map((c) => ({
    url: `${BASE}/certificaciones/${c.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const roadmapPages: MetadataRoute.Sitemap = roadmaps.map((r) => ({
    url: `${BASE}/roadmaps/${r.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const bookPages: MetadataRoute.Sitemap = books.map((b) => ({
    url: `${BASE}/libros/${b.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  return [...staticPages, ...certPages, ...roadmapPages, ...bookPages];
}
