/** @type {import('next').NextConfig} */
// Origen real de la API. En producción la web hace de proxy de /api/* hacia aquí,
// para que el navegador y la API compartan dominio y la cookie de sesión sea de
// "primera parte" (no la bloquean Chrome/Brave como cookie de terceros).
const API_ORIGIN =
  process.env.API_ORIGIN || "https://certpath-api-production.up.railway.app";

const nextConfig = {
  reactStrictMode: true,
  // Imagen Docker mínima (server.js autónomo)
  output: "standalone",
  async rewrites() {
    return [{ source: "/api/:path*", destination: `${API_ORIGIN}/api/:path*` }];
  },
};

export default nextConfig;
