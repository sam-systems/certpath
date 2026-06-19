const API = process.env.API_URL || "http://127.0.0.1:4000/api";

export interface Certification {
  id: string;
  slug: string;
  name: string;
  code?: string | null;
  level: string;
  cost: string;
  priceEUR?: number | null;
  url: string;
  prepHours?: number | null;
  validityYears?: number | null;
  demand: string;
  skills: string[];
  logoUrl?: string | null;
  description?: string | null;
  targetRoles: string[];
  careerOutcomes: string[];
  prereqs?: string | null;
  vendor: { id: string; name: string };
  category: { id: string; name: string; domain: string };
}

export interface RoadmapStep {
  certSlug?: string;
  title: string;
  note?: string;
  url?: string;
  section?: boolean;
}

export interface Roadmap {
  id: string;
  slug: string;
  title: string;
  role: string;
  description: string;
  domain: string;
  estMonths: number;
  estCostEUR: number;
  difficulty: string;
  salaryRange?: string | null;
  steps: RoadmapStep[];
}

export const DOMAINS = [
  { key: "cloud", label: "Cloud" },
  { key: "ciberseguridad", label: "Ciberseguridad" },
  { key: "redes", label: "Redes" },
  { key: "linux", label: "Linux & Sistemas" },
  { key: "devops", label: "DevOps" },
  { key: "soporte", label: "Soporte" },
  { key: "ia", label: "IA & Datos" },
  { key: "grc", label: "GRC" },
  { key: "desarrollo", label: "Desarrollo" },
];

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    cache: "no-store",
    signal: AbortSignal.timeout(5000),
  });
  if (!res.ok) throw new Error(`API ${res.status} en ${path}`);
  return res.json() as Promise<T>;
}

export async function getCertifications(params?: {
  domain?: string;
  vendor?: string;
  cost?: string;
}): Promise<Certification[]> {
  const qs = new URLSearchParams();
  if (params?.domain) qs.set("domain", params.domain);
  if (params?.vendor) qs.set("vendor", params.vendor);
  if (params?.cost) qs.set("cost", params.cost);
  const q = qs.toString();
  return get<Certification[]>(`/certifications${q ? `?${q}` : ""}`);
}

export const getCertification = (slug: string) =>
  get<Certification>(`/certifications/${slug}`);

export const getRoadmaps = () => get<Roadmap[]>("/roadmaps");
export const getRoadmap = (slug: string) =>
  get<Roadmap>(`/roadmaps/${slug}`);

// Variante segura: devuelve fallback si la API no responde (no rompe la página)
export async function safe<T>(p: Promise<T>, fallback: T): Promise<T> {
  try {
    return await p;
  } catch {
    return fallback;
  }
}

export const LEVEL_LABEL: Record<string, string> = {
  fundamentos: "Fundamentos",
  associate: "Associate",
  professional: "Professional",
  expert: "Expert",
  specialty: "Specialty",
};

// ── Libros ──
export interface Book {
  id: string;
  slug: string;
  title: string;
  author: string;
  publisher?: string | null;
  pages?: number | null;
  domain: string;
  level: string;
  audience: string;
  tags: string[];
  buyUrl?: string | null;
  fileUrl?: string | null;
  summary?: string | null;
  isbn?: string | null;
  coverUrl?: string | null;
}

export const BOOK_LEVELS = ["principiante", "intermedio", "avanzado"];
export const AUDIENCES = ["estudiante", "profesional", "ambos"];

export const getBook = (slug: string) => get<Book>(`/books/${slug}`);
export const getBooks = () => get<Book[]>("/books");

// ── Recursos / enlaces importantes ──
export interface Resource {
  id: string;
  title: string;
  url: string;
  description?: string | null;
  category: string;
  createdAt: string;
}

export const getResources = () => get<Resource[]>("/resources");

