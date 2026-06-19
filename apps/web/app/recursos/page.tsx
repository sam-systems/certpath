"use client";

import { useEffect, useMemo, useState } from "react";
import { ExternalLink, Plus, Trash2, Link2 } from "lucide-react";
import type { Resource } from "@/lib/api";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

export default function RecursosPage() {
  const [items, setItems] = useState<Resource[]>([]);
  const [q, setQ] = useState("");
  const [token, setToken] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({
    title: "",
    url: "",
    category: "",
    description: "",
  });
  const [msg, setMsg] = useState("");

  async function load() {
    try {
      const r = await fetch(`${API}/resources`, { cache: "no-store" });
      setItems(r.ok ? await r.json() : []);
    } catch {
      setItems([]);
    }
  }
  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    return s
      ? items.filter(
          (i) =>
            i.title.toLowerCase().includes(s) ||
            i.category.toLowerCase().includes(s) ||
            i.url.toLowerCase().includes(s),
        )
      : items;
  }, [items, q]);

  const grouped = useMemo(() => {
    const m = new Map<string, Resource[]>();
    for (const r of filtered) {
      if (!m.has(r.category)) m.set(r.category, []);
      m.get(r.category)!.push(r);
    }
    return [...m.entries()].sort((a, b) => a[0].localeCompare(b[0]));
  }, [filtered]);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    setMsg("");
    const res = await fetch(`${API}/resources`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-import-token": token },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setForm({ title: "", url: "", category: "", description: "" });
      setMsg("✅ Añadido");
      load();
    } else {
      const d = await res.json().catch(() => ({}));
      setMsg(`❌ ${d.message || res.status}`);
    }
  }

  async function del(id: string) {
    const res = await fetch(`${API}/resources/${id}`, {
      method: "DELETE",
      headers: { "x-import-token": token },
    });
    if (res.ok) load();
    else setMsg("❌ Token requerido para borrar");
  }

  const input =
    "mt-1 w-full rounded-md border border-line bg-white px-3 py-2 text-sm outline-none focus:border-brand";

  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Recursos y enlaces</h1>
          <p className="mt-1 text-sm text-muted">
            {items.length} enlaces importantes: normativa, guías oficiales,
            portales (ENS, CCN-STIC…).
          </p>
        </div>
        <button
          onClick={() => setShowAdd((v) => !v)}
          className="inline-flex items-center gap-1.5 rounded-md border border-line bg-white px-3 py-2 text-sm font-medium hover:bg-canvas"
        >
          <Plus size={15} /> Añadir enlace
        </button>
      </div>

      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Buscar por título, categoría o URL…"
        className="mt-5 w-full rounded-md border border-line bg-white px-3 py-2 text-sm outline-none focus:border-brand"
      />

      {showAdd && (
        <form onSubmit={add} className="card mt-4 p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">
            Nuevo enlace
          </p>
          <label className="mt-2 block text-sm">Token de importación</label>
          <input
            type="text"
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="certpath-admin-2026"
            className={`${input} font-mono`}
          />
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <div>
              <label className="block text-sm">Título</label>
              <input
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className={input}
              />
            </div>
            <div>
              <label className="block text-sm">Categoría</label>
              <input
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                placeholder="ENS, Guías, Normativa…"
                className={input}
              />
            </div>
          </div>
          <label className="mt-3 block text-sm">URL</label>
          <input
            required
            type="url"
            value={form.url}
            onChange={(e) => setForm({ ...form, url: e.target.value })}
            placeholder="https://…"
            className={input}
          />
          <label className="mt-3 block text-sm">Descripción (opcional)</label>
          <input
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className={input}
          />
          <div className="mt-4 flex items-center gap-3">
            <button className="rounded-md bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-dark">
              Guardar
            </button>
            {msg && <span className="text-sm text-muted">{msg}</span>}
          </div>
        </form>
      )}

      {grouped.length === 0 ? (
        <p className="mt-10 text-sm text-muted">
          No hay enlaces todavía. Añade el primero con “Añadir enlace”.
        </p>
      ) : (
        <div className="mt-6 space-y-8">
          {grouped.map(([cat, list]) => (
            <section key={cat}>
              <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted">
                <Link2 size={14} /> {cat}{" "}
                <span className="text-muted/70">({list.length})</span>
              </h2>
              <div className="mt-3 overflow-hidden rounded-md border border-line">
                {list.map((r) => (
                  <div
                    key={r.id}
                    className="group flex items-center justify-between gap-3 border-b border-line px-4 py-3 last:border-0 hover:bg-canvas"
                  >
                    <a
                      href={r.url}
                      target="_blank"
                      rel="noreferrer"
                      className="min-w-0 flex-1"
                    >
                      <span className="flex items-center gap-1.5 font-medium">
                        {r.title}
                        <ExternalLink size={13} className="text-muted" />
                      </span>
                      {r.description && (
                        <span className="block truncate text-xs text-muted">
                          {r.description}
                        </span>
                      )}
                      <span className="block truncate text-xs text-muted/70">
                        {r.url}
                      </span>
                    </a>
                    <button
                      onClick={() => del(r.id)}
                      title="Borrar (requiere token)"
                      className="shrink-0 rounded p-1.5 text-muted opacity-0 transition hover:bg-rose-50 hover:text-rose-600 group-hover:opacity-100"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </main>
  );
}
