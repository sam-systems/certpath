import "dotenv/config";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const s = (certSlug, title) => ({ certSlug, title });
const t = (title, note) => ({ title, note });

const roadmaps = [
  {
    slug: "devops-engineer", title: "DevOps Engineer", role: "DevOps Engineer",
    description: "Automatiza el ciclo de vida del software: contenedores, IaC y CI/CD.",
    domain: "devops", estMonths: 18, estCostEUR: 900, difficulty: "alta", salaryRange: "30.000 – 55.000 €",
    steps: [s("linux-essentials", "Linux (base)"), s("docker-dca", "Docker"), s("cka", "Kubernetes (CKA)"), s("terraform-assoc", "Terraform (IaC)"), t("CI/CD (GitHub Actions / GitLab)", "Pipelines de despliegue"), s("aws-saa", "Cloud (AWS SAA)")],
  },
  {
    slug: "devsecops-engineer", title: "DevSecOps Engineer", role: "DevSecOps Engineer",
    description: "Seguridad integrada en el pipeline: shift-left, contenedores seguros.",
    domain: "devops", estMonths: 20, estCostEUR: 1200, difficulty: "muy-alta", salaryRange: "35.000 – 60.000 €",
    steps: [s("comptia-security", "Security+ (base)"), s("docker-dca", "Docker"), s("cks", "Kubernetes Security (CKS)"), s("terraform-assoc", "Terraform"), s("sc-200", "Monitorización (SC-200)")],
  },
  {
    slug: "cloud-architect", title: "Cloud Architect (Azure)", role: "Cloud Architect",
    description: "Diseña arquitecturas cloud escalables y de alta disponibilidad.",
    domain: "cloud", estMonths: 24, estCostEUR: 700, difficulty: "alta", salaryRange: "40.000 – 70.000 €",
    steps: [s("az-900", "AZ-900"), s("az-104", "AZ-104"), s("az-305", "AZ-305 (Arquitecto)"), s("terraform-assoc", "Terraform"), t("Well-Architected", "Buenas prácticas de diseño")],
  },
  {
    slug: "aws-cloud-engineer", title: "AWS Cloud Engineer", role: "AWS Cloud Engineer",
    description: "Infraestructura en AWS: cómputo, redes, automatización.",
    domain: "cloud", estMonths: 14, estCostEUR: 500, difficulty: "media", salaryRange: "30.000 – 55.000 €",
    steps: [s("aws-ccp", "Cloud Practitioner"), s("aws-saa", "Solutions Architect Associate"), s("aws-sysops", "SysOps Administrator"), s("terraform-assoc", "Terraform")],
  },
  {
    slug: "ai-engineer", title: "AI Engineer", role: "AI Engineer",
    description: "Construye soluciones con IA y LLMs sobre la nube.",
    domain: "ia", estMonths: 16, estCostEUR: 500, difficulty: "alta", salaryRange: "35.000 – 65.000 €",
    steps: [t("Python", "Lenguaje base de la IA"), s("ai-900", "AI-900 (fundamentos)"), s("ai-102", "AI-102 (Azure AI Engineer)"), s("aws-ai-practitioner", "AWS AI Practitioner"), t("LLM / RAG", "Modelos de lenguaje y recuperación")],
  },
  {
    slug: "mlops-engineer", title: "MLOps Engineer", role: "MLOps Engineer",
    description: "Lleva modelos de ML a producción de forma fiable.",
    domain: "ia", estMonths: 18, estCostEUR: 800, difficulty: "alta", salaryRange: "40.000 – 70.000 €",
    steps: [s("ai-900", "Fundamentos IA"), t("Python + MLflow", "Tracking de modelos"), s("docker-dca", "Docker"), s("cka", "Kubernetes"), s("terraform-assoc", "Terraform")],
  },
  {
    slug: "sysadmin-linux", title: "SysAdmin Linux", role: "Linux System Administrator",
    description: "Administra servidores Linux: hardening, scripting, automatización.",
    domain: "linux", estMonths: 12, estCostEUR: 600, difficulty: "media", salaryRange: "24.000 – 42.000 €",
    steps: [s("linux-essentials", "Linux Essentials"), s("lpic-1", "LPIC-1"), s("rhcsa", "RHCSA"), t("Bash scripting", "Automatización"), s("docker-dca", "Docker")],
  },
  {
    slug: "system-administrator", title: "Administrador de Sistemas", role: "System Administrator",
    description: "Gestiona sistemas, redes y servicios de una empresa.",
    domain: "soporte", estMonths: 14, estCostEUR: 900, difficulty: "media", salaryRange: "22.000 – 38.000 €",
    steps: [s("comptia-aplus", "CompTIA A+"), s("comptia-network", "Network+"), s("rhcsa", "RHCSA (Linux)"), s("az-104", "AZ-104 (Windows/Cloud)")],
  },
  {
    slug: "threat-hunter", title: "Threat Hunter", role: "Threat Hunter",
    description: "Caza amenazas de forma proactiva antes de que actúen.",
    domain: "ciberseguridad", estMonths: 18, estCostEUR: 1200, difficulty: "alta", salaryRange: "32.000 – 55.000 €",
    steps: [s("comptia-security", "Security+"), s("comptia-cysa", "CySA+"), s("sc-200", "SC-200 (Sentinel)"), s("htb-cdsa", "HTB CDSA"), t("Threat Intelligence", "CTI y TTPs (MITRE ATT&CK)")],
  },
  {
    slug: "malware-analyst", title: "Malware Analyst", role: "Malware Analyst",
    description: "Analiza malware para entender y neutralizar amenazas.",
    domain: "ciberseguridad", estMonths: 20, estCostEUR: 1300, difficulty: "muy-alta", salaryRange: "35.000 – 60.000 €",
    steps: [s("comptia-security", "Security+"), s("htb-cdsa", "HTB CDSA"), s("chfi", "CHFI (forense)"), t("Reversing (Ghidra/IDA)", "Ingeniería inversa")],
  },
  {
    slug: "iam-engineer", title: "IAM Engineer", role: "IAM Engineer",
    description: "Gestión de identidades, accesos y federación.",
    domain: "ciberseguridad", estMonths: 16, estCostEUR: 1000, difficulty: "alta", salaryRange: "32.000 – 55.000 €",
    steps: [s("sc-300", "SC-300 (Identity)"), s("az-500", "AZ-500"), t("OAuth2 / OIDC / SAML", "Protocolos de identidad"), s("isc2-ccsp", "CCSP")],
  },
  {
    slug: "security-engineer", title: "Security Engineer", role: "Security Engineer",
    description: "Diseña e implementa defensas en toda la infraestructura.",
    domain: "ciberseguridad", estMonths: 24, estCostEUR: 1500, difficulty: "alta", salaryRange: "35.000 – 65.000 €",
    steps: [s("comptia-security", "Security+"), s("az-500", "AZ-500"), s("aws-security", "AWS Security Specialty"), s("isc2-cissp", "CISSP")],
  },
  {
    slug: "cloud-security-engineer", title: "Cloud Security Engineer", role: "Cloud Security Engineer",
    description: "Seguridad específica de entornos cloud (Azure/AWS).",
    domain: "ciberseguridad", estMonths: 20, estCostEUR: 1400, difficulty: "alta", salaryRange: "38.000 – 68.000 €",
    steps: [s("sc-900", "SC-900"), s("az-500", "AZ-500"), s("aws-security", "AWS Security Specialty"), s("cks", "Kubernetes Security"), s("isc2-ccsp", "CCSP")],
  },
  {
    slug: "data-engineer", title: "Data Engineer", role: "Data Engineer",
    description: "Construye pipelines de datos a escala.",
    domain: "ia", estMonths: 16, estCostEUR: 600, difficulty: "alta", salaryRange: "32.000 – 60.000 €",
    steps: [s("dp-900", "DP-900 (Data Fundamentals)"), t("SQL", "Consultas y modelado"), t("Python", "ETL/ELT"), t("Spark / Databricks", "Big Data"), s("az-104", "Cloud (AZ-104)")],
  },
];

let n = 0;
for (const r of roadmaps) {
  const data = {
    title: r.title, role: r.role, description: r.description, domain: r.domain,
    estMonths: r.estMonths, estCostEUR: r.estCostEUR, difficulty: r.difficulty,
    salaryRange: r.salaryRange, steps: JSON.stringify(r.steps),
  };
  await prisma.roadmap.upsert({ where: { slug: r.slug }, update: data, create: { slug: r.slug, ...data } });
  n++;
}
console.log("Roadmaps añadidos/actualizados:", n);
await prisma.$disconnect();
