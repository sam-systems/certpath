"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ExternalLink, Plus, Trash2 } from "lucide-react";
import { DOMAINS, BOOK_LEVELS, AUDIENCES, type Book } from "@/lib/api";
import {
  BookStatusButton,
  saveBookProgress,
  type BookStatus,
} from "@/components/BookProgress";
import { useToken } from "@/lib/useToken";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

export default function LibrosPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [domain, setDomain] = useState("");
  const [level, setLevel] = useState("");
  const [audience, setAudience] = useState("");
  const [q, setQ] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [authed, setAuthed] = useState(false);
  const [progress, setProgress] = useState<Record<string, BookStatus>>({});
  const [token] = useToken();

  async function load() {
    const b = await fetch(`${API}/books`)
      .then((r) => r.json())
      .catch(() => []);
    setBooks(Array.isArray(b) ? b : []);
  }
  async function loadProgress() {
    const me = await fetch(`${API}/auth/me`, { credentials: "include" })
      .then((r) => r.json())
      .catch(() => ({ authenticated: false }));
    if (!me.authenticated) return;
    setAuthed(true);
    const all = await fetch(`${API}/progress/books`, { credentials: "include" })
      .then((r) => r.json())
      .catch(() => []);
    const m: Record<string, BookStatus> = {};
    (Array.isArray(all) ? all : []).forEach(
      (p: { bookSlug: string; status: BookStatus }) => {
        m[p.bookSlug] = p.status;
      },
    );
    setProgress(m);
  }
  useEffect(() => {
    load();
    loadProgress();
  }, []);

  async function cycleStatus(slug: string, next: BookStatus) {
    setProgress((p) => ({ ...p, [slug]: next }));
    await saveBookProgress(slug, next);
  }

  async function deleteBook(slug: string, title: string) {
    if (!token) {
      alert('Para borrar, pon el token primero en "Añadir libro".');
      return;
    }
    if (!confirm(`¿Borrar "${title}"? No se puede deshacer.`)) return;
    const res = await fetch(`${API}/books/${slug}`, {
      method: "DELETE",
      headers: { "x-import-token": token },
    }).catch(() => null);
    if (res && res.ok) load();
    else alert("No se pudo borrar (¿token correcto?).");
  }

  const filtered = useMemo(
    () =>
      books.filter(
        (b) =>
          (!domain || b.domain === domain) &&
          (!level || b.level === level) &&
          (!audience || b.audience === audience) &&
          (!q ||
            b.title.toLowerCase().includes(q.toLowerCase()) ||
            b.author.toLowerCase().includes(q.toLowerCase())),
      ),
    [books, domain, level, audience, q],
  );

  return (
    <main className="mx-auto max-w-5xl px-8 py-10">
      <header className="flex items-center justify-between border-b border-line pb-6">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Libros</h1>
          <p className="mt-1 text-sm text-muted">
            {books.length} lecturas · enlace de compra y lector PDF/EPUB
            integrado.
          </p>
        </div>
        <button
          onClick={() => setShowAdd((s) => !s)}
          className="flex items-center gap-1.5 rounded-md bg-brand px-3 py-1.5 text-sm font-medium text-white hover:bg-brand-dark"
        >
          <Plus size={15} /> Añadir libro
        </button>
      </header>

      {showAdd && (
        <AddBookForm
          onAdded={() => {
            load();
            setShowAdd(false);
          }}
        />
      )}

      <div className="mt-6 flex flex-wrap items-center gap-2">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar por título o autor…"
          className="rounded-md border border-line bg-white px-3 py-1.5 text-sm outline-none focus:border-brand"
        />
        <select value={domain} onChange={(e) => setDomain(e.target.value)} className="rounded-md border border-line bg-white px-2.5 py-1.5 text-sm">
          <option value="">Todas las temáticas</option>
          {DOMAINS.map((d) => (
            <option key={d.key} value={d.key}>{d.label}</option>
          ))}
        </select>
        <select value={level} onChange={(e) => setLevel(e.target.value)} className="rounded-md border border-line bg-white px-2.5 py-1.5 text-sm capitalize">
          <option value="">Todos los niveles</option>
          {BOOK_LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
        </select>
        <select value={audience} onChange={(e) => setAudience(e.target.value)} className="rounded-md border border-line bg-white px-2.5 py-1.5 text-sm capitalize">
          <option value="">Todos los públicos</option>
          {AUDIENCES.map((a) => <option key={a} value={a}>{a}</option>)}
        </select>
      </div>

      <div className="mt-6 overflow-hidden rounded-md border border-line">
        <div className="grid grid-cols-12 gap-3 border-b border-line bg-canvas px-4 py-2 text-[11px] font-semibold uppercase tracking-wide text-muted">
          <span className="col-span-4">Título</span>
          <span className="col-span-2">Autor</span>
          <span className="col-span-2">Nivel</span>
          <span className="col-span-2">Lectura</span>
          <span className="col-span-2 text-right">Acciones</span>
        </div>
        {filtered.map((b) => (
          <div
            key={b.id}
            className="grid grid-cols-12 items-center gap-3 border-b border-line px-4 py-2.5 text-sm last:border-0 hover:bg-canvas"
          >
            <Link href={`/libros/${b.slug}`} className="col-span-4 min-w-0">
              <span className="block truncate font-medium">{b.title}</span>
              <span className="block truncate text-xs text-muted">
                {[b.publisher, b.pages ? `${b.pages} págs.` : null, b.audience]
                  .filter(Boolean)
                  .join(" · ")}
              </span>
            </Link>
            <span className="col-span-2 truncate text-muted">{b.author}</span>
            <span className="col-span-2">
              <span className="tag capitalize">{b.level}</span>
            </span>
            <span className="col-span-2">
              {authed ? (
                <BookStatusButton
                  status={progress[b.slug] || "pendiente"}
                  onCycle={(next) => cycleStatus(b.slug, next)}
                />
              ) : (
                <a href="/login" className="text-xs text-muted hover:text-ink">
                  iniciar sesión
                </a>
              )}
            </span>
            <span className="col-span-2 flex items-center justify-end gap-3">
              {b.fileUrl && (
                <Link href={`/libros/${b.slug}`} className="text-brand hover:underline">
                  Leer
                </Link>
              )}
              {b.buyUrl && (
                <a href={b.buyUrl} target="_blank" className="text-muted hover:text-ink">
                  <ExternalLink size={14} />
                </a>
              )}
              <button
                onClick={() => deleteBook(b.slug, b.title)}
                title="Borrar (requiere token)"
                className="text-muted transition hover:text-rose-600"
              >
                <Trash2 size={14} />
              </button>
            </span>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="px-4 py-6 text-sm text-muted">
            No hay libros con esos filtros.
          </p>
        )}
      </div>
    </main>
  );
}

function AddBookForm({ onAdded }: { onAdded: () => void }) {
  const [token, setToken] = useToken();
  const [isbn, setIsbn] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const [showDetails, setShowDetails] = useState(false);
  const [customCat, setCustomCat] = useState(false);
  const titleRef = useRef<HTMLInputElement>(null);
  const [f, setF] = useState({
    title: "",
    author: "",
    publisher: "",
    pages: "",
    domain: "ciberseguridad",
    level: "intermedio",
    audience: "ambos",
    tags: "",
    buyUrl: "",
    fileUrl: "",
    summary: "",
    isbn: "",
    coverUrl: "",
  });
  const input =
    "mt-1 w-full rounded-md border border-line bg-white px-3 py-2 text-sm outline-none focus:border-brand";

  async function lookup() {
    const code = isbn.trim();
    if (!code) return;
    setBusy(true);
    setMsg("");
    setF((prev) => ({ ...prev, isbn: code }));
    try {
      const res = await fetch(
        `${API}/books/lookup?isbn=${encodeURIComponent(code)}`,
      );
      if (res.status === 404) {
        setMsg(
          "No está en los catálogos gratuitos (típico en libros españoles de FP). Escribe el título aquí y guarda — el ISBN se guarda igual.",
        );
        titleRef.current?.focus();
        return;
      }
      if (!res.ok) throw new Error("bad status");
      const d = await res.json();
      setF((prev) => ({
        ...prev,
        title: d.title ?? prev.title,
        author: d.author ?? prev.author,
        publisher: d.publisher ?? prev.publisher,
        pages: d.pages ? String(d.pages) : prev.pages,
        summary: d.summary ?? prev.summary,
        tags: (d.tags ?? []).join(", ") || prev.tags,
        buyUrl: d.buyUrl ?? prev.buyUrl,
        isbn: d.isbn ?? code,
        coverUrl: d.coverUrl ?? "",
      }));
      setMsg("✓ Datos cargados. Revisa y guarda.");
    } catch {
      setMsg("No se pudo conectar. Completa los campos a mano.");
    } finally {
      setBusy(false);
    }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setMsg("");
    if (!f.title.trim()) {
      setMsg("Pon al menos el título.");
      return;
    }
    if (!token.trim()) {
      setMsg("Falta el token (certpath-admin-2026).");
      return;
    }
    const body = {
      ...f,
      pages: f.pages ? Number(f.pages) : undefined,
      tags: f.tags ? f.tags.split(",").map((s) => s.trim()).filter(Boolean) : [],
    };
    const res = await fetch(`${API}/books`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-import-token": token },
      body: JSON.stringify(body),
    }).catch(() => null);
    if (res && res.ok) {
      setMsg("Añadido ✓");
      onAdded();
    } else {
      const d = res ? await res.json().catch(() => ({})) : {};
      const isToken = res?.status === 401 || /token/i.test(d.message || "");
      setMsg(
        isToken
          ? "Token incorrecto. Ahora el campo es visible: borra lo que haya y escribe certpath-admin-2026"
          : "Error: " + (d.message || "no se pudo guardar"),
      );
    }
  }

  return (
    <form onSubmit={submit} className="card mt-6 p-5">
      {/* ISBN (opcional, autocompleta) */}
      <label className="text-sm font-medium">
        ISBN <span className="font-normal text-muted">(opcional — autocompleta)</span>
      </label>
      <div className="mt-1 flex flex-col gap-2 sm:flex-row">
        <input
          value={isbn}
          onChange={(e) => setIsbn(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              lookup();
            }
          }}
          placeholder="978-84-283-6545-1  (o pega el de Amazon)"
          className="flex-1 rounded-md border border-line bg-white px-3 py-2 text-sm outline-none focus:border-brand"
        />
        <button
          type="button"
          onClick={lookup}
          disabled={busy}
          className="rounded-md border border-line bg-white px-4 py-2 text-sm font-medium hover:bg-canvas disabled:opacity-50"
        >
          {busy ? "Buscando…" : "Autocompletar"}
        </button>
      </div>

      {/* Datos del libro (siempre visibles — se pueden rellenar a mano) */}
      <div className="mt-4 flex gap-4 rounded-md border border-line bg-canvas p-3">
        {f.coverUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={f.coverUrl}
            alt={f.title}
            className="h-28 w-20 shrink-0 rounded border border-line object-cover"
          />
        ) : null}
        <div className="min-w-0 flex-1 space-y-2">
          <input ref={titleRef} value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} placeholder="Título *" required className={input} />
          <input value={f.author} onChange={(e) => setF({ ...f, author: e.target.value })} placeholder="Autor (opcional)" className={input} />
          <div className="grid grid-cols-3 gap-2">
            <label className="block text-[11px] font-medium text-muted">
              Categoría
              {customCat ? (
                <input
                  autoFocus
                  value={f.domain}
                  onChange={(e) => setF({ ...f, domain: e.target.value })}
                  placeholder="Nueva categoría"
                  onBlur={() => { if (!f.domain.trim()) { setCustomCat(false); setF({ ...f, domain: "ciberseguridad" }); } }}
                  className={input}
                />
              ) : (
                <select
                  value={f.domain}
                  onChange={(e) => {
                    if (e.target.value === "__other__") {
                      setCustomCat(true);
                      setF({ ...f, domain: "" });
                    } else {
                      setF({ ...f, domain: e.target.value });
                    }
                  }}
                  className={input}
                >
                  {DOMAINS.map((d) => <option key={d.key} value={d.key}>{d.label}</option>)}
                  <option value="__other__">➕ Otra…</option>
                </select>
              )}
            </label>
            <label className="block text-[11px] font-medium text-muted">
              Nivel
              <select value={f.level} onChange={(e) => setF({ ...f, level: e.target.value })} className={input}>
                {BOOK_LEVELS.map((l) => <option key={l}>{l}</option>)}
              </select>
            </label>
            <label className="block text-[11px] font-medium text-muted">
              Público
              <select value={f.audience} onChange={(e) => setF({ ...f, audience: e.target.value })} className={input}>
                {AUDIENCES.map((a) => <option key={a}>{a}</option>)}
              </select>
            </label>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <label className="block text-[11px] font-medium text-muted">
              Etiquetas (comas)
              <input value={f.tags} onChange={(e) => setF({ ...f, tags: e.target.value })} placeholder="ej: redes, ENS" className={input} />
            </label>
            <label className="block text-[11px] font-medium text-muted">
              Páginas totales
              <input type="number" min={0} value={f.pages} onChange={(e) => setF({ ...f, pages: e.target.value })} placeholder="ej: 320" className={input} />
            </label>
          </div>
        </div>
      </div>

      {/* Detalles opcionales */}
      <button
        type="button"
        onClick={() => setShowDetails((s) => !s)}
        className="mt-3 text-xs text-brand hover:underline"
      >
        {showDetails ? "Ocultar detalles" : "Editar detalles (editorial, páginas, archivo…)"}
      </button>
      {showDetails && (
        <div className="mt-2 grid gap-3 sm:grid-cols-2">
          <Field label="Editorial"><input value={f.publisher} onChange={(e) => setF({ ...f, publisher: e.target.value })} className={input} /></Field>
          <Field label="Enlace de compra"><input value={f.buyUrl} onChange={(e) => setF({ ...f, buyUrl: e.target.value })} className={input} /></Field>
          <Field label="Portada (URL)"><input value={f.coverUrl} onChange={(e) => setF({ ...f, coverUrl: e.target.value })} className={input} /></Field>
          <Field label="Archivo PDF/EPUB (URL o /libros/archivo.pdf)"><input value={f.fileUrl} onChange={(e) => setF({ ...f, fileUrl: e.target.value })} className={input} /></Field>
          <label className="block sm:col-span-2"><span className="text-sm">Resumen</span><textarea value={f.summary} onChange={(e) => setF({ ...f, summary: e.target.value })} rows={3} className={input} /></label>
        </div>
      )}

      {/* Guardar */}
      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center">
        <input
          type="text"
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="certpath-admin-2026"
          className="rounded-md border border-line bg-white px-3 py-2 font-mono text-sm outline-none focus:border-brand sm:w-56"
        />
        <button
          type="submit"
          className="rounded-md bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-dark"
        >
          Guardar libro
        </button>
        {msg && <span className="text-sm text-muted">{msg}</span>}
      </div>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-sm">{label}</span>
      {children}
    </label>
  );
}
