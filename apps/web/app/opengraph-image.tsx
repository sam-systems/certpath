import { ImageResponse } from "next/og";

// Imagen de previsualización social (LinkedIn, Twitter/X, WhatsApp…).
// Next.js la enlaza automáticamente como og:image + twitter:image.
export const alt = "CertPath — Certificaciones y roadmaps tecnológicos";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0f172a",
          padding: "72px",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              display: "flex",
              width: 64,
              height: 64,
              borderRadius: 16,
              background: "#ffffff",
              color: "#0f172a",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 40,
              fontWeight: 800,
            }}
          >
            C
          </div>
          <div style={{ fontSize: 40, fontWeight: 700 }}>CertPath</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ fontSize: 66, fontWeight: 800, lineHeight: 1.08 }}>
            Certificaciones y roadmaps tecnológicos
          </div>
          <div style={{ fontSize: 30, color: "#94a3b8" }}>
            Cloud · Ciberseguridad · Redes · Linux · DevOps · IA
          </div>
        </div>

        <div style={{ display: "flex", gap: 40, fontSize: 27, color: "#cbd5e1" }}>
          <div style={{ display: "flex" }}>392 certificaciones</div>
          <div style={{ display: "flex" }}>27 roadmaps</div>
          <div style={{ display: "flex" }}>España · Europa · Mundial</div>
        </div>
      </div>
    ),
    { ...size },
  );
}
