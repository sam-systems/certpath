import type { MetadataRoute } from "next";

const BASE =
  process.env.NEXT_PUBLIC_SITE_URL ||
  "https://certpath-web-production.up.railway.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Zonas privadas / sin valor para buscadores
      disallow: ["/admin", "/login", "/dashboard"],
    },
    sitemap: `${BASE}/sitemap.xml`,
    host: BASE,
  };
}
