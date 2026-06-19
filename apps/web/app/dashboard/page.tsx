"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Award,
  Clock,
  Circle,
  LogOut,
  Search,
  Loader2,
  Route,
  ChevronRight,
  BookOpen,
} from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

type Cert = { slug: string; name: string; vendor: { name: string } };
type Prog = { certSlug: string; status: string };
type Roadmap = { slug: string; title: string; steps: { section?: boolean }[] };
type BookProg = { bookSlug: string; status: string; currentPage?: number | null };
type BookT = { slug: string; title: string; author: string; pages?: number | null };

const STATUSES = ["pendiente", "en-progreso", "obtenida"] as const;
const LABEL: Record<string, string> = {
  pendiente: "Pendiente",
  "en-progreso": "En progreso",
  obtenida: "Obtenida",
};
const isRoadmapKey = (k: string) => k.startsWith("rm:");

export default function DashboardPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [progress, setProgress] = useState<Prog[]>([]);
  const [certs, setCerts] = useState<Cert[]>([]);
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([]);
  const [bookProg, setBookProg] = useState<BookProg[]>([]);
  const [books, setBooks] = useState<BookT[]>([]);
  const [q, setQ] = useState("");

  useEffect(() => {
    (async () => {
      const me = await fetch(`${API}/auth/me`, { credentials: "include" })
        .then((r) => r.json())
        .catch(() => ({ authenticated: false }));
      if (!me.authenticated) {
        router.push("/login");
        return;
      }
      const [p, c, r, bp, b] = await Promise.all([
        fetch(`${API}/progress`, { credentials: "include" }).then((x) => x.json()),
        fetch(`${API}/certifications`).then((x) => x.json()),
        fetch(`${API}/roadmaps`).then((x) => x.json()),
        fetch(`${API}/progress/books`, { credentials: "include" })
          .then((x) => x.json())
          .catch(() => []),
        fetch(`${API}/books`).then((x) => x.json()).catch(() => []),
      ]);
      setProgress(Array.isArray(p) ? p : []);
      setCerts(Array.isArray(c) ? c : []);
      setRoadmaps(Array.isArray(r) ? r : []);
      setBookProg(Array.isArray(bp) ? bp : []);
      setBooks(Array.isArray(b) ? b : []);
      setReady(true);
    })();
  }, [router]);

  const certBySlug = useMemo(
    () => new Map(certs.map((c) => [c.slug, c])),
    [certs],
  );
  const roadmapBySlug = useMemo(
    () => new Map(roadmaps.map((r) => [r.slug, r])),
    [roadmaps],
  );

  const certProgress = useMemo(
    () => progress.filter((p) => !isRoadmapKey(p.certSlug)),
    [progress],
  );

  const roadmapProgress = useMemo(() => {
    const m = new Map<string, { done: number; prog: number }>();
    for (const p of progress) {
      if (!isRoadmapKey(p.certSlug)) continue;
      const slug = p.certSlug.split(":")[1];
      const e = m.get(slug) || { done: 0, prog: 0 };
      if (p.status === "obtenida") e.done++;
      else if (p.status === "en-progreso") e.prog++;
      m.set(slug, e);
    }
    return m;
  }, [progress]);

  const bookBySlug = useMemo(
    () => new Map(books.map((b) => [b.slug, b])),
    [books],
  );
  const readingBooks = useMemo(
    () => bookProg.filter((p) => p.status === "leyendo" || p.status === "leido"),
    [bookProg],
  );

  async function setStatus(certSlug: string, status: string) {
    await fetch(`${API}/progress`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ certSlug, status }),
    });
    setProgress((prev) => [
      ...prev.filter((p) => p.certSlug !== certSlug),
      { certSlug, status },
    ]);
  }

  async function logout() {
    await fetch(`${API}/auth/logout`, { method: "POST", credentials: "include" });
    router.push("/login");
  }

  const stats = useMemo(
    () => ({
      obtenidas: certProgress.filter((p) => p.status === "obtenida").length,
      progreso: certProgress.filter((p) => p.status === "en-progreso").length,
      pendientes: certProgress.filter((p) => p.status === "pendiente").length,
    }),
    [certProgress],
  );

  if (!ready) {
    return (
      <main className="flex items-center justify-center py-24 text-muted">
        <Loader2 className="animate-spin" /> &nbsp;Cargando…
      </main>
    );
  }

  const results = q.trim()
    ? certs
        .filter((c) => c.name.toLowerCase().includes(q.toLowerCase()))
        .filter((c) => !certProgress.some((p) => p.certSlug === c.slug))
        .slice(0, 8)
    : [];

  return (
    <main className="mx-auto max-w-5xl px-8 py-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Mi progreso</h1>
          <p className="mt-0.5 text-sm text-muted">
            Tus certificaciones y roadmaps en un vistazo.
          </p>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-1.5 rounded-md border border-line px-3 py-1.5 text-sm text-muted hover:bg-canvas"
        >
          <LogOut size={14} /> Salir
        </button>
      </div>

      {/* Stats */}
      <section className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Stat icon={<Award size={18} />} label="Certis obtenidas" value={stats.obtenidas} />
        <Stat icon={<Clock size={18} />} label="En progreso" value={stats.progreso} />
        <Stat icon={<Circle size={18} />} label="Pendientes" value={stats.pendientes} />
        <Stat
          icon={<BookOpen size={18} />}
          label="Libros leyendo"
          value={readingBooks.filter((b) => b.status === "leyendo").length}
        />
      </section>

      {/* Progreso en roadmaps */}
      {roadmapProgress.size > 0 && (
        <section className="mt-10">
          <h2 className="text-lg font-semibold">Progreso en roadmaps</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {[...roadmapProgress.entries()].map(([slug, e]) => {
              const rm = roadmapBySlug.get(slug);
              const total = rm
                ? rm.steps.filter((s) => !s.section).length
                : e.done + e.prog;
              const pct = total ? Math.round((e.done / total) * 100) : 0;
              return (
                <Link
                  key={slug}
                  href={`/roadmaps/${slug}`}
                  className="card p-4 transition hover:border-brand"
                >
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 font-medium">
                      <Route size={16} className="text-brand" />
                      {rm?.title ?? slug}
                    </span>
                    <span className="text-sm text-muted">{pct}%</span>
                  </div>
                  <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-line">
                    <div
                      className="h-1.5 rounded-full bg-brand"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <p className="mt-1.5 text-xs text-muted">
                    {e.done}/{total} hechos · {e.prog} en curso
                  </p>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* Mis lecturas */}
      {readingBooks.length > 0 && (
        <section className="mt-10">
          <h2 className="text-lg font-semibold">Mis lecturas</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {readingBooks.map((p) => {
              const b = bookBySlug.get(p.bookSlug);
              const pct =
                p.status === "leido"
                  ? 100
                  : b?.pages && p.currentPage
                    ? Math.min(100, Math.round((p.currentPage / b.pages) * 100))
                    : 0;
              return (
                <Link
                  key={p.bookSlug}
                  href={`/libros/${p.bookSlug}`}
                  className="card p-4 transition hover:border-brand"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="flex min-w-0 items-center gap-2 font-medium">
                      <BookOpen size={16} className="shrink-0 text-brand" />
                      <span className="truncate">{b?.title ?? p.bookSlug}</span>
                    </span>
                    <span className="shrink-0 text-sm text-muted">
                      {p.status === "leido" ? "Leído" : `${pct}%`}
                    </span>
                  </div>
                  <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-line">
                    <div
                      className="h-1.5 rounded-full bg-emerald-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <p className="mt-1.5 text-xs text-muted">
                    {p.currentPage && b?.pages
                      ? `Página ${p.currentPage} de ${b.pages}`
                      : p.status === "leido"
                        ? "Completado"
                        : "En lectura"}
                  </p>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* Añadir */}
      <section className="mt-10">
        <h2 className="text-lg font-semibold">Seguir una certificación</h2>
        <div className="mt-3 flex items-center gap-2 rounded-lg border border-line bg-white px-4 py-2.5 shadow-card">
          <Search size={18} className="text-muted" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar entre las certificaciones…"
            className="w-full bg-transparent text-sm outline-none placeholder:text-muted"
          />
        </div>
        {results.length > 0 && (
          <div className="mt-2 divide-y divide-line rounded-lg border border-line bg-white">
            {results.map((c) => (
              <button
                key={c.slug}
                onClick={() => {
                  setStatus(c.slug, "en-progreso");
                  setQ("");
                }}
                className="flex w-full items-center justify-between px-4 py-2.5 text-left text-sm hover:bg-canvas"
              >
                <span>
                  {c.name} <span className="text-muted">· {c.vendor.name}</span>
                </span>
                <span className="text-brand">+ Seguir</span>
              </button>
            ))}
          </div>
        )}
      </section>

      {/* Mis certis */}
      <section className="mt-10">
        <h2 className="text-lg font-semibold">Mis certificaciones</h2>
        {certProgress.length === 0 ? (
          <p className="mt-3 text-sm text-muted">
            Aún no sigues ninguna. Búscala arriba para empezar.
          </p>
        ) : (
          <div className="mt-3 space-y-2">
            {certProgress.map((p) => {
              const cert = certBySlug.get(p.certSlug);
              return (
                <div
                  key={p.certSlug}
                  className="card flex flex-wrap items-center justify-between gap-3 p-4"
                >
                  <div className="min-w-0">
                    <p className="font-medium">{cert?.name ?? p.certSlug}</p>
                    {cert && (
                      <p className="text-xs text-muted">{cert.vendor.name}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      value={p.status}
                      onChange={(e) => setStatus(p.certSlug, e.target.value)}
                      className="rounded-md border border-line bg-white px-2.5 py-1.5 text-sm outline-none focus:border-brand"
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {LABEL[s]}
                        </option>
                      ))}
                    </select>
                    {cert && (
                      <Link
                        href={`/certificaciones/${cert.slug}`}
                        className="flex items-center gap-0.5 rounded-md border border-line px-2.5 py-1.5 text-sm text-muted hover:bg-canvas"
                      >
                        Ver <ChevronRight size={14} />
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}

function Stat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div className="card p-4">
      <div className="flex items-center gap-1.5 text-muted">
        {icon}
        <span className="text-xs">{label}</span>
      </div>
      <p className="mt-2 text-2xl font-semibold tabular-nums">{value}</p>
    </div>
  );
}
