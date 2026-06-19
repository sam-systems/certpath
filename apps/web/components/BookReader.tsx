"use client";

import { useEffect, useRef, useState } from "react";

export function BookReader({ url }: { url: string }) {
  const isEpub = url.toLowerCase().split("?")[0].endsWith(".epub");
  if (!isEpub) {
    // PDF u otros documentos → visor nativo del navegador
    return (
      <iframe
        src={url}
        title="Documento"
        className="h-[75vh] w-full rounded-md border border-line bg-white"
      />
    );
  }
  return <EpubView url={url} />;
}

function EpubView({ url }: { url: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const rendition = useRef<{ prev: () => void; next: () => void; destroy?: () => void } | null>(null);
  const [err, setErr] = useState(false);

  useEffect(() => {
    let book: { destroy?: () => void } | null = null;
    let rend: { display: () => Promise<void>; destroy?: () => void } | null = null;
    (async () => {
      try {
        const mod = await import("epubjs");
        const ePub = (mod as unknown as { default: (u: string) => unknown }).default;
        if (!ref.current) return;
        book = ePub(url) as { renderTo: (el: HTMLElement, o: object) => typeof rend } & {
          destroy?: () => void;
        };
        rend = (book as { renderTo: (el: HTMLElement, o: object) => typeof rend }).renderTo(
          ref.current,
          { width: "100%", height: 620, spread: "none" },
        );
        await rend!.display();
        rendition.current = rend as unknown as {
          prev: () => void;
          next: () => void;
        };
      } catch {
        setErr(true);
      }
    })();
    return () => {
      try {
        rend?.destroy?.();
        book?.destroy?.();
      } catch {
        /* noop */
      }
    };
  }, [url]);

  if (err)
    return (
      <p className="text-sm text-muted">
        No se pudo abrir el EPUB aquí.{" "}
        <a href={url} target="_blank" className="text-brand underline">
          Descargar / abrir en pestaña
        </a>
      </p>
    );

  return (
    <div>
      <div ref={ref} className="rounded-md border border-line bg-white" />
      <div className="mt-2 flex gap-2">
        <button
          onClick={() => rendition.current?.prev()}
          className="rounded-md border border-line px-3 py-1.5 text-sm hover:bg-canvas"
        >
          ← Anterior
        </button>
        <button
          onClick={() => rendition.current?.next()}
          className="rounded-md border border-line px-3 py-1.5 text-sm hover:bg-canvas"
        >
          Siguiente →
        </button>
      </div>
    </div>
  );
}
