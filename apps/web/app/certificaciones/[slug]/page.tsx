import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ExternalLink,
  Clock,
  RefreshCw,
  TrendingUp,
  Briefcase,
  Target,
  UserCheck,
} from "lucide-react";
import { CertLogo } from "@/components/CertLogo";
import { Badge } from "@/components/Badge";
import { getCertification, safe, LEVEL_LABEL, type Certification } from "@/lib/api";
import { deriveCertInfo } from "@/lib/certInfo";
import { levelBadge, demandBadge, domainColor } from "@/lib/taxonomy";

export const dynamic = "force-dynamic";

export default async function CertDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cert = await safe<Certification | null>(getCertification(slug), null);
  if (!cert) notFound();

  const info = deriveCertInfo(cert);

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <Link
        href="/certificaciones"
        className="inline-flex items-center gap-1 text-sm text-muted hover:text-ink"
      >
        <ArrowLeft size={15} /> Volver al catálogo
      </Link>

      <div className={`card mt-5 border-l-2 p-7 ${domainColor(cert.category.domain).bar}`}>
        <div className="flex items-start gap-4">
          <CertLogo src={cert.logoUrl} alt={cert.vendor.name} size={64} />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm text-brand">{cert.vendor.name}</p>
                <h1 className="mt-0.5 text-2xl font-semibold">{cert.name}</h1>
                {cert.code && (
                  <p className="mt-1 text-sm text-muted">Código: {cert.code}</p>
                )}
              </div>
              <div className="flex shrink-0 flex-wrap items-center gap-2">
                <Badge className={domainColor(cert.category.domain).badge}>
                  {cert.category.name}
                </Badge>
                <Badge className={levelBadge(cert.level)}>
                  {LEVEL_LABEL[cert.level] ?? cert.level}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Fact
            icon={<TrendingUp size={16} />}
            label="Demanda"
            value={cert.demand}
            badgeClass={demandBadge(cert.demand)}
          />
          <Fact
            icon={<Clock size={16} />}
            label="Preparación"
            value={cert.prepHours ? `${cert.prepHours} h` : "—"}
          />
          <Fact
            icon={<RefreshCw size={16} />}
            label="Validez"
            value={cert.validityYears ? `${cert.validityYears} años` : "No caduca"}
          />
          <Fact
            label="Coste"
            value={
              cert.cost === "gratis"
                ? "Gratis"
                : cert.priceEUR
                  ? `~${cert.priceEUR} €`
                  : "Bajo demanda"
            }
          />
        </div>

        {/* Para qué sirve */}
        <Section title="¿Para qué sirve?">
          <p className="text-sm leading-relaxed text-ink/80">{info.description}</p>
        </Section>

        {/* Roles a los que prepara */}
        <Section title="Roles a los que prepara" icon={<Target size={15} />}>
          <div className="flex flex-wrap gap-2">
            {info.roles.map((r) => (
              <span key={r} className="tag">
                {r}
              </span>
            ))}
          </div>
        </Section>

        {/* Salidas profesionales */}
        <Section title="Salidas profesionales" icon={<Briefcase size={15} />}>
          <ul className="grid gap-1.5 sm:grid-cols-2">
            {info.outcomes.map((o) => (
              <li key={o} className="flex items-start gap-2 text-sm text-ink/80">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-muted" />
                {o}
              </li>
            ))}
          </ul>
        </Section>

        {/* Perfil / a quién va dirigida */}
        <Section title="¿Para quién es?" icon={<UserCheck size={15} />}>
          <p className="text-sm leading-relaxed text-ink/80">{info.profile}</p>
        </Section>

        {/* Competencias */}
        {cert.skills.length > 0 && (
          <Section title="Competencias">
            <div className="flex flex-wrap gap-2">
              {cert.skills.map((s) => (
                <span key={s} className="tag">
                  {s}
                </span>
              ))}
            </div>
          </Section>
        )}

        <div className="mt-7 flex items-center gap-3">
          <a
            href={cert.url}
            target="_blank"
            className="inline-flex items-center gap-2 rounded-md bg-brand px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-dark"
          >
            Página oficial <ExternalLink size={15} />
          </a>
          <span className="text-xs text-muted">
            {cert.category.name}
          </span>
        </div>
      </div>
    </main>
  );
}

function Section({
  title,
  icon,
  children,
}: {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-6 border-t border-line pt-5">
      <h2 className="flex items-center gap-1.5 text-sm font-semibold">
        {icon}
        {title}
      </h2>
      <div className="mt-2.5">{children}</div>
    </div>
  );
}

function Fact({
  icon,
  label,
  value,
  badgeClass,
}: {
  icon?: React.ReactNode;
  label: string;
  value: string;
  badgeClass?: string;
}) {
  return (
    <div className="rounded-md border border-line bg-canvas p-3">
      <p className="flex items-center gap-1 text-xs text-muted">
        {icon}
        {label}
      </p>
      {badgeClass ? (
        <span
          className={`mt-1 inline-flex items-center rounded px-1.5 py-0.5 text-xs font-medium capitalize ${badgeClass}`}
        >
          {value}
        </span>
      ) : (
        <p className="mt-1 text-sm font-medium capitalize">{value}</p>
      )}
    </div>
  );
}
