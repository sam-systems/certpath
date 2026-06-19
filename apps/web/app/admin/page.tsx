"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Trash2,
  Search,
  Settings,
  Plus,
  FileCode2,
  GraduationCap,
  BookOpen,
  Link2,
  ExternalLink,
} from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import {
  DOMAINS,
  type Certification,
  type Book,
  type Resource,
} from "@/lib/api";
import { useToken } from "@/lib/useToken";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

const EXAMPLE = `[
  {
    "name": "AWS Certified Machine Learning Engineer",
    "vendor": "AWS",
    "domain": "ia",
    "level": "associate",
    "cost": "pago",
    "priceEUR": 145,
    "url": "https://aws.amazon.com/certification/",
    "skills": ["ML", "AWS"]
  }
]`;

type Tab = "certs" | "libros" | "recursos";

const input =
  "mt-1 w-full rounded-md border border-line bg-white px-3 py-2 text-sm outline-none focus:border-brand";

export default function AdminPage() {
  const [token, setToken] = useToken();
  const [tab, setTab] = useState<Tab>("certs");
  const [result, setResult] = useState("");
  const [busy, setBusy] = useState(false);
  const [q, setQ] = useState("");

  // ── Datos ──
  const [certs, setCerts] = useState<Certification[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);

  async function loadAll() {
    try {
      const r = await fetch(`${API}/certifications`, { cache: "no-store" });
      setCerts(r.ok ? await r.json() : []);
    } catch {
      setCerts([]);
    }
    try {
      const r = await fetch(`${API}/books`, { cache: "no-store" });
      setBooks(r.ok ? await r.json() : []);
    } catch {
      setBooks([]);
    }
    try {
      const r = await fetch(`${API}/resources`, { cache: "no-store" });
      setResources(r.ok ? await r.json() : []);
    } catch {
      setResources([]);
    }
  }
  useEffect(() => {
    loadAll();
  }, []);

  // ── Alta de certificación (manual + JSON) ──
  const [m, setM] = useState({
    name: "",
    vendor: "",
    domain: "ciberseguridad",
    level: "fundamentos",
    cost: "pago",
    priceEUR: "",
    url: "",
    skills: "",
    logoUrl: "",
    description: "",
    targetRoles: "",
    careerOutcomes: "",
    prereqs: "",
  });
  const [json, setJson] = useState(EXAMPLE);

  // ── Alta de recurso ──
  const [rf, setRf] = useState({
    title: "",
    url: "",
    category: "",
    description: "",
  });

  async function postCerts(items: unknown[]) {
    if (!token) {
      setResult("❌ Pon el token primero.");
      return;
    }
    setBusy(true);
    setResult("");
    try {
      const res = await fetch(`${API}/certifications/import`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-import-token": token },
        body: JSON.stringify({ items }),
      });
      const data = await res.json();
      if (!res.ok) setResult(`❌ Error: ${data.message || res.status}`);
      else {
        setResult(
          `✅ Creadas: ${data.created} · Actualizadas: ${data.updated} · Errores: ${data.errors?.length || 0}`,
        );
        loadAll();
      }
    } catch (e) {
      setResult(`❌ Error de red: ${(e as Error).message}`);
    }
    setBusy(false);
  }

  function submitManual(e: React.FormEvent) {
    e.preventDefault();
    const csv = (s: string) =>
      s ? s.split(",").map((x) => x.trim()).filter(Boolean) : [];
    postCerts([
      {
        name: m.name,
        vendor: m.vendor,
        domain: m.domain,
        level: m.level,
        cost: m.cost,
        priceEUR: m.priceEUR ? Number(m.priceEUR) : undefined,
        url: m.url,
        skills: csv(m.skills),
        logoUrl: m.logoUrl || undefined,
        description: m.description || undefined,
        targetRoles: csv(m.targetRoles),
        careerOutcomes: csv(m.careerOutcomes),
        prereqs: m.prereqs || undefined,
      },
    ]);
  }

  function submitBulk(e: React.FormEvent) {
    e.preventDefault();
    try {
      const parsed = JSON.parse(json);
      postCerts(Array.isArray(parsed) ? parsed : [parsed]);
    } catch {
      setResult("❌ JSON inválido");
    }
  }

  async function addResource(e: React.FormEvent) {
    e.preventDefault();
    if (!token) {
      setResult("❌ Pon el token primero.");
      return;
    }
    const res = await fetch(`${API}/resources`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-import-token": token },
      body: JSON.stringify(rf),
    }).catch(() => null);
    if (res && res.ok) {
      setResult("✅ Recurso añadido");
      setRf({ title: "", url: "", category: "", description: "" });
      loadAll();
    } else {
      setResult("❌ No se pudo añadir (¿token correcto?).");
    }
  }

  async function del(url: string, label: string) {
    if (!token) {
      setResult("❌ Pon el token primero.");
      return;
    }
    if (!confirm(`¿Borrar "${label}"? No se puede deshacer.`)) return;
    const res = await fetch(url, {
      method: "DELETE",
      headers: { "x-import-token": token },
    }).catch(() => null);
    if (res && res.ok) {
      setResult(`✅ Borrado: ${label}`);
      loadAll();
    } else {
      setResult("❌ No se pudo borrar (¿token correcto?).");
    }
  }

  // ── Búsquedas para gestión ──
  const term = q.trim().toLowerCase();
  const certHits = useMemo(
    () =>
      !term
        ? []
        : certs
            .filter(
              (c) =>
                c.name.toLowerCase().includes(term) ||
                c.vendor.name.toLowerCase().includes(term),
            )
            .slice(0, 25),
    [certs, term],
  );
  const bookHits = useMemo(
    () =>
      !term
        ? books
        : books.filter(
            (b) =>
              b.title.toLowerCase().includes(term) ||
              b.author.toLowerCase().includes(term),
          ),
    [books, term],
  );
  const resHits = useMemo(
    () =>
      !term
        ? resources
        : resources.filter(
            (r) =>
              r.title.toLowerCase().includes(term) ||
              r.category.toLowerCase().includes(term),
          ),
    [resources, term],
  );

  const TABS: { key: Tab; label: string; icon: typeof GraduationCap; count: number }[] =
    [
      { key: "certs", label: "Certificaciones", icon: GraduationCap, count: certs.length },
      { key: "libros", label: "Libros", icon: BookOpen, count: books.length },
      { key: "recursos", label: "Recursos", icon: Link2, count: resources.length },
    ];

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-4xl px-6 py-12">
        <h1 className="flex items-center gap-2 text-2xl font-semibold">
          <Settings size={22} className="text-muted" /> Panel de administración
        </h1>
        <p className="mt-1 text-sm text-muted">
          Tu trastienda: gestiona todo el contenido (certificaciones, libros y
          recursos) desde aquí.
        </p>

        {/* Estadísticas */}
        <section className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-4">
          {[
            [String(certs.length), "Certificaciones"],
            [String(new Set(certs.map((c) => c.vendor.name)).size), "Fabricantes"],
            [String(books.length), "Libros"],
            [String(resources.length), "Recursos"],
          ].map(([n, l]) => (
            <div key={l} className="bg-white px-4 py-3">
              <p className="text-2xl font-semibold tabular-nums">{n}</p>
              <p className="text-xs text-muted">{l}</p>
            </div>
          ))}
        </section>

        {/* Token */}
        <div className="card mt-6 flex flex-col gap-1 p-5">
          <label className="text-sm font-medium">Token de administración</label>
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
          <p className="text-xs text-muted">
            Se recuerda en este navegador. Necesario para añadir/borrar.
          </p>
        </div>

        {/* Pestañas */}
        <div className="mt-6 flex flex-wrap gap-2">
          {TABS.map((t) => {
            const Icon = t.icon;
            const active = tab === t.key;
            return (
              <button
                key={t.key}
                onClick={() => {
                  setTab(t.key);
                  setQ("");
                }}
                className={`inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm transition ${
                  active
                    ? "border-brand bg-brand text-white"
                    : "border-line bg-white text-ink hover:bg-canvas"
                }`}
              >
                <Icon size={15} /> {t.label}
                <span
                  className={`rounded px-1.5 text-xs ${active ? "bg-white/20" : "bg-canvas text-muted"}`}
                >
                  {t.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* ── TAB CERTIFICACIONES ── */}
        {tab === "certs" && (
          <>
            <div className="mt-6 grid gap-6 lg:grid-cols-2">
              {/* Manual */}
              <form onSubmit={submitManual} className="card p-5">
                <h2 className="flex items-center gap-2 font-semibold">
                  <span className="flex h-7 w-7 items-center justify-center rounded-md bg-sky-50 text-sky-600 ring-1 ring-sky-100">
                    <Plus size={15} />
                  </span>
                  Añadir una (manual)
                </h2>
                <label className="mt-3 block text-sm">Nombre</label>
                <input required value={m.name} onChange={(e) => setM({ ...m, name: e.target.value })} className={input} />
                <label className="mt-3 block text-sm">Fabricante</label>
                <input required value={m.vendor} onChange={(e) => setM({ ...m, vendor: e.target.value })} className={input} />
                <div className="mt-3 grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm">Dominio</label>
                    <select value={m.domain} onChange={(e) => setM({ ...m, domain: e.target.value })} className={input}>
                      {DOMAINS.map((d) => <option key={d.key} value={d.key}>{d.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm">Nivel</label>
                    <select value={m.level} onChange={(e) => setM({ ...m, level: e.target.value })} className={input}>
                      {["fundamentos", "associate", "professional", "expert", "specialty"].map((l) => <option key={l} value={l}>{l}</option>)}
                    </select>
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm">Coste</label>
                    <select value={m.cost} onChange={(e) => setM({ ...m, cost: e.target.value })} className={input}>
                      <option value="pago">pago</option>
                      <option value="gratis">gratis</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm">Precio (€)</label>
                    <input value={m.priceEUR} onChange={(e) => setM({ ...m, priceEUR: e.target.value })} className={input} />
                  </div>
                </div>
                <label className="mt-3 block text-sm">URL oficial</label>
                <input value={m.url} onChange={(e) => setM({ ...m, url: e.target.value })} className={input} />
                <label className="mt-3 block text-sm">Competencias (comas)</label>
                <input value={m.skills} onChange={(e) => setM({ ...m, skills: e.target.value })} className={input} />
                <div className="mt-4 border-t border-line pt-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted">Logo / ficha (opcional)</p>
                  <label className="mt-3 block text-sm">URL del logo / badge</label>
                  <input value={m.logoUrl} onChange={(e) => setM({ ...m, logoUrl: e.target.value })} placeholder="https://images.credly.com/… (vacío = logo del fabricante)" className={input} />
                  <label className="mt-3 block text-sm">Descripción</label>
                  <textarea value={m.description} onChange={(e) => setM({ ...m, description: e.target.value })} rows={2} placeholder="Vacío = se genera automáticamente." className={input} />
                  <label className="mt-3 block text-sm">Roles a los que prepara (comas)</label>
                  <input value={m.targetRoles} onChange={(e) => setM({ ...m, targetRoles: e.target.value })} className={input} />
                  <label className="mt-3 block text-sm">Salidas profesionales (comas)</label>
                  <input value={m.careerOutcomes} onChange={(e) => setM({ ...m, careerOutcomes: e.target.value })} className={input} />
                  <label className="mt-3 block text-sm">¿Para quién es? / requisitos</label>
                  <input value={m.prereqs} onChange={(e) => setM({ ...m, prereqs: e.target.value })} className={input} />
                </div>
                <button disabled={busy} className="mt-4 w-full rounded-md bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-dark disabled:opacity-50">Añadir</button>
              </form>

              {/* Bulk */}
              <form onSubmit={submitBulk} className="card p-5">
                <h2 className="flex items-center gap-2 font-semibold">
                  <span className="flex h-7 w-7 items-center justify-center rounded-md bg-violet-50 text-violet-600 ring-1 ring-violet-100">
                    <FileCode2 size={15} />
                  </span>
                  Importar muchas (JSON)
                </h2>
                <p className="mt-1 text-xs text-muted">Pega un array de certificaciones.</p>
                <textarea value={json} onChange={(e) => setJson(e.target.value)} rows={16} className={`${input} font-mono text-xs`} />
                <button disabled={busy} className="mt-4 w-full rounded-md bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-dark disabled:opacity-50">Importar</button>
              </form>
            </div>

            <ManageBox
              title="Gestionar certificaciones"
              placeholder="Buscar certificación por nombre o fabricante…"
              q={q}
              setQ={setQ}
              note="Para editar, vuelve a añadirla con el mismo nombre (se actualiza)."
            >
              {term &&
                (certHits.length === 0 ? (
                  <Empty />
                ) : (
                  certHits.map((c) => (
                    <Row
                      key={c.id}
                      title={c.name}
                      sub={`${c.vendor.name} · ${c.level}`}
                      onDelete={() => del(`${API}/certifications/${c.slug}`, c.name)}
                    />
                  ))
                ))}
            </ManageBox>
          </>
        )}

        {/* ── TAB LIBROS ── */}
        {tab === "libros" && (
          <>
            <div className="card mt-6 flex items-center justify-between gap-3 p-5">
              <div>
                <h2 className="font-semibold">Añadir libro</h2>
                <p className="mt-1 text-xs text-muted">
                  El alta de libros usa ISBN (autocompletar) en su propia página.
                </p>
              </div>
              <Link
                href="/libros"
                className="inline-flex shrink-0 items-center gap-1.5 rounded-md bg-brand px-3 py-2 text-sm font-medium text-white hover:bg-brand-dark"
              >
                <Plus size={15} /> Ir a Libros
              </Link>
            </div>
            <ManageBox
              title="Gestionar libros"
              placeholder="Buscar libro por título o autor…"
              q={q}
              setQ={setQ}
            >
              {bookHits.length === 0 ? (
                <Empty />
              ) : (
                bookHits.map((b) => (
                  <Row
                    key={b.id}
                    title={b.title}
                    sub={`${b.author} · ${b.level}`}
                    onDelete={() => del(`${API}/books/${b.slug}`, b.title)}
                  />
                ))
              )}
            </ManageBox>
          </>
        )}

        {/* ── TAB RECURSOS ── */}
        {tab === "recursos" && (
          <>
            <form onSubmit={addResource} className="card mt-6 p-5">
              <h2 className="flex items-center gap-2 font-semibold">
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-teal-50 text-teal-600 ring-1 ring-teal-100">
                  <Plus size={15} />
                </span>
                Añadir recurso / enlace
              </h2>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <input required value={rf.title} onChange={(e) => setRf({ ...rf, title: e.target.value })} placeholder="Título" className={input} />
                <input value={rf.category} onChange={(e) => setRf({ ...rf, category: e.target.value })} placeholder="Categoría (ENS, Guías…)" className={input} />
              </div>
              <input required type="url" value={rf.url} onChange={(e) => setRf({ ...rf, url: e.target.value })} placeholder="https://…" className={input} />
              <input value={rf.description} onChange={(e) => setRf({ ...rf, description: e.target.value })} placeholder="Descripción (opcional)" className={input} />
              <button className="mt-4 rounded-md bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-dark">Añadir recurso</button>
            </form>
            <ManageBox
              title="Gestionar recursos"
              placeholder="Buscar recurso por título o categoría…"
              q={q}
              setQ={setQ}
            >
              {resHits.length === 0 ? (
                <Empty />
              ) : (
                resHits.map((r) => (
                  <Row
                    key={r.id}
                    title={r.title}
                    sub={r.category}
                    href={r.url}
                    onDelete={() => del(`${API}/resources/${r.id}`, r.title)}
                  />
                ))
              )}
            </ManageBox>
          </>
        )}

        {result && <div className="card mt-6 p-4 text-sm">{result}</div>}
      </main>
    </div>
  );
}

function ManageBox({
  title,
  placeholder,
  q,
  setQ,
  note,
  children,
}: {
  title: string;
  placeholder: string;
  q: string;
  setQ: (v: string) => void;
  note?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="card mt-6 p-5">
      <h2 className="flex items-center gap-2 font-semibold">
        <Search size={16} /> {title}
      </h2>
      {note && <p className="mt-1 text-xs text-muted">{note}</p>}
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder={placeholder}
        className={input}
      />
      <div className="mt-3 max-h-96 overflow-y-auto rounded-md border border-line">
        {children}
      </div>
    </div>
  );
}

function Row({
  title,
  sub,
  href,
  onDelete,
}: {
  title: string;
  sub: string;
  href?: string;
  onDelete: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-line px-3 py-2 text-sm last:border-0 hover:bg-canvas">
      <span className="min-w-0">
        <span className="flex items-center gap-1.5 font-medium">
          <span className="truncate">{title}</span>
          {href && (
            <a href={href} target="_blank" rel="noreferrer" className="shrink-0 text-muted hover:text-ink">
              <ExternalLink size={12} />
            </a>
          )}
        </span>
        <span className="block truncate text-xs text-muted">{sub}</span>
      </span>
      <button
        onClick={onDelete}
        title="Borrar"
        className="shrink-0 rounded p-1.5 text-muted transition hover:bg-rose-50 hover:text-rose-600"
      >
        <Trash2 size={15} />
      </button>
    </div>
  );
}

function Empty() {
  return <p className="px-3 py-3 text-sm text-muted">Sin resultados.</p>;
}
