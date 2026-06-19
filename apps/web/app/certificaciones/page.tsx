import Link from "next/link";
import { Search, ExternalLink, SlidersHorizontal } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { CertLogo } from "@/components/CertLogo";
import { Badge } from "@/components/Badge";
import {
  getCertifications,
  safe,
  DOMAINS,
  LEVEL_LABEL,
  type Certification,
} from "@/lib/api";
import { domainColor, levelBadge } from "@/lib/taxonomy";

export const dynamic = "force-dynamic";

const LEVELS = ["fundamentos", "associate", "professional", "expert", "specialty"];

type SP = {
  domain?: string;
  cost?: string;
  level?: string;
  sort?: string;
  q?: string;
};

const priceAsc = (c: Certification) =>
  c.cost === "gratis" ? 0 : (c.priceEUR ?? Number.POSITIVE_INFINITY);
const priceDesc = (c: Certification) =>
  c.cost === "gratis" ? 0 : (c.priceEUR ?? -1);

export default async function CertificacionesPage({
  searchParams,
}: {
  searchParams: Promise<SP>;
}) {
  const sp = await searchParams;
  const all = await safe<Certification[]>(
    getCertifications({ domain: sp.domain, cost: sp.cost }),
    [],
  );

  const q = (sp.q || "").trim().toLowerCase();
  let certs = all.filter((c) => {
    if (q) {
      const hit =
        c.name.toLowerCase().includes(q) ||
        c.vendor.name.toLowerCase().includes(q) ||
        (c.code || "").toLowerCase().includes(q);
      if (!hit) return false;
    }
    if (sp.level && c.level !== sp.level) return false;
    return true;
  });

  if (sp.sort === "price-asc")
    certs = [...certs].sort((a, b) => priceAsc(a) - priceAsc(b));
  else if (sp.sort === "price-desc")
    certs = [...certs].sort((a, b) => priceDesc(b) - priceDesc(a));
  else if (sp.sort === "name")
    certs = [...certs].sort((a, b) => a.name.localeCompare(b.name));

  const href = (patch: Partial<SP>) => {
    const merged = { ...sp, ...patch };
    const qs = new URLSearchParams();
    for (const [k, v] of Object.entries(merged)) if (v) qs.set(k, v);
    const s = qs.toString();
    return `/certificaciones${s ? `?${s}` : ""}`;
  };

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-6 py-12">
        <h1 className="text-2xl font-semibold">Certificaciones</h1>
        <p className="mt-1 text-sm text-muted">
          {certs.length} resultados · filtra y ordena a tu gusto.
        </p>

        {/* Buscador */}
        <form className="mt-6 flex max-w-xl items-center gap-2 rounded-lg border border-line bg-white px-4 py-2.5 shadow-card">
          <Search size={18} className="text-muted" />
          <input
            type="text"
            name="q"
            defaultValue={sp.q || ""}
            placeholder="Buscar por nombre, fabricante o código…"
            className="w-full bg-transparent text-sm outline-none placeholder:text-muted"
          />
          {sp.domain && <input type="hidden" name="domain" value={sp.domain} />}
          {sp.cost && <input type="hidden" name="cost" value={sp.cost} />}
          {sp.level && <input type="hidden" name="level" value={sp.level} />}
          {sp.sort && <input type="hidden" name="sort" value={sp.sort} />}
          <button className="rounded-md bg-brand px-3 py-1.5 text-sm font-medium text-white hover:bg-brand-dark">
            Buscar
          </button>
        </form>

        {/* Filtros */}
        <div className="mt-6 space-y-3">
          <FilterRow label="Categoría">
            <Chip label="Todas" href={href({ domain: undefined })} active={!sp.domain} />
            {DOMAINS.map((d) => (
              <Chip key={d.key} label={d.label} href={href({ domain: d.key })} active={sp.domain === d.key} />
            ))}
          </FilterRow>

          <FilterRow label="Coste">
            <Chip label="Todos" href={href({ cost: undefined })} active={!sp.cost} />
            <Chip label="Gratis" href={href({ cost: "gratis" })} active={sp.cost === "gratis"} />
            <Chip label="De pago" href={href({ cost: "pago" })} active={sp.cost === "pago"} />
          </FilterRow>

          <FilterRow label="Nivel">
            <Chip label="Todos" href={href({ level: undefined })} active={!sp.level} />
            {LEVELS.map((l) => (
              <Chip key={l} label={LEVEL_LABEL[l] ?? l} href={href({ level: l })} active={sp.level === l} />
            ))}
          </FilterRow>

          <FilterRow label="Ordenar" icon>
            <Chip label="A-Z" href={href({ sort: "name" })} active={sp.sort === "name"} />
            <Chip label="Precio ↑" href={href({ sort: "price-asc" })} active={sp.sort === "price-asc"} />
            <Chip label="Precio ↓" href={href({ sort: "price-desc" })} active={sp.sort === "price-desc"} />
          </FilterRow>
        </div>

        {/* Resultados (tabla densa) */}
        {certs.length === 0 ? (
          <p className="mt-10 text-sm text-muted">No hay resultados con esos filtros.</p>
        ) : (
          <div className="mt-6 overflow-hidden rounded-md border border-line">
            <div className="grid grid-cols-12 gap-3 border-b border-line bg-canvas px-4 py-2 text-[11px] font-semibold uppercase tracking-wide text-muted">
              <span className="col-span-6">Certificación</span>
              <span className="col-span-2">Fabricante</span>
              <span className="col-span-2">Nivel</span>
              <span className="col-span-2 text-right">Coste</span>
            </div>
            {certs.map((c) => (
              <Link
                key={c.id}
                href={`/certificaciones/${c.slug}`}
                className="grid grid-cols-12 items-center gap-3 border-b border-line px-4 py-2.5 text-sm transition last:border-0 hover:bg-canvas"
              >
                <span className="col-span-6 flex min-w-0 items-center gap-3">
                  <CertLogo src={c.logoUrl} alt={c.vendor.name} size={32} />
                  <span className="min-w-0">
                    <span className="block truncate font-medium">{c.name}</span>
                    <span className="flex items-center gap-1.5 text-xs text-muted">
                      <span
                        className={`h-1.5 w-1.5 shrink-0 rounded-full ${domainColor(c.category.domain).dot}`}
                      />
                      <span className="truncate">{c.category.name}</span>
                    </span>
                  </span>
                </span>
                <span className="col-span-2 truncate text-muted">
                  {c.vendor.name}
                </span>
                <span className="col-span-2">
                  <Badge className={levelBadge(c.level)}>
                    {LEVEL_LABEL[c.level] ?? c.level}
                  </Badge>
                </span>
                <span className="col-span-2 text-right tabular-nums text-muted">
                  {c.cost === "gratis"
                    ? "Gratis"
                    : c.priceEUR
                      ? `${c.priceEUR} €`
                      : "Consultar"}
                </span>
              </Link>
            ))}
          </div>
        )}

        <p className="mt-6 flex items-center gap-1 text-xs text-muted">
          <ExternalLink size={12} /> {certs.length} resultados · datos vía API.
        </p>
      </main>
    </div>
  );
}

function FilterRow({
  label,
  icon,
  children,
}: {
  label: string;
  icon?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="flex w-20 shrink-0 items-center gap-1 text-xs font-semibold text-muted">
        {icon && <SlidersHorizontal size={12} />}
        {label}
      </span>
      {children}
    </div>
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
      className={`rounded-md border px-2.5 py-1 text-sm transition ${
        active
          ? "border-brand bg-brand text-white"
          : "border-line bg-white text-ink hover:bg-canvas"
      }`}
    >
      {label}
    </Link>
  );
}
