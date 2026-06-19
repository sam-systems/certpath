import Link from "next/link";
import {
  ArrowRight,
  Cloud,
  Shield,
  Network,
  Terminal,
  Boxes,
  BrainCircuit,
  Headphones,
  ClipboardCheck,
  Code2,
} from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { getRoadmaps, safe, DOMAINS, type Roadmap } from "@/lib/api";
import { domainColor, difficultyBadge } from "@/lib/taxonomy";
import { Badge } from "@/components/Badge";

export const dynamic = "force-dynamic";

const DOMAIN_ICON: Record<
  string,
  React.ComponentType<{ size?: number; className?: string }>
> = {
  cloud: Cloud,
  ciberseguridad: Shield,
  redes: Network,
  linux: Terminal,
  devops: Boxes,
  soporte: Headphones,
  ia: BrainCircuit,
  grc: ClipboardCheck,
  desarrollo: Code2,
};

// Orden por dificultad: de más fácil a más extrema
const DIFF_ORDER: Record<string, number> = {
  baja: 0,
  "básica": 0,
  basica: 0,
  media: 1,
  alta: 2,
  "muy-alta": 3,
  extrema: 4,
};
const byDifficulty = (a: Roadmap, b: Roadmap) =>
  (DIFF_ORDER[a.difficulty] ?? 1) - (DIFF_ORDER[b.difficulty] ?? 1);

export default async function RoadmapsPage({
  searchParams,
}: {
  searchParams: Promise<{ domain?: string }>;
}) {
  const sp = await searchParams;
  const all = await safe<Roadmap[]>(getRoadmaps(), []);
  const roadmaps = sp.domain
    ? all.filter((r) => r.domain === sp.domain)
    : all;

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-6 py-12">
        <h1 className="text-2xl font-semibold">Roadmaps profesionales</h1>
        <p className="mt-1 text-sm text-muted">
          {all.length} rutas por categoría y salida profesional. Pulsa una y
          luego cada paso para ver dónde obtenerlo.
        </p>

        {/* Filtro por categoría */}
        <div className="mt-6 flex flex-wrap gap-2">
          <Chip label="Todas" href="/roadmaps" active={!sp.domain} />
          {DOMAINS.map((d) => (
            <Chip
              key={d.key}
              label={d.label}
              href={`/roadmaps?domain=${d.key}`}
              active={sp.domain === d.key}
            />
          ))}
        </div>

        {all.length === 0 ? (
          <p className="mt-10 text-sm text-muted">No hay roadmaps.</p>
        ) : sp.domain ? (
          // Vista filtrada: rejilla plana
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {roadmaps.map((r) => (
              <RoadmapCard key={r.id} r={r} />
            ))}
          </div>
        ) : (
          // Vista por carreras: agrupado por área profesional (estilo roadmap.sh)
          <div className="mt-8 space-y-10">
            {DOMAINS.filter((d) => all.some((r) => r.domain === d.key)).map(
              (d) => {
                const list = all
                  .filter((r) => r.domain === d.key)
                  .sort(byDifficulty);
                const col = domainColor(d.key);
                const Icon = DOMAIN_ICON[d.key] ?? Boxes;
                return (
                  <section key={d.key}>
                    <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted">
                      <span
                        className={`flex h-6 w-6 items-center justify-center rounded ${col.wrap}`}
                      >
                        <Icon size={14} />
                      </span>
                      {d.label}{" "}
                      <span className="text-muted/70">({list.length})</span>
                    </h2>
                    <div className="mt-3 grid gap-4 sm:grid-cols-2">
                      {list.map((r) => (
                        <RoadmapCard key={r.id} r={r} />
                      ))}
                    </div>
                  </section>
                );
              },
            )}
          </div>
        )}
      </main>
    </div>
  );
}

function RoadmapCard({ r }: { r: Roadmap }) {
  const col = domainColor(r.domain);
  const Icon = DOMAIN_ICON[r.domain] ?? Boxes;
  const domainLabel =
    DOMAINS.find((d) => d.key === r.domain)?.label ?? r.domain;
  return (
    <Link
      href={`/roadmaps/${r.slug}`}
      className={`card border-l-2 p-6 transition hover:shadow-card ${col.bar}`}
    >
      <div className="flex items-start gap-3">
        <span
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${col.wrap}`}
        >
          <Icon size={19} />
        </span>
        <div className="min-w-0">
          <p className="text-sm text-brand">{r.role}</p>
          <h3 className="font-semibold">{r.title}</h3>
          <p className="mt-1 line-clamp-2 text-sm text-muted">{r.description}</p>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Badge className={col.badge}>{domainLabel}</Badge>
        <Badge className={difficultyBadge(r.difficulty)}>{r.difficulty}</Badge>
        <span className="text-xs text-muted">
          {r.steps.length} pasos · {r.estMonths} meses · ~{r.estCostEUR} €
        </span>
      </div>
      {r.salaryRange && (
        <p className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-ink">
          {r.salaryRange} <ArrowRight size={14} className="text-muted" />
        </p>
      )}
    </Link>
  );
}

function Chip({
  label,
  href,
  active,
}: {
  label: string;
  href: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={`rounded-md border px-3 py-1.5 text-sm transition ${
        active
          ? "border-brand bg-brand text-white"
          : "border-line bg-white text-ink hover:bg-canvas"
      }`}
    >
      {label}
    </Link>
  );
}
