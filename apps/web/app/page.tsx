import Link from "next/link";
import {
  Cloud,
  Shield,
  Network,
  Terminal,
  Boxes,
  BrainCircuit,
  Headphones,
  ClipboardCheck,
  Code2,
  Search,
  Route,
  ArrowRight,
} from "lucide-react";
import {
  getCertifications,
  getRoadmaps,
  safe,
  DOMAINS,
  LEVEL_LABEL,
  type Certification,
  type Roadmap,
} from "@/lib/api";
import { domainColor, levelBadge } from "@/lib/taxonomy";
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

export default async function HomePage() {
  const [certs, roadmaps] = await Promise.all([
    safe<Certification[]>(getCertifications(), []),
    safe<Roadmap[]>(getRoadmaps(), []),
  ]);

  const counts = new Map<string, number>();
  for (const c of certs)
    counts.set(c.category.domain, (counts.get(c.category.domain) || 0) + 1);

  const vendors = new Set(certs.map((c) => c.vendor.name)).size;
  const featured = certs.filter((c) => c.demand === "muy-alta").slice(0, 6);
  const featuredRoadmaps = roadmaps
    .filter((r) => /completo/i.test(r.title))
    .slice(0, 6);

  return (
    <main className="mx-auto max-w-6xl px-8 py-10">
      {/* Header de página (no landing) */}
      <header className="border-b border-line pb-6">
        <h1 className="text-xl font-semibold tracking-tight">
          Certificaciones y roadmaps técnicos
        </h1>
        <p className="mt-1 text-sm text-muted">
          Cloud · Ciberseguridad · Redes · Linux · DevOps · IA · Desarrollo —
          España, Europa y mundial.
        </p>
      </header>

      {/* Stats */}
      <section className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-4">
        {[
          [String(certs.length), "Certificaciones / programas"],
          [String(roadmaps.length), "Roadmaps"],
          [String(vendors), "Fabricantes / centros"],
          ["∞", "Capacidad"],
        ].map(([n, l]) => (
          <div key={l} className="bg-white px-5 py-4">
            <p className="text-2xl font-semibold">{n}</p>
            <p className="mt-0.5 text-xs text-muted">{l}</p>
          </div>
        ))}
      </section>

      {/* Categorías */}
      <section className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
            Categorías
          </h2>
          <Link href="/certificaciones" className="text-sm text-brand hover:underline">
            Ver catálogo
          </Link>
        </div>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {DOMAINS.map((d) => {
            const Icon = DOMAIN_ICON[d.key] ?? Boxes;
            const col = domainColor(d.key);
            return (
              <Link
                key={d.key}
                href={`/certificaciones?domain=${d.key}`}
                className={`card flex items-center gap-3 border-l-2 p-4 transition hover:shadow-card ${col.bar}`}
              >
                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${col.wrap}`}
                >
                  <Icon size={19} />
                </span>
                <div className="min-w-0">
                  <p className="font-medium">{d.label}</p>
                  <p className="text-xs text-muted">
                    {counts.get(d.key) || 0} certificaciones
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Roadmaps */}
      {featuredRoadmaps.length > 0 && (
        <section className="mt-10">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
              Roadmaps completos
            </h2>
            <Link href="/roadmaps" className="text-sm text-brand hover:underline">
              Ver todos
            </Link>
          </div>
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {featuredRoadmaps.map((r) => {
              const col = domainColor(r.domain);
              return (
                <Link
                  key={r.id}
                  href={`/roadmaps/${r.slug}`}
                  className={`card border-l-2 p-4 transition hover:shadow-card ${col.bar}`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`h-2 w-2 shrink-0 rounded-full ${col.dot}`} />
                    <span className="font-medium">{r.role}</span>
                  </div>
                  <p className="mt-1 text-xs text-muted">
                    {r.steps.length} nodos · {r.estMonths} meses
                  </p>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* Certis destacadas */}
      {featured.length > 0 && (
        <section className="mt-10">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
              Más demandadas
            </h2>
            <Link href="/certificaciones" className="text-sm text-brand hover:underline">
              Ver todas
            </Link>
          </div>
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((c) => {
              const col = domainColor(c.category.domain);
              return (
                <Link
                  key={c.id}
                  href={`/certificaciones/${c.slug}`}
                  className={`card flex items-start justify-between gap-2 border-l-2 p-4 transition hover:shadow-card ${col.bar}`}
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium">{c.name}</p>
                    <p className="mt-0.5 text-xs text-muted">{c.vendor.name}</p>
                  </div>
                  <Badge className={`shrink-0 ${levelBadge(c.level)}`}>
                    {LEVEL_LABEL[c.level] ?? c.level}
                  </Badge>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      <footer className="mt-12 flex items-center gap-2 border-t border-line pt-6 text-xs text-muted">
        <ArrowRight size={12} /> CertPath · plataforma de certificaciones y
        roadmaps técnicos
      </footer>
    </main>
  );
}
