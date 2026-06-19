"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  Search,
  X,
  ChevronRight,
  Loader2,
  Check,
  Clock,
  Minus,
  Coins,
  BarChart3,
  Briefcase,
  GraduationCap,
  BookOpen,
} from "lucide-react";
import type { Roadmap, RoadmapStep, Certification } from "@/lib/api";
import { domainColor } from "@/lib/taxonomy";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

const LEVEL: Record<string, string> = {
  fundamentos: "Fundamentos",
  associate: "Associate",
  professional: "Professional",
  expert: "Expert",
  specialty: "Specialty",
};

// Estados por nodo (ciclan en este orden al pulsar)
const NEXT: Record<string, string> = {
  pendiente: "en-progreso",
  "en-progreso": "obtenida",
  obtenida: "saltar",
  saltar: "pendiente",
};

function nodeKey(roadmapSlug: string, step: RoadmapStep, i: number) {
  return step.certSlug || `rm:${roadmapSlug}:${i}`;
}

export default function RoadmapDetailClient({ roadmap }: { roadmap: Roadmap }) {
  const router = useRouter();
  const col = domainColor(roadmap.domain);
  const [open, setOpen] = useState<RoadmapStep | null>(null);
  const [cert, setCert] = useState<Certification | null>(null);
  const [loading, setLoading] = useState(false);
  const [authed, setAuthed] = useState(false);
  const [statusMap, setStatusMap] = useState<Map<string, string>>(new Map());
  const [view, setView] = useState<"lista" | "mapa">("lista");

  useEffect(() => {
    (async () => {
      const me = await fetch(`${API}/auth/me`, { credentials: "include" })
        .then((r) => r.json())
        .catch(() => ({ authenticated: false }));
      if (!me.authenticated) return;
      setAuthed(true);
      const p = await fetch(`${API}/progress`, { credentials: "include" })
        .then((r) => r.json())
        .catch(() => []);
      const m = new Map<string, string>();
      (Array.isArray(p) ? p : []).forEach(
        (x: { certSlug: string; status: string }) => m.set(x.certSlug, x.status),
      );
      setStatusMap(m);
    })();
  }, []);

  const steps = roadmap.steps;
  const nodes = useMemo(
    () => steps.map((s, i) => ({ s, i })).filter(({ s }) => !s.section),
    [steps],
  );
  // Lado de cada nodo (alterna; se reinicia en cada sección) para el diagrama ramificado
  const sideByIndex = useMemo(() => {
    const m = new Map<number, "left" | "right">();
    let b = 0;
    steps.forEach((s, i) => {
      if (s.section) {
        b = 0;
        return;
      }
      m.set(i, b % 2 === 0 ? "right" : "left");
      b++;
    });
    return m;
  }, [steps]);
  // Agrupado por secciones (para la vista Mapa)
  const grouped = useMemo(() => {
    const groups: {
      title: string | null;
      items: { step: RoadmapStep; i: number }[];
    }[] = [];
    let cur: { title: string | null; items: { step: RoadmapStep; i: number }[] } | null =
      null;
    steps.forEach((s, i) => {
      if (s.section) {
        cur = { title: s.title, items: [] };
        groups.push(cur);
      } else {
        if (!cur) {
          cur = { title: null, items: [] };
          groups.push(cur);
        }
        cur.items.push({ step: s, i });
      }
    });
    return groups;
  }, [steps]);

  // Posiciones 2D para el grafo (estilo arquitecturas): cada sección es una
  // banda horizontal; los nodos se reparten dentro.
  const graphLayout = useMemo(() => {
    const sections = grouped.length || 1;
    let maxPer = 1;
    const pos: { step: RoadmapStep; i: number; x: number; y: number }[] = [];
    grouped.forEach((g, gi) => {
      const y = ((gi + 0.5) / sections) * 100;
      const M = g.items.length;
      maxPer = Math.max(maxPer, M);
      g.items.forEach(({ step, i }, j) => {
        const x = M <= 1 ? 50 : 8 + (j / (M - 1)) * 84;
        pos.push({ step, i, x, y });
      });
    });
    return { pos, sections, maxPer };
  }, [grouped]);

  const counts = useMemo(() => {
    let done = 0;
    let skip = 0;
    for (const { s, i } of nodes) {
      const st = statusMap.get(nodeKey(roadmap.slug, s, i)) || "pendiente";
      if (st === "obtenida") done++;
      else if (st === "saltar") skip++;
    }
    const total = nodes.length - skip;
    return { done, skip, total, pct: total ? Math.round((done / total) * 100) : 0 };
  }, [nodes, statusMap, roadmap.slug]);

  async function cycle(step: RoadmapStep, i: number) {
    if (!authed) {
      router.push("/login");
      return;
    }
    const key = nodeKey(roadmap.slug, step, i);
    const current = statusMap.get(key) || "pendiente";
    const next = NEXT[current];
    const m = new Map(statusMap);
    m.set(key, next);
    setStatusMap(m);
    await fetch(`${API}/progress`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ certSlug: key, status: next }),
    });
  }

  async function selectStep(step: RoadmapStep) {
    setOpen(step);
    setCert(null);
    if (!step.certSlug) return;
    setLoading(true);
    try {
      const r = await fetch(`${API}/certifications/${step.certSlug}`);
      setCert(r.ok ? await r.json() : null);
    } catch {
      setCert(null);
    }
    setLoading(false);
  }

  return (
    <div className="relative">
      <main className="mx-auto max-w-6xl px-6 py-12">
        <div className="mx-auto max-w-3xl">
        <Link
          href="/roadmaps"
          className="inline-flex items-center gap-1 text-sm text-muted hover:text-ink"
        >
          <ArrowLeft size={15} /> Volver a roadmaps
        </Link>

        <div className="mt-5">
          <p className="text-sm text-brand">{roadmap.role}</p>
          <h1 className="mt-1 text-2xl font-semibold">{roadmap.title}</h1>
          <p className="mt-2 text-muted">{roadmap.description}</p>
          <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-muted">
            <span className="inline-flex items-center gap-1">
              <Clock size={14} /> {roadmap.estMonths} meses
            </span>
            <span className="inline-flex items-center gap-1">
              <Coins size={14} /> ~{roadmap.estCostEUR} €
            </span>
            <span className="inline-flex items-center gap-1 capitalize">
              <BarChart3 size={14} /> {roadmap.difficulty}
            </span>
            {roadmap.salaryRange && (
              <span className="inline-flex items-center gap-1">
                <Briefcase size={14} /> {roadmap.salaryRange}
              </span>
            )}
          </div>
        </div>

        {/* Barra de progreso */}
        <div className="mt-8">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted">
              {authed
                ? `${counts.done}/${counts.total} hechos${counts.skip ? ` · ${counts.skip} saltados` : ""}`
                : "Inicia sesión para guardar tu progreso"}
            </span>
            <span className="font-semibold text-brand">{counts.pct}%</span>
          </div>
          <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-line">
            <div
              className="h-2 rounded-full bg-brand transition-all"
              style={{ width: `${counts.pct}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-muted">
            Pulsa el círculo para cambiar estado:{" "}
            <span className="text-muted">pendiente → en curso → hecho → saltar</span>{" "}
            · pulsa el texto para ver dónde obtenerlo
          </p>
        </div>

        {/* Toggle Lista / Mapa */}
        <div className="mt-6 flex items-center gap-2">
          <span className="text-xs text-muted">Vista:</span>
          <div className="inline-flex rounded-md border border-line bg-white p-0.5 text-sm">
            <button
              type="button"
              onClick={() => setView("lista")}
              className={`rounded px-3 py-1 ${view === "lista" ? "bg-brand text-white" : "text-muted hover:text-ink"}`}
            >
              Lista
            </button>
            <button
              type="button"
              onClick={() => setView("mapa")}
              className={`rounded px-3 py-1 ${view === "mapa" ? "bg-brand text-white" : "text-muted hover:text-ink"}`}
            >
              Mapa
            </button>
          </div>
        </div>
        </div>

        {view === "mapa" ? (
          /* Vista MAPA: grafo 2D (mismo motor que las arquitecturas) */
          <div className="mt-6">
            <div className="overflow-x-auto rounded-lg border border-line bg-white bg-[linear-gradient(0deg,#fafafa_1px,transparent_1px),linear-gradient(90deg,#fafafa_1px,transparent_1px)] [background-size:24px_24px]">
              <div
                className="relative w-full"
                style={{
                  minWidth:
                    graphLayout.maxPer > 7
                      ? `${graphLayout.maxPer * 150}px`
                      : undefined,
                  height: `${Math.max(360, graphLayout.sections * 150)}px`,
                }}
              >
                {/* Zonas por sección */}
                {grouped.map((g, gi) => {
                  const top = (gi / graphLayout.sections) * 100;
                  const h = (1 / graphLayout.sections) * 100;
                  return (
                    <div
                      key={`z${gi}`}
                      className="absolute rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/40"
                      style={{
                        left: "1.5%",
                        right: "1.5%",
                        top: `${top + 2}%`,
                        height: `${h - 4}%`,
                      }}
                    >
                      {g.title && (
                        <span
                          className={`absolute -top-3 left-4 z-10 rounded-full px-3 py-0.5 text-xs font-semibold ring-1 ${col.badge}`}
                        >
                          {g.title}
                        </span>
                      )}
                    </div>
                  );
                })}
                {/* Conectores */}
                <svg className="absolute inset-0 h-full w-full" aria-hidden>
                  {graphLayout.pos.slice(1).map((p, k) => {
                    const prev = graphLayout.pos[k];
                    return (
                      <line
                        key={k}
                        x1={`${prev.x}%`}
                        y1={`${prev.y}%`}
                        x2={`${p.x}%`}
                        y2={`${p.y}%`}
                        stroke="#cbd5e1"
                        strokeWidth={1.5}
                        strokeLinecap="round"
                        strokeDasharray="5 7"
                      >
                        <animate
                          attributeName="stroke-dashoffset"
                          from="24"
                          to="0"
                          dur="1.6s"
                          repeatCount="indefinite"
                        />
                      </line>
                    );
                  })}
                </svg>
                {/* Nodos */}
                {graphLayout.pos.map(({ step, i, x, y }) => {
                  const key = nodeKey(roadmap.slug, step, i);
                  const st = statusMap.get(key) || "pendiente";
                  const isCert = !!step.certSlug;
                  const ring =
                    st === "obtenida"
                      ? "border-emerald-300"
                      : st === "en-progreso"
                        ? "border-amber-300"
                        : st === "saltar"
                          ? "border-line opacity-60"
                          : "border-line";
                  const dot =
                    st === "obtenida"
                      ? "bg-emerald-500"
                      : st === "en-progreso"
                        ? "bg-amber-500"
                        : st === "saltar"
                          ? "bg-slate-300"
                          : "bg-slate-300/60";
                  return (
                    <div
                      key={i}
                      className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center"
                      style={{ left: `${x}%`, top: `${y}%`, width: 132 }}
                    >
                      <button
                        onClick={() => selectStep(step)}
                        className={`flex w-full flex-col items-center gap-1 rounded-xl border bg-white px-2 py-2 text-center shadow-md transition hover:z-10 hover:scale-[1.04] hover:shadow-lg ${ring} ${isCert ? "" : "border-dashed"}`}
                      >
                        <span
                          className={`flex h-9 w-9 items-center justify-center rounded-lg ${col.wrap}`}
                        >
                          {isCert ? (
                            <GraduationCap size={18} />
                          ) : (
                            <BookOpen size={18} />
                          )}
                        </span>
                        <span className="line-clamp-2 text-[11px] font-semibold leading-tight">
                          {step.title}
                        </span>
                        {isCert && (
                          <span
                            className={`rounded px-1 text-[9px] font-semibold ${col.badge}`}
                          >
                            CERT
                          </span>
                        )}
                      </button>
                      <button
                        onClick={() => cycle(step, i)}
                        title={`Estado: ${st} (pulsa para cambiar)`}
                        className={`-mt-1.5 h-3.5 w-3.5 rounded-full ring-2 ring-white ${dot}`}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
            <p className="mt-3 text-center text-xs text-muted">
              Ruta como grafo · cada tarjeta es un paso · pulsa la tarjeta para
              la ficha · el punto = tu estado.
            </p>
          </div>
        ) : (
        <>
        {/* Vista LISTA: diagrama ramificado (espina central + nodos alternando) */}
        <div className="relative mx-auto mt-8 max-w-3xl pb-2">
          {/* Espina: a la izquierda en móvil, centrada en sm+ */}
          <div className="absolute bottom-0 top-0 left-4 w-0.5 bg-line sm:left-1/2 sm:-translate-x-1/2" />

          <div className="space-y-3">
            {steps.map((step, i) => {
              if (step.section) {
                return (
                  <div
                    key={i}
                    className="relative flex py-2 pl-10 sm:justify-center sm:pl-0"
                  >
                    <h3
                      className={`relative z-10 rounded-full px-4 py-1.5 text-sm font-semibold ring-1 ${col.badge}`}
                    >
                      {step.title}
                    </h3>
                  </div>
                );
              }
              const key = nodeKey(roadmap.slug, step, i);
              const st = statusMap.get(key) || "pendiente";
              const isRight = sideByIndex.get(i) === "right";
              const isCert = !!step.certSlug;
              const boxClass =
                open?.title === step.title
                  ? "border-brand bg-brand/5"
                  : st === "obtenida"
                    ? "border-emerald-300 bg-emerald-50/60"
                    : st === "en-progreso"
                      ? "border-amber-300 bg-amber-50/60"
                      : st === "saltar"
                        ? "border-line bg-canvas opacity-70"
                        : "border-line bg-white hover:border-brand";
              const circle =
                st === "obtenida"
                  ? "border-emerald-500 bg-emerald-500 text-white"
                  : st === "en-progreso"
                    ? "border-amber-500 bg-amber-100 text-amber-600"
                    : st === "saltar"
                      ? "border-line bg-canvas text-muted"
                      : "border-line text-transparent hover:border-brand";
              return (
                <div
                  key={i}
                  className={`relative grid grid-cols-1 sm:grid-cols-2 sm:gap-x-10`}
                >
                  <div
                    className={`relative pl-10 sm:pl-0 ${
                      isRight
                        ? "sm:col-start-2 sm:justify-self-start"
                        : "sm:col-start-1 sm:justify-self-end"
                    }`}
                  >
                    {/* Conector al eje: izquierda en móvil; hacia el centro en sm+ */}
                    <span className="absolute left-4 top-1/2 h-px w-6 bg-line sm:hidden" />
                    <span
                      className={`absolute top-1/2 hidden h-px w-10 bg-line sm:block ${
                        isRight ? "left-0 -translate-x-full" : "right-0 translate-x-full"
                      }`}
                    />
                    <div
                      className={`flex items-center gap-2 rounded-lg border px-3 py-2.5 shadow-card transition sm:w-72 ${boxClass} ${isCert ? "" : "border-dashed"}`}
                    >
                      <button
                        onClick={() => cycle(step, i)}
                        title={`Estado: ${st}`}
                        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition ${circle}`}
                      >
                        {st === "en-progreso" ? (
                          <Clock size={13} />
                        ) : st === "saltar" ? (
                          <Minus size={13} />
                        ) : (
                          <Check size={14} />
                        )}
                      </button>
                      <button
                        onClick={() => selectStep(step)}
                        className="min-w-0 flex-1 text-left"
                      >
                        <span className="flex items-center gap-1.5">
                          <span
                            className={`font-medium leading-snug ${st === "saltar" ? "text-muted line-through" : ""}`}
                          >
                            {step.title}
                          </span>
                          {isCert && (
                            <span
                              className={`shrink-0 rounded px-1 py-px text-[10px] font-semibold ${col.badge}`}
                            >
                              CERT
                            </span>
                          )}
                        </span>
                        {step.note && (
                          <p className="text-xs text-muted">{step.note}</p>
                        )}
                      </button>
                      <ChevronRight size={15} className="shrink-0 text-muted" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <p className="mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-center text-xs text-muted">
          <span>
            <span className="font-semibold">CERT</span> = certificación (borde
            sólido)
          </span>
          <span>· tema/recurso = borde discontinuo</span>
          <span>· verde = hecho · ámbar = en curso</span>
        </p>
        </>
        )}
      </main>

      {/* Panel lateral */}
      {open && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/20"
            onClick={() => setOpen(null)}
          />
          <aside className="fixed right-0 top-0 z-50 h-full w-full max-w-md overflow-y-auto border-l border-line bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between gap-3">
              <h2 className="text-lg font-semibold">{open.title}</h2>
              <button
                onClick={() => setOpen(null)}
                className="rounded-md p-1 text-muted hover:bg-canvas"
              >
                <X size={18} />
              </button>
            </div>

            {open.note && <p className="mt-1 text-sm text-muted">{open.note}</p>}

            {loading && (
              <p className="mt-6 flex items-center gap-2 text-sm text-muted">
                <Loader2 size={15} className="animate-spin" /> Cargando…
              </p>
            )}

            {!loading && cert && (
              <>
                <p className="mt-1 text-sm text-brand">{cert.vendor.name}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="tag">{LEVEL[cert.level] ?? cert.level}</span>
                  <span className="tag">
                    {cert.cost === "gratis"
                      ? "Gratis"
                      : cert.priceEUR
                        ? `~${cert.priceEUR} €`
                        : "Pago"}
                  </span>
                  <span className="tag">Demanda: {cert.demand}</span>
                </div>

                {cert.skills?.length > 0 && (
                  <div className="mt-4">
                    <p className="text-xs font-semibold text-muted">
                      COMPETENCIAS
                    </p>
                    <div className="mt-1 flex flex-wrap gap-1.5">
                      {cert.skills.map((s) => (
                        <span key={s} className="tag">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-6">
                  <p className="text-xs font-semibold text-muted">
                    DÓNDE OBTENERLO
                  </p>
                  <div className="mt-2 space-y-2">
                    {cert.url && (
                      <a
                        href={cert.url}
                        target="_blank"
                        className="flex items-center justify-between rounded-md border border-line px-3 py-2 text-sm hover:border-brand"
                      >
                        <span className="flex items-center gap-2">
                          <span className="tag bg-emerald-50 text-emerald-700">
                            Oficial
                          </span>
                          Página oficial
                        </span>
                        <ExternalLink size={14} className="text-muted" />
                      </a>
                    )}
                    <a
                      href={`https://www.google.com/search?q=${encodeURIComponent(
                        cert.name + " curso",
                      )}`}
                      target="_blank"
                      className="flex items-center justify-between rounded-md border border-line px-3 py-2 text-sm hover:border-brand"
                    >
                      <span className="flex items-center gap-2">
                        <Search size={14} className="text-muted" /> Buscar cursos
                      </span>
                      <ExternalLink size={14} className="text-muted" />
                    </a>
                  </div>
                </div>

                <Link
                  href={`/certificaciones/${cert.slug}`}
                  className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-brand hover:underline"
                >
                  Ver ficha completa <ChevronRight size={14} />
                </Link>
              </>
            )}

            {!loading && !cert && (
              <div className="mt-5">
                <p className="text-xs font-semibold text-muted">
                  APRENDER ESTE TEMA
                </p>
                <p className="mt-1 text-xs text-muted">
                  “{open.title}” — dónde estudiarlo:
                </p>
                <div className="mt-2 space-y-2">
                  {open.url && (
                    <ResLink href={open.url} tag="Oficial" label="Recurso recomendado" />
                  )}
                  <ResLink
                    href={`https://www.youtube.com/results?search_query=${encodeURIComponent(open.title + " curso completo español")}`}
                    tag="Vídeo"
                    label="Curso / tutorial en vídeo"
                  />
                  <ResLink
                    href={`https://www.classcentral.com/search?q=${encodeURIComponent(open.title)}`}
                    tag="Gratis"
                    label="Cursos gratis (Class Central)"
                  />
                  <ResLink
                    href={`https://www.google.com/search?q=${encodeURIComponent(open.title + " guía tutorial")}`}
                    label="Guías y artículos (Google)"
                  />
                  <ResLink
                    href={`https://es.wikipedia.org/w/index.php?search=${encodeURIComponent(open.title)}`}
                    label="Wikipedia / documentación"
                  />
                </div>
              </div>
            )}
          </aside>
        </>
      )}
    </div>
  );
}

function ResLink({
  href,
  tag,
  label,
}: {
  href: string;
  tag?: string;
  label: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="flex items-center justify-between rounded-md border border-line px-3 py-2 text-sm hover:border-brand"
    >
      <span className="flex items-center gap-2">
        {tag ? (
          <span className="tag bg-emerald-50 text-emerald-700">{tag}</span>
        ) : (
          <Search size={14} className="text-muted" />
        )}
        {label}
      </span>
      <ExternalLink size={14} className="text-muted" />
    </a>
  );
}
