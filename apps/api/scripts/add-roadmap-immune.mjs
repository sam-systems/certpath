import "dotenv/config";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const API = process.env.API_URL || "http://127.0.0.1:4000/api";
const TOKEN = process.env.IMPORT_TOKEN;

// 1) Certificaciones que faltan en el catálogo (las 3 de Cisco/Microsoft ya existen)
const newCerts = [
  {
    name: "Pearson IT Specialist – Network Security",
    slug: "pearson-its-network-security",
    vendor: "Pearson", domain: "ciberseguridad", level: "fundamentos", cost: "pago",
    url: "https://www.certiport.com/portal/desktopdefault.aspx?tabid=663",
    skills: ["Seguridad de red", "Firewalls", "VPN", "Autenticación"],
  },
  {
    name: "Pearson IT Specialist – Cybersecurity",
    slug: "pearson-its-cybersecurity",
    vendor: "Pearson", domain: "ciberseguridad", level: "fundamentos", cost: "pago",
    url: "https://www.certiport.com/portal/desktopdefault.aspx?tabid=663",
    skills: ["Ciberseguridad", "Amenazas", "Defensa", "Buenas prácticas"],
  },
  {
    name: "Cisco Ethical Hacker",
    slug: "cisco-ethical-hacker",
    vendor: "Cisco", domain: "ciberseguridad", level: "associate", cost: "gratis",
    url: "https://www.netacad.com/courses/ethical-hacker",
    skills: ["Hacking ético", "Pentesting", "Vulnerabilidades", "Explotación"],
  },
  {
    name: "CCSP (Certified Cyber Security Professional) — ISMS Forum",
    slug: "ccsp-isms-forum",
    vendor: "ISMS Forum", domain: "ciberseguridad", level: "professional", cost: "pago",
    url: "https://www.ismsforum.es/",
    skills: ["Ciberseguridad", "GRC", "Gestión de seguridad"],
  },
];

const res = await fetch(`${API}/certifications/import`, {
  method: "POST",
  headers: { "Content-Type": "application/json", "x-import-token": TOKEN },
  body: JSON.stringify({ items: newCerts }),
});
console.log("Certs import:", res.status, await res.text());

// 2) Roadmap del máster
const sec = (title) => ({ title, section: true });
const t = (title) => ({ title });
const s = (certSlug, title) => ({ certSlug, title });

const roadmap = {
  slug: "master-ciberseguridad-immune",
  title: "Máster en Ciberseguridad (IMMUNE)",
  role: "Analista de Ciberseguridad / SOC",
  description:
    "Programa intensivo y 100% práctico (IMMUNE Technology Institute): de fundamentos a SOC, hacking ético, forense, ciberinteligencia, bastionado, GRC y 7 certificaciones.",
  domain: "ciberseguridad",
  estMonths: 12,
  estCostEUR: 12000,
  difficulty: "alta",
  salaryRange: "28.000 – 55.000 €",
  steps: [
    sec("Fundamentos"),
    t("Redes y comunicaciones"),
    t("Sistemas operativos (Windows / Linux)"),
    t("Criptografía aplicada"),
    t("Scripting (Python / Bash)"),
    sec("Hacking ético y ofensiva"),
    t("Metodología de pentesting"),
    t("Reconocimiento y enumeración"),
    t("Explotación de vulnerabilidades"),
    t("Capture The Flag (CTF)"),
    sec("Defensa, SOC y análisis"),
    t("Operación de SOC"),
    t("Análisis de malware"),
    t("Respuesta a incidentes"),
    t("Ciberinteligencia (Threat Intelligence)"),
    t("Análisis forense digital"),
    sec("Infraestructura y bastionado"),
    t("Hardening de sistemas"),
    t("Seguridad de red"),
    t("Auditoría de sistemas"),
    sec("GRC y cumplimiento"),
    t("ISO 27001"),
    t("Legislación en ciberseguridad"),
    t("Gestión de riesgos"),
    sec("Certificaciones del máster"),
    s("security-compliance-identity-fundamentals", "Microsoft SC-900"),
    s("ccst-networking", "Cisco CCST Networking"),
    s("ccst-cybersecurity", "Cisco CCST Cybersecurity"),
    s("cisco-ethical-hacker", "Cisco Ethical Hacker"),
    s("pearson-its-network-security", "Pearson IT Specialist · Network Security"),
    s("pearson-its-cybersecurity", "Pearson IT Specialist · Cybersecurity"),
    s("ccsp-isms-forum", "CCSP (ISMS Forum)"),
  ],
};

const data = {
  title: roadmap.title, role: roadmap.role, description: roadmap.description,
  domain: roadmap.domain, estMonths: roadmap.estMonths, estCostEUR: roadmap.estCostEUR,
  difficulty: roadmap.difficulty, salaryRange: roadmap.salaryRange,
  steps: JSON.stringify(roadmap.steps),
};
await prisma.roadmap.upsert({
  where: { slug: roadmap.slug }, update: data, create: { slug: roadmap.slug, ...data },
});
const total = await prisma.roadmap.count();
console.log(`OK: roadmap "${roadmap.title}" añadido. Total roadmaps: ${total}`);
process.exit(0);
