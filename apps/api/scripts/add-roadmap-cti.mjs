import "dotenv/config";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const sec = (title) => ({ title, section: true });
const t = (title) => ({ title });
const s = (certSlug, title) => ({ certSlug, title });

const roadmap = {
  slug: "ciberinteligencia",
  title: "Analista de Ciberinteligencia (CTI)",
  role: "Cyber Threat Intelligence Analyst",
  description:
    "Recopila, analiza y difunde inteligencia sobre amenazas: actores, campañas, TTPs e IOCs para anticipar y frenar ataques.",
  domain: "ciberseguridad",
  estMonths: 18,
  estCostEUR: 1300,
  difficulty: "alta",
  salaryRange: "30.000 – 60.000 €",
  steps: [
    sec("Fundamentos"),
    t("Redes (TCP/IP, DNS, HTTP)"),
    t("Sistemas operativos (Windows / Linux)"),
    t("Línea de comandos y scripting (Python)"),
    t("Inglés técnico"),
    sec("Ciberseguridad base"),
    t("Conceptos de seguridad (CIA)"),
    t("Tipos de malware y ataques"),
    t("Panorama de amenazas"),
    s("comptia-security", "CompTIA Security+"),
    sec("Ciclo de inteligencia"),
    t("Dirección y requisitos (PIRs)"),
    t("Recolección"),
    t("Procesamiento"),
    t("Análisis"),
    t("Difusión y feedback"),
    sec("Marcos y modelos"),
    t("MITRE ATT&CK"),
    t("Cyber Kill Chain (Lockheed Martin)"),
    t("Diamond Model"),
    t("Pirámide del dolor (IOCs vs TTPs)"),
    t("Niveles: estratégico / operacional / táctico"),
    sec("OSINT y recolección"),
    t("Técnicas OSINT"),
    t("Maltego"),
    t("Shodan / Censys"),
    t("Búsqueda en dark web"),
    t("Google dorking"),
    sec("Plataformas y herramientas"),
    t("MISP"),
    t("OpenCTI"),
    t("VirusTotal"),
    t("Threat feeds (STIX/TAXII)"),
    t("YARA / Sigma"),
    sec("Análisis técnico"),
    t("Análisis de IOCs"),
    t("Triaje de malware"),
    t("Fingerprinting de infraestructura (C2)"),
    t("Atribución de actores (APT)"),
    sec("Reporting"),
    t("Protocolo TLP"),
    t("Informes para dirección"),
    t("Informes técnicos / IOCs accionables"),
    sec("Certificaciones"),
    s("giac-gcti-threat-intelligence", "GIAC GCTI"),
    s("comptia-cysa", "CompTIA CySA+"),
    t("EC-Council CTIA"),
    t("eCTHP / eCDFP (INE)"),
    s("cyberops-associate", "Cisco CyberOps Associate"),
  ],
};

const data = {
  title: roadmap.title,
  role: roadmap.role,
  description: roadmap.description,
  domain: roadmap.domain,
  estMonths: roadmap.estMonths,
  estCostEUR: roadmap.estCostEUR,
  difficulty: roadmap.difficulty,
  salaryRange: roadmap.salaryRange,
  steps: JSON.stringify(roadmap.steps),
};

await prisma.roadmap.upsert({
  where: { slug: roadmap.slug },
  update: data,
  create: { slug: roadmap.slug, ...data },
});
const total = await prisma.roadmap.count();
console.log(`OK: roadmap "${roadmap.title}" añadido. Total roadmaps: ${total}`);
process.exit(0);
