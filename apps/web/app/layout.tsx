import type { Metadata } from "next";
import "./globals.css";
import { AppShell } from "@/components/AppShell";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ||
      "https://certpath-web-production.up.railway.app",
  ),
  title: {
    default: "CertPath — Certificaciones y roadmaps tecnológicos",
    template: "%s · CertPath",
  },
  description:
    "Catálogo de certificaciones, roadmaps profesionales interactivos, libros y diagramas de arquitectura en Cloud, Ciberseguridad, Redes, Linux, DevOps e IA. España, Europa y mundial.",
  keywords: [
    "certificaciones",
    "roadmap",
    "ciberseguridad",
    "cloud",
    "redes",
    "DevOps",
    "Linux",
    "Azure",
    "AWS",
    "CCNA",
    "CompTIA",
    "formación IT",
  ],
  authors: [{ name: "CertPath" }],
  openGraph: {
    title: "CertPath — Certificaciones y roadmaps tecnológicos",
    description:
      "Encuentra qué certificación necesitas para cada rol, sigue un roadmap interactivo y lleva tu progreso.",
    type: "website",
    locale: "es_ES",
    siteName: "CertPath",
  },
  twitter: {
    card: "summary_large_image",
    title: "CertPath",
    description:
      "Certificaciones, roadmaps interactivos, libros y arquitecturas para tu carrera IT.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
