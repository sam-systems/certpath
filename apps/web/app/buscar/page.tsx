import Link from "next/link";
import { GraduationCap, Route, BookOpen } from "lucide-react";
import {
  getCertifications,
  getRoadmaps,
  getBooks,
  safe,
  LEVEL_LABEL,
  type Certification,
  type Roadmap,
  type Book,
} from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function BuscarPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const sp = await searchParams;
  const q = (sp.q || "").trim().toLowerCase();

  const [certs, roadmaps, books] = await Promise.all([
    safe<Certification[]>(getCertifications(), []),
    safe<Roadmap[]>(getRoadmaps(), []),
    safe<Book[]>(getBooks(), []),
  ]);

  const certHits = q
    ? certs.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.vendor.name.toLowerCase().includes(q) ||
          (c.code || "").toLowerCase().includes(q),
      )
    : [];
  const roadmapHits = q
    ? roadmaps.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.role.toLowerCase().includes(q) ||
          r.steps.some((s) => s.title.toLowerCase().includes(q)),
      )
    : [];
  const bookHits = q
    ? books.filter(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          b.author.toLowerCase().includes(q),
      )
    : [];

  const total = certHits.length + roadmapHits.length + bookHits.length;

  return (
    <main className="mx-auto max-w-4xl px-8 py-10">
      <h1 className="text-xl font-semibold tracking-tight">
        Búsqueda{q ? `: "${sp.q}"` : ""}
      </h1>
      <p className="mt-1 text-sm text-muted">
        {q ? `${total} resultados en certificaciones, roadmaps y libros.` : "Escribe arriba para buscar."}
      </p>

      {q && total === 0 && (
        <p className="mt-8 text-sm text-muted">Sin resultados para “{sp.q}”.</p>
      )}

      {certHits.length > 0 && (
        <Section
          title="Certificaciones"
          icon={<GraduationCap size={15} />}
          count={certHits.length}
        >
          {certHits.slice(0, 20).map((c) => (
            <Row
              key={c.id}
              href={`/certificaciones/${c.slug}`}
              title={c.name}
              meta={`${c.vendor.name} · ${LEVEL_LABEL[c.level] ?? c.level}`}
            />
          ))}
        </Section>
      )}

      {roadmapHits.length > 0 && (
        <Section title="Roadmaps" icon={<Route size={15} />} count={roadmapHits.length}>
          {roadmapHits.map((r) => (
            <Row
              key={r.id}
              href={`/roadmaps/${r.slug}`}
              title={r.title}
              meta={`${r.role} · ${r.steps.length} nodos`}
            />
          ))}
        </Section>
      )}

      {bookHits.length > 0 && (
        <Section title="Libros" icon={<BookOpen size={15} />} count={bookHits.length}>
          {bookHits.map((b) => (
            <Row
              key={b.id}
              href={`/libros/${b.slug}`}
              title={b.title}
              meta={b.author}
            />
          ))}
        </Section>
      )}
    </main>
  );
}

function Section({
  title,
  icon,
  count,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  count: number;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-8">
      <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted">
        {icon} {title} <span className="text-muted/70">({count})</span>
      </h2>
      <div className="mt-3 overflow-hidden rounded-md border border-line">
        {children}
      </div>
    </section>
  );
}

function Row({
  href,
  title,
  meta,
}: {
  href: string;
  title: string;
  meta: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center justify-between border-b border-line px-4 py-2.5 text-sm last:border-0 hover:bg-canvas"
    >
      <span className="min-w-0 truncate font-medium">{title}</span>
      <span className="ml-3 shrink-0 truncate text-xs text-muted">{meta}</span>
    </Link>
  );
}
