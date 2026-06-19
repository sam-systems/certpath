// Sistema de color SEMÁNTICO para diferenciar visualmente sin "dibujitos".
// Tonos suaves (50/100/200) estilo Linear/Stripe: identifican, no gritan.

// ── Dominios / categorías ──────────────────────────────────────────────
export interface DomainColor {
  // contenedor del icono (fondo tenue + icono de color)
  wrap: string;
  // punto/acento sólido
  dot: string;
  // borde lateral de acento
  bar: string;
  // badge (chip) del dominio
  badge: string;
}

export const DOMAIN_COLOR: Record<string, DomainColor> = {
  cloud: {
    wrap: "bg-sky-50 text-sky-600 ring-1 ring-sky-100",
    dot: "bg-sky-500",
    bar: "border-l-sky-400",
    badge: "bg-sky-50 text-sky-700 ring-1 ring-sky-200",
  },
  ciberseguridad: {
    wrap: "bg-rose-50 text-rose-600 ring-1 ring-rose-100",
    dot: "bg-rose-500",
    bar: "border-l-rose-400",
    badge: "bg-rose-50 text-rose-700 ring-1 ring-rose-200",
  },
  redes: {
    wrap: "bg-indigo-50 text-indigo-600 ring-1 ring-indigo-100",
    dot: "bg-indigo-500",
    bar: "border-l-indigo-400",
    badge: "bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200",
  },
  linux: {
    wrap: "bg-amber-50 text-amber-600 ring-1 ring-amber-100",
    dot: "bg-amber-500",
    bar: "border-l-amber-400",
    badge: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  },
  devops: {
    wrap: "bg-violet-50 text-violet-600 ring-1 ring-violet-100",
    dot: "bg-violet-500",
    bar: "border-l-violet-400",
    badge: "bg-violet-50 text-violet-700 ring-1 ring-violet-200",
  },
  soporte: {
    wrap: "bg-slate-100 text-slate-600 ring-1 ring-slate-200",
    dot: "bg-slate-400",
    bar: "border-l-slate-400",
    badge: "bg-slate-100 text-slate-700 ring-1 ring-slate-200",
  },
  ia: {
    wrap: "bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100",
    dot: "bg-emerald-500",
    bar: "border-l-emerald-400",
    badge: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  },
  grc: {
    wrap: "bg-teal-50 text-teal-600 ring-1 ring-teal-100",
    dot: "bg-teal-500",
    bar: "border-l-teal-400",
    badge: "bg-teal-50 text-teal-700 ring-1 ring-teal-200",
  },
  desarrollo: {
    wrap: "bg-cyan-50 text-cyan-600 ring-1 ring-cyan-100",
    dot: "bg-cyan-500",
    bar: "border-l-cyan-400",
    badge: "bg-cyan-50 text-cyan-700 ring-1 ring-cyan-200",
  },
};

export const DOMAIN_DEFAULT: DomainColor = {
  wrap: "bg-slate-100 text-slate-500 ring-1 ring-slate-200",
  dot: "bg-slate-400",
  bar: "border-l-slate-300",
  badge: "bg-slate-100 text-slate-600 ring-1 ring-slate-200",
};

export const domainColor = (domain?: string): DomainColor =>
  (domain && DOMAIN_COLOR[domain]) || DOMAIN_DEFAULT;

// ── Niveles (rampa de seniority) ───────────────────────────────────────
export const LEVEL_BADGE: Record<string, string> = {
  fundamentos: "bg-slate-100 text-slate-700 ring-1 ring-slate-200",
  associate: "bg-sky-50 text-sky-700 ring-1 ring-sky-200",
  professional: "bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200",
  expert: "bg-violet-50 text-violet-700 ring-1 ring-violet-200",
  specialty: "bg-teal-50 text-teal-700 ring-1 ring-teal-200",
};

export const levelBadge = (level: string): string =>
  LEVEL_BADGE[level] || "bg-slate-100 text-slate-700 ring-1 ring-slate-200";

// ── Dificultad de un roadmap ───────────────────────────────────────────
export const DIFFICULTY_BADGE: Record<string, string> = {
  baja: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  "básica": "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  basica: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  media: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  alta: "bg-orange-50 text-orange-700 ring-1 ring-orange-200",
  "muy-alta": "bg-rose-50 text-rose-700 ring-1 ring-rose-200",
};

export const difficultyBadge = (d: string): string =>
  DIFFICULTY_BADGE[d] || "bg-slate-100 text-slate-700 ring-1 ring-slate-200";

// ── Demanda de una certificación ───────────────────────────────────────
export const DEMAND_BADGE: Record<string, string> = {
  media: "bg-slate-100 text-slate-600 ring-1 ring-slate-200",
  alta: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  "muy-alta": "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
};

export const demandBadge = (d: string): string =>
  DEMAND_BADGE[d] || "bg-slate-100 text-slate-600 ring-1 ring-slate-200";
