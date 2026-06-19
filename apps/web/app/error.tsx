"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Punto de enganche para Sentry/observabilidad (ver DEPLOY.md)
    // eslint-disable-next-line no-console
    console.error(error);
  }, [error]);

  return (
    <main className="mx-auto max-w-md px-6 py-20 text-center">
      <h1 className="text-lg font-semibold">Algo ha fallado</h1>
      <p className="mt-2 text-sm text-muted">
        Ha ocurrido un error al cargar esta sección. Puedes reintentar; si
        persiste, comprueba que el API ({" "}
        <code className="text-xs">:4000</code>) está en marcha.
      </p>
      <button
        onClick={reset}
        className="mt-5 rounded-md bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-dark"
      >
        Reintentar
      </button>
    </main>
  );
}
