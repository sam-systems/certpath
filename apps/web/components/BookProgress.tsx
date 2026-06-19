"use client";

import { useEffect, useState } from "react";
import { BookOpenCheck, BookMarked, Circle } from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

export type BookStatus = "pendiente" | "leyendo" | "leido";

export const BOOK_STATUS_META: Record<
  BookStatus,
  { label: string; badge: string }
> = {
  pendiente: {
    label: "Pendiente",
    badge: "bg-slate-100 text-slate-600 ring-1 ring-slate-200",
  },
  leyendo: {
    label: "Leyendo",
    badge: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  },
  leido: {
    label: "Leído",
    badge: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  },
};

const NEXT: Record<BookStatus, BookStatus> = {
  pendiente: "leyendo",
  leyendo: "leido",
  leido: "pendiente",
};

export async function saveBookProgress(
  bookSlug: string,
  status: BookStatus,
  currentPage?: number,
) {
  return fetch(`${API}/progress/books`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ bookSlug, status, currentPage }),
  });
}

// Cycler compacto para la lista (controlado por el padre).
export function BookStatusButton({
  status,
  onCycle,
}: {
  status: BookStatus;
  onCycle: (next: BookStatus) => void;
}) {
  const meta = BOOK_STATUS_META[status];
  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onCycle(NEXT[status]);
      }}
      title="Cambiar estado de lectura"
      className={`inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-xs font-medium capitalize transition hover:opacity-80 ${meta.badge}`}
    >
      {status === "leido" ? (
        <BookOpenCheck size={12} />
      ) : status === "leyendo" ? (
        <BookMarked size={12} />
      ) : (
        <Circle size={12} />
      )}
      {meta.label}
    </button>
  );
}

// Panel completo para la página del libro: estado + página actual.
export function BookReadingPanel({
  bookSlug,
  pages,
}: {
  bookSlug: string;
  pages?: number | null;
}) {
  const [authed, setAuthed] = useState(false);
  const [status, setStatus] = useState<BookStatus>("pendiente");
  const [page, setPage] = useState<string>("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    (async () => {
      const me = await fetch(`${API}/auth/me`, { credentials: "include" })
        .then((r) => r.json())
        .catch(() => ({ authenticated: false }));
      if (!me.authenticated) return;
      setAuthed(true);
      const all = await fetch(`${API}/progress/books`, {
        credentials: "include",
      })
        .then((r) => r.json())
        .catch(() => []);
      const mine = (Array.isArray(all) ? all : []).find(
        (p: { bookSlug: string }) => p.bookSlug === bookSlug,
      );
      if (mine) {
        setStatus(mine.status as BookStatus);
        setPage(mine.currentPage ? String(mine.currentPage) : "");
      }
    })();
  }, [bookSlug]);

  async function persist(next: BookStatus, nextPage: string) {
    setStatus(next);
    setPage(nextPage);
    await saveBookProgress(
      bookSlug,
      next,
      nextPage ? Number(nextPage) : undefined,
    );
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  }

  if (!authed) {
    return (
      <div className="rounded-md border border-line bg-canvas p-4 text-sm text-muted">
        <a href="/login" className="font-medium text-brand hover:underline">
          Inicia sesión
        </a>{" "}
        para guardar tu progreso de lectura (estado y página).
      </div>
    );
  }

  const pct =
    pages && page ? Math.min(100, Math.round((Number(page) / pages) * 100)) : 0;

  return (
    <div className="rounded-md border border-line bg-white p-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium">Mi lectura:</span>
        {(["pendiente", "leyendo", "leido"] as BookStatus[]).map((s) => (
          <button
            key={s}
            onClick={() => persist(s, page)}
            className={`rounded px-2 py-1 text-xs font-medium capitalize ring-1 transition ${
              status === s
                ? BOOK_STATUS_META[s].badge
                : "bg-white text-muted ring-line hover:bg-canvas"
            }`}
          >
            {BOOK_STATUS_META[s].label}
          </button>
        ))}
        {saved && <span className="text-xs text-emerald-600">guardado ✓</span>}
      </div>

      <div className="mt-3 flex items-center gap-2 text-sm">
        <label className="text-muted">Página actual:</label>
        <input
          type="number"
          min={0}
          value={page}
          onChange={(e) => setPage(e.target.value)}
          onBlur={() => persist(status, page)}
          className="w-24 rounded-md border border-line px-2 py-1 text-sm outline-none focus:border-brand"
        />
        {pages ? <span className="text-muted">de {pages}</span> : null}
      </div>

      {pages && page ? (
        <div className="mt-3">
          <div className="h-2 w-full overflow-hidden rounded-full bg-line">
            <div
              className="h-2 rounded-full bg-emerald-500 transition-all"
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="mt-1 text-xs text-muted">{pct}% leído</p>
        </div>
      ) : null}
    </div>
  );
}
