"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="es">
      <body
        style={{
          fontFamily: "Inter, system-ui, sans-serif",
          display: "flex",
          minHeight: "100vh",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ textAlign: "center", padding: "2rem" }}>
          <h1 style={{ fontSize: "1.125rem", fontWeight: 600 }}>
            Error inesperado
          </h1>
          <p style={{ marginTop: ".5rem", color: "#737373", fontSize: ".875rem" }}>
            La aplicación ha encontrado un problema.
          </p>
          <button
            onClick={reset}
            style={{
              marginTop: "1.25rem",
              borderRadius: 6,
              background: "#111",
              color: "#fff",
              padding: ".5rem 1rem",
              fontSize: ".875rem",
            }}
          >
            Reintentar
          </button>
        </div>
      </body>
    </html>
  );
}
