import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const categories = [
  { name: "Cloud", domain: "cloud" },
  { name: "Ciberseguridad", domain: "ciberseguridad" },
  { name: "Redes", domain: "redes" },
  { name: "Linux & Sistemas", domain: "linux" },
  { name: "DevOps", domain: "devops" },
  { name: "Soporte", domain: "soporte" },
  { name: "IA & Datos", domain: "ia" },
  { name: "GRC", domain: "grc" },
];

type Cert = {
  slug: string;
  name: string;
  vendor: string;
  cat: string;
  code?: string;
  level: string;
  cost: string;
  priceEUR?: number;
  url: string;
  prepHours?: number;
  validityYears?: number | null;
  demand: string;
  skills: string[];
};

const certs: Cert[] = [
  // ── Microsoft ──
  { slug: "az-900", name: "Azure Fundamentals", vendor: "Microsoft", cat: "Cloud", code: "AZ-900", level: "fundamentos", cost: "pago", priceEUR: 99, url: "https://learn.microsoft.com/credentials/certifications/azure-fundamentals/", prepHours: 25, validityYears: null, demand: "alta", skills: ["Azure", "Cloud básico"] },
  { slug: "az-104", name: "Azure Administrator", vendor: "Microsoft", cat: "Cloud", code: "AZ-104", level: "associate", cost: "pago", priceEUR: 165, url: "https://learn.microsoft.com/credentials/certifications/azure-administrator/", prepHours: 100, validityYears: 1, demand: "muy-alta", skills: ["Administración Azure", "Redes cloud", "Identidad"] },
  { slug: "az-305", name: "Azure Solutions Architect Expert", vendor: "Microsoft", cat: "Cloud", code: "AZ-305", level: "expert", cost: "pago", priceEUR: 165, url: "https://learn.microsoft.com/credentials/certifications/azure-solutions-architect/", prepHours: 150, validityYears: 1, demand: "alta", skills: ["Arquitectura Azure", "Diseño"] },
  { slug: "az-500", name: "Azure Security Engineer", vendor: "Microsoft", cat: "Ciberseguridad", code: "AZ-500", level: "associate", cost: "pago", priceEUR: 165, url: "https://learn.microsoft.com/credentials/certifications/azure-security-engineer/", prepHours: 120, validityYears: 1, demand: "alta", skills: ["Seguridad Azure", "IAM", "Protección"] },
  { slug: "sc-900", name: "Security, Compliance & Identity Fundamentals", vendor: "Microsoft", cat: "Ciberseguridad", code: "SC-900", level: "fundamentos", cost: "pago", priceEUR: 99, url: "https://learn.microsoft.com/credentials/certifications/security-compliance-and-identity-fundamentals/", prepHours: 25, validityYears: null, demand: "alta", skills: ["Seguridad", "Identidad", "Cumplimiento"] },
  { slug: "sc-200", name: "Security Operations Analyst", vendor: "Microsoft", cat: "Ciberseguridad", code: "SC-200", level: "associate", cost: "pago", priceEUR: 165, url: "https://learn.microsoft.com/credentials/certifications/security-operations-analyst/", prepHours: 80, validityYears: 1, demand: "alta", skills: ["Sentinel", "Defender", "SOC"] },
  { slug: "sc-300", name: "Identity and Access Administrator", vendor: "Microsoft", cat: "Ciberseguridad", code: "SC-300", level: "associate", cost: "pago", priceEUR: 165, url: "https://learn.microsoft.com/credentials/certifications/identity-and-access-administrator/", prepHours: 80, validityYears: 1, demand: "alta", skills: ["Entra ID", "IAM"] },
  { slug: "ai-900", name: "Azure AI Fundamentals", vendor: "Microsoft", cat: "IA & Datos", code: "AI-900", level: "fundamentos", cost: "pago", priceEUR: 99, url: "https://learn.microsoft.com/credentials/certifications/azure-ai-fundamentals/", prepHours: 20, validityYears: null, demand: "alta", skills: ["IA", "Machine Learning básico"] },
  { slug: "ai-102", name: "Azure AI Engineer", vendor: "Microsoft", cat: "IA & Datos", code: "AI-102", level: "associate", cost: "pago", priceEUR: 165, url: "https://learn.microsoft.com/credentials/certifications/azure-ai-engineer/", prepHours: 100, validityYears: 1, demand: "alta", skills: ["Azure AI", "LLM", "Cognitive Services"] },
  { slug: "dp-900", name: "Azure Data Fundamentals", vendor: "Microsoft", cat: "IA & Datos", code: "DP-900", level: "fundamentos", cost: "pago", priceEUR: 99, url: "https://learn.microsoft.com/credentials/certifications/azure-data-fundamentals/", prepHours: 20, validityYears: null, demand: "media", skills: ["Datos", "SQL", "Azure Data"] },

  // ── AWS ──
  { slug: "aws-ccp", name: "Cloud Practitioner", vendor: "AWS", cat: "Cloud", level: "fundamentos", cost: "pago", priceEUR: 95, url: "https://aws.amazon.com/certification/certified-cloud-practitioner/", prepHours: 30, validityYears: 3, demand: "alta", skills: ["AWS", "Cloud básico"] },
  { slug: "aws-saa", name: "Solutions Architect Associate", vendor: "AWS", cat: "Cloud", level: "associate", cost: "pago", priceEUR: 145, url: "https://aws.amazon.com/certification/certified-solutions-architect-associate/", prepHours: 120, validityYears: 3, demand: "muy-alta", skills: ["Arquitectura AWS", "Alta disponibilidad"] },
  { slug: "aws-sysops", name: "SysOps Administrator", vendor: "AWS", cat: "Cloud", level: "associate", cost: "pago", priceEUR: 145, url: "https://aws.amazon.com/certification/certified-sysops-admin-associate/", prepHours: 120, validityYears: 3, demand: "alta", skills: ["Operaciones AWS", "Monitorización"] },
  { slug: "aws-developer", name: "Developer Associate", vendor: "AWS", cat: "Cloud", level: "associate", cost: "pago", priceEUR: 145, url: "https://aws.amazon.com/certification/certified-developer-associate/", prepHours: 120, validityYears: 3, demand: "alta", skills: ["Desarrollo AWS", "Serverless"] },
  { slug: "aws-security", name: "Security Specialty", vendor: "AWS", cat: "Ciberseguridad", level: "specialty", cost: "pago", priceEUR: 290, url: "https://aws.amazon.com/certification/certified-security-specialty/", prepHours: 150, validityYears: 3, demand: "alta", skills: ["Seguridad AWS", "IAM", "Cifrado"] },
  { slug: "aws-sap", name: "Solutions Architect Professional", vendor: "AWS", cat: "Cloud", level: "professional", cost: "pago", priceEUR: 290, url: "https://aws.amazon.com/certification/certified-solutions-architect-professional/", prepHours: 200, validityYears: 3, demand: "alta", skills: ["Arquitectura avanzada AWS"] },
  { slug: "aws-ans", name: "Advanced Networking Specialty", vendor: "AWS", cat: "Redes", level: "specialty", cost: "pago", priceEUR: 290, url: "https://aws.amazon.com/certification/certified-advanced-networking-specialty/", prepHours: 160, validityYears: 3, demand: "alta", skills: ["Redes AWS", "Híbrido"] },

  // ── Google Cloud ──
  { slug: "gcp-ace", name: "Associate Cloud Engineer", vendor: "Google Cloud", cat: "Cloud", level: "associate", cost: "pago", priceEUR: 115, url: "https://cloud.google.com/learn/certification/cloud-engineer", prepHours: 100, validityYears: 3, demand: "alta", skills: ["GCP", "Compute", "Networking"] },
  { slug: "gcp-pca", name: "Professional Cloud Architect", vendor: "Google Cloud", cat: "Cloud", level: "professional", cost: "pago", priceEUR: 185, url: "https://cloud.google.com/learn/certification/cloud-architect", prepHours: 150, validityYears: 2, demand: "alta", skills: ["Arquitectura GCP"] },
  { slug: "gcp-security", name: "Professional Cloud Security Engineer", vendor: "Google Cloud", cat: "Ciberseguridad", level: "professional", cost: "pago", priceEUR: 185, url: "https://cloud.google.com/learn/certification/cloud-security-engineer", prepHours: 140, validityYears: 2, demand: "alta", skills: ["Seguridad GCP", "IAM"] },

  // ── Cisco ──
  { slug: "ccst-net", name: "CCST Networking", vendor: "Cisco", cat: "Redes", level: "fundamentos", cost: "pago", priceEUR: 115, url: "https://www.cisco.com/site/us/en/learn/training-certifications/certifications/ccst/networking.html", prepHours: 60, validityYears: null, demand: "media", skills: ["Redes básicas", "IP"] },
  { slug: "ccna", name: "CCNA", vendor: "Cisco", cat: "Redes", code: "200-301", level: "associate", cost: "pago", priceEUR: 300, url: "https://www.cisco.com/site/us/en/learn/training-certifications/certifications/enterprise/ccna/index.html", prepHours: 180, validityYears: 3, demand: "muy-alta", skills: ["Routing", "Switching", "Seguridad de red"] },
  { slug: "cisco-cyberops", name: "CyberOps Associate", vendor: "Cisco", cat: "Ciberseguridad", level: "associate", cost: "pago", priceEUR: 300, url: "https://www.cisco.com/site/us/en/learn/training-certifications/certifications/cyberops/cyberops-associate/index.html", prepHours: 120, validityYears: 3, demand: "alta", skills: ["SOC", "Monitorización", "Respuesta"] },
  { slug: "ccnp-ent", name: "CCNP Enterprise", vendor: "Cisco", cat: "Redes", level: "professional", cost: "pago", priceEUR: 600, url: "https://www.cisco.com/site/us/en/learn/training-certifications/certifications/enterprise/ccnp-enterprise/index.html", prepHours: 300, validityYears: 3, demand: "alta", skills: ["Redes empresariales", "SD-WAN"] },
  { slug: "ccnp-sec", name: "CCNP Security", vendor: "Cisco", cat: "Ciberseguridad", level: "professional", cost: "pago", priceEUR: 600, url: "https://www.cisco.com/site/us/en/learn/training-certifications/certifications/security/ccnp-security/index.html", prepHours: 300, validityYears: 3, demand: "alta", skills: ["Firewalls", "VPN", "Seguridad de red"] },
  { slug: "ccie-ent", name: "CCIE Enterprise Infrastructure", vendor: "Cisco", cat: "Redes", level: "expert", cost: "pago", priceEUR: 1500, url: "https://www.cisco.com/site/us/en/learn/training-certifications/certifications/enterprise/ccie-enterprise-infrastructure/index.html", prepHours: 1000, validityYears: 3, demand: "alta", skills: ["Experto en redes"] },

  // ── CompTIA ──
  { slug: "comptia-aplus", name: "CompTIA A+", vendor: "CompTIA", cat: "Soporte", level: "fundamentos", cost: "pago", priceEUR: 480, url: "https://www.comptia.org/certifications/a", prepHours: 120, validityYears: 3, demand: "alta", skills: ["Soporte", "Hardware", "SO"] },
  { slug: "comptia-network", name: "CompTIA Network+", vendor: "CompTIA", cat: "Redes", level: "associate", cost: "pago", priceEUR: 360, url: "https://www.comptia.org/certifications/network", prepHours: 120, validityYears: 3, demand: "alta", skills: ["Routing", "Switching", "Protocolos"] },
  { slug: "comptia-security", name: "CompTIA Security+", vendor: "CompTIA", cat: "Ciberseguridad", code: "SY0-701", level: "associate", cost: "pago", priceEUR: 400, url: "https://www.comptia.org/certifications/security", prepHours: 120, validityYears: 3, demand: "muy-alta", skills: ["Seguridad", "Criptografía", "Riesgos"] },
  { slug: "comptia-cysa", name: "CompTIA CySA+", vendor: "CompTIA", cat: "Ciberseguridad", level: "professional", cost: "pago", priceEUR: 420, url: "https://www.comptia.org/certifications/cybersecurity-analyst", prepHours: 150, validityYears: 3, demand: "alta", skills: ["Análisis SOC", "Detección"] },
  { slug: "comptia-pentest", name: "CompTIA PenTest+", vendor: "CompTIA", cat: "Ciberseguridad", level: "professional", cost: "pago", priceEUR: 420, url: "https://www.comptia.org/certifications/pentest", prepHours: 150, validityYears: 3, demand: "alta", skills: ["Pentesting", "Explotación"] },

  // ── ISC2 ──
  { slug: "isc2-cc", name: "Certified in Cybersecurity (CC)", vendor: "ISC2", cat: "Ciberseguridad", level: "fundamentos", cost: "pago", priceEUR: 190, url: "https://www.isc2.org/certifications/cc", prepHours: 40, validityYears: 3, demand: "alta", skills: ["Principios de seguridad", "Redes"] },
  { slug: "isc2-sscp", name: "SSCP", vendor: "ISC2", cat: "Ciberseguridad", level: "associate", cost: "pago", priceEUR: 250, url: "https://www.isc2.org/certifications/sscp", prepHours: 120, validityYears: 3, demand: "media", skills: ["Operaciones de seguridad"] },
  { slug: "isc2-cissp", name: "CISSP", vendor: "ISC2", cat: "GRC", level: "expert", cost: "pago", priceEUR: 700, url: "https://www.isc2.org/certifications/cissp", prepHours: 300, validityYears: 3, demand: "muy-alta", skills: ["Arquitectura de seguridad", "Gestión"] },
  { slug: "isc2-ccsp", name: "CCSP", vendor: "ISC2", cat: "Cloud", level: "expert", cost: "pago", priceEUR: 600, url: "https://www.isc2.org/certifications/ccsp", prepHours: 200, validityYears: 3, demand: "alta", skills: ["Seguridad cloud", "Arquitectura"] },

  // ── OffSec ──
  { slug: "oscp", name: "OSCP", vendor: "OffSec", cat: "Ciberseguridad", level: "professional", cost: "pago", priceEUR: 1500, url: "https://www.offsec.com/courses/pen-200/", prepHours: 500, validityYears: null, demand: "muy-alta", skills: ["Pentesting práctico", "Active Directory"] },
  { slug: "osep", name: "OSEP", vendor: "OffSec", cat: "Ciberseguridad", level: "expert", cost: "pago", priceEUR: 1600, url: "https://www.offsec.com/courses/pen-300/", prepHours: 400, validityYears: null, demand: "alta", skills: ["Evasión", "Pentesting avanzado"] },
  { slug: "oswe", name: "OSWE", vendor: "OffSec", cat: "Ciberseguridad", level: "expert", cost: "pago", priceEUR: 1600, url: "https://www.offsec.com/courses/web-300/", prepHours: 400, validityYears: null, demand: "alta", skills: ["Web exploitation", "Código"] },

  // ── Hack The Box ──
  { slug: "htb-cpts", name: "Certified Penetration Testing Specialist", vendor: "Hack The Box", cat: "Ciberseguridad", level: "professional", cost: "pago", priceEUR: 480, url: "https://academy.hackthebox.com/preview/certifications/htb-certified-penetration-testing-specialist", prepHours: 250, validityYears: null, demand: "alta", skills: ["Pentesting", "Informes"] },
  { slug: "htb-cdsa", name: "Certified Defensive Security Analyst", vendor: "Hack The Box", cat: "Ciberseguridad", level: "professional", cost: "pago", priceEUR: 480, url: "https://academy.hackthebox.com/preview/certifications/htb-certified-defensive-security-analyst", prepHours: 200, validityYears: null, demand: "alta", skills: ["SOC", "Blue Team", "DFIR"] },
  { slug: "htb-cbbh", name: "Certified Bug Bounty Hunter", vendor: "Hack The Box", cat: "Ciberseguridad", level: "professional", cost: "pago", priceEUR: 480, url: "https://academy.hackthebox.com/preview/certifications/htb-certified-bug-bounty-hunter", prepHours: 200, validityYears: null, demand: "media", skills: ["Bug bounty", "Web security"] },

  // ── EC-Council ──
  { slug: "ceh", name: "Certified Ethical Hacker (CEH)", vendor: "EC-Council", cat: "Ciberseguridad", level: "professional", cost: "pago", priceEUR: 1200, url: "https://www.eccouncil.org/train-certify/certified-ethical-hacker-ceh/", prepHours: 120, validityYears: 3, demand: "alta", skills: ["Hacking ético", "Pentesting"] },
  { slug: "chfi", name: "Computer Hacking Forensic Investigator", vendor: "EC-Council", cat: "Ciberseguridad", level: "professional", cost: "pago", priceEUR: 600, url: "https://www.eccouncil.org/train-certify/computer-hacking-forensic-investigator-chfi/", prepHours: 120, validityYears: 3, demand: "media", skills: ["Forense digital", "Evidencias"] },

  // ── Fortinet / Palo Alto ──
  { slug: "fortinet-fcp", name: "Fortinet Certified Professional", vendor: "Fortinet", cat: "Ciberseguridad", level: "professional", cost: "pago", priceEUR: 400, url: "https://training.fortinet.com/", prepHours: 120, validityYears: 2, demand: "alta", skills: ["FortiGate", "Firewalls"] },
  { slug: "pcnse", name: "Palo Alto PCNSE", vendor: "Palo Alto", cat: "Ciberseguridad", level: "professional", cost: "pago", priceEUR: 160, url: "https://www.paloaltonetworks.com/services/education/certification", prepHours: 120, validityYears: 2, demand: "alta", skills: ["Firewalls Palo Alto", "Seguridad de red"] },

  // ── Linux ──
  { slug: "linux-essentials", name: "Linux Essentials", vendor: "LPI", cat: "Linux & Sistemas", level: "fundamentos", cost: "pago", priceEUR: 110, url: "https://www.lpi.org/our-certifications/linux-essentials-overview/", prepHours: 40, validityYears: null, demand: "media", skills: ["Linux básico", "CLI"] },
  { slug: "lpic-1", name: "LPIC-1", vendor: "LPI", cat: "Linux & Sistemas", level: "associate", cost: "pago", priceEUR: 380, url: "https://www.lpi.org/our-certifications/lpic-1-overview/", prepHours: 120, validityYears: 5, demand: "media", skills: ["Administración Linux", "CLI"] },
  { slug: "rhcsa", name: "Red Hat Certified System Administrator", vendor: "Red Hat", cat: "Linux & Sistemas", code: "EX200", level: "associate", cost: "pago", priceEUR: 460, url: "https://www.redhat.com/en/services/certification/rhcsa", prepHours: 150, validityYears: 3, demand: "alta", skills: ["Administración Linux", "Hardening", "Bash"] },
  { slug: "rhce", name: "Red Hat Certified Engineer", vendor: "Red Hat", cat: "Linux & Sistemas", level: "professional", cost: "pago", priceEUR: 460, url: "https://www.redhat.com/en/services/certification/rhce", prepHours: 180, validityYears: 3, demand: "alta", skills: ["Ansible", "Automatización Linux"] },

  // ── DevOps / Kubernetes ──
  { slug: "cka", name: "Certified Kubernetes Administrator", vendor: "CNCF", cat: "DevOps", level: "professional", cost: "pago", priceEUR: 395, url: "https://www.cncf.io/training/certification/cka/", prepHours: 120, validityYears: 2, demand: "alta", skills: ["Kubernetes", "Contenedores"] },
  { slug: "ckad", name: "Certified Kubernetes Application Developer", vendor: "CNCF", cat: "DevOps", level: "professional", cost: "pago", priceEUR: 395, url: "https://www.cncf.io/training/certification/ckad/", prepHours: 100, validityYears: 2, demand: "alta", skills: ["Kubernetes", "Despliegue apps"] },
  { slug: "cks", name: "Certified Kubernetes Security Specialist", vendor: "CNCF", cat: "DevOps", level: "expert", cost: "pago", priceEUR: 395, url: "https://www.cncf.io/training/certification/cks/", prepHours: 120, validityYears: 2, demand: "alta", skills: ["Seguridad Kubernetes"] },
  { slug: "terraform-assoc", name: "Terraform Associate", vendor: "HashiCorp", cat: "DevOps", level: "associate", cost: "pago", priceEUR: 65, url: "https://www.hashicorp.com/certification/terraform-associate", prepHours: 50, validityYears: 2, demand: "alta", skills: ["IaC", "Terraform"] },
  { slug: "docker-dca", name: "Docker Certified Associate", vendor: "Docker", cat: "DevOps", level: "associate", cost: "pago", priceEUR: 180, url: "https://www.docker.com/", prepHours: 60, validityYears: 2, demand: "media", skills: ["Docker", "Contenedores"] },

  // ── GRC ──
  { slug: "isaca-cisa", name: "CISA", vendor: "ISACA", cat: "GRC", level: "expert", cost: "pago", priceEUR: 700, url: "https://www.isaca.org/credentialing/cisa", prepHours: 200, validityYears: 3, demand: "alta", skills: ["Auditoría", "Control IT"] },
  { slug: "isaca-cism", name: "CISM", vendor: "ISACA", cat: "GRC", level: "expert", cost: "pago", priceEUR: 700, url: "https://www.isaca.org/credentialing/cism", prepHours: 200, validityYears: 3, demand: "alta", skills: ["Gobierno de seguridad", "Riesgos"] },
  { slug: "iso27001-la", name: "ISO 27001 Lead Auditor", vendor: "PECB", cat: "GRC", level: "professional", cost: "pago", priceEUR: 1000, url: "https://pecb.com/en/education-and-certification-for-individuals/iso-iec-27001", prepHours: 80, validityYears: 3, demand: "alta", skills: ["ISO 27001", "Auditoría", "SGSI"] },

  // ── Nuevas (ampliación) ──
  { slug: "cisco-python-essentials", name: "Python Essentials 1", vendor: "Cisco", cat: "DevOps", level: "fundamentos", cost: "gratis", priceEUR: 0, url: "https://www.netacad.com/courses/programming/pcap-programming-essentials-python", prepHours: 30, validityYears: null, demand: "media", skills: ["Python", "Programación"] },
  { slug: "ccst-cyber", name: "CCST Cybersecurity", vendor: "Cisco", cat: "Ciberseguridad", level: "fundamentos", cost: "pago", priceEUR: 115, url: "https://www.cisco.com/site/us/en/learn/training-certifications/certifications/ccst/cybersecurity.html", prepHours: 60, validityYears: null, demand: "media", skills: ["Seguridad básica", "Amenazas"] },
  { slug: "az-800", name: "Windows Server Hybrid Administrator", vendor: "Microsoft", cat: "Linux & Sistemas", code: "AZ-800", level: "associate", cost: "pago", priceEUR: 165, url: "https://learn.microsoft.com/credentials/certifications/windows-server-hybrid-administrator/", prepHours: 100, validityYears: 1, demand: "alta", skills: ["Windows Server", "Active Directory", "Híbrido"] },
  { slug: "comptia-linux", name: "CompTIA Linux+", vendor: "CompTIA", cat: "Linux & Sistemas", level: "associate", cost: "pago", priceEUR: 380, url: "https://www.comptia.org/certifications/linux", prepHours: 120, validityYears: 3, demand: "media", skills: ["Linux", "CLI", "Administración"] },
  { slug: "gcp-cdl", name: "Cloud Digital Leader", vendor: "Google Cloud", cat: "Cloud", level: "fundamentos", cost: "pago", priceEUR: 95, url: "https://cloud.google.com/learn/certification/cloud-digital-leader", prepHours: 20, validityYears: 3, demand: "media", skills: ["GCP", "Cloud básico"] },
  { slug: "aws-ai-practitioner", name: "AWS Certified AI Practitioner", vendor: "AWS", cat: "IA & Datos", level: "fundamentos", cost: "pago", priceEUR: 95, url: "https://aws.amazon.com/certification/certified-ai-practitioner/", prepHours: 30, validityYears: 3, demand: "alta", skills: ["IA", "AWS", "ML básico"] },
];

type Step = { certSlug?: string; title: string; note?: string };
type Roadmap = {
  slug: string;
  title: string;
  role: string;
  description: string;
  domain: string;
  estMonths: number;
  estCostEUR: number;
  difficulty: string;
  salaryRange?: string;
  steps: Step[];
};

const roadmaps: Roadmap[] = [
  { slug: "soporte-tecnico", title: "Soporte Técnico", role: "IT Support Specialist", description: "Puerta de entrada al sector IT desde ASIR.", domain: "soporte", estMonths: 6, estCostEUR: 840, difficulty: "baja", salaryRange: "18.000 – 24.000 €", steps: [ { certSlug: "comptia-aplus", title: "CompTIA A+" }, { certSlug: "comptia-network", title: "Network+" }, { certSlug: "comptia-security", title: "Security+" } ] },
  { slug: "redes", title: "Redes", role: "Network Engineer", description: "Camino Cisco hacia ingeniero de redes.", domain: "redes", estMonths: 24, estCostEUR: 2400, difficulty: "alta", salaryRange: "25.000 – 45.000 €", steps: [ { certSlug: "ccna", title: "CCNA" }, { certSlug: "ccnp-ent", title: "CCNP Enterprise" }, { certSlug: "ccie-ent", title: "CCIE (élite)" } ] },
  { slug: "ciberseguridad-soc", title: "Ciberseguridad (SOC / Blue Team)", role: "SOC Analyst", description: "Defensa: detectar y responder a ataques.", domain: "ciberseguridad", estMonths: 12, estCostEUR: 1085, difficulty: "media", salaryRange: "24.000 – 40.000 €", steps: [ { certSlug: "comptia-security", title: "Security+" }, { certSlug: "sc-200", title: "SC-200 (Sentinel)" }, { certSlug: "htb-cdsa", title: "HTB CDSA" } ] },
  { slug: "cloud", title: "Cloud", role: "Cloud Engineer", description: "Infraestructura en la nube (Azure).", domain: "cloud", estMonths: 12, estCostEUR: 430, difficulty: "media", salaryRange: "28.000 – 50.000 €", steps: [ { certSlug: "az-900", title: "AZ-900" }, { certSlug: "az-104", title: "AZ-104" }, { certSlug: "az-305", title: "AZ-305" } ] },
  { slug: "pentester", title: "Ciberseguridad (Red Team)", role: "Penetration Tester", description: "Ofensivo: atacar con permiso. Camino al OSCP.", domain: "ciberseguridad", estMonths: 18, estCostEUR: 2380, difficulty: "muy-alta", salaryRange: "30.000 – 55.000 €", steps: [ { certSlug: "comptia-security", title: "Security+" }, { certSlug: "htb-cpts", title: "HTB CPTS" }, { certSlug: "oscp", title: "OSCP" } ] },
  { slug: "security-architect", title: "Arquitecto Infraestructuras + Ciber", role: "Security / Infrastructure Architect", description: "Combina redes, cloud y seguridad. Destino a 5-8 años.", domain: "grc", estMonths: 60, estCostEUR: 3300, difficulty: "muy-alta", salaryRange: "45.000 – 80.000 €+", steps: [ { certSlug: "ccna", title: "CCNA" }, { certSlug: "comptia-security", title: "Security+" }, { certSlug: "az-305", title: "AZ-305" }, { certSlug: "isc2-cissp", title: "CISSP" } ] },
  { slug: "bug-bounty-hunter", title: "Bug Bounty Hunter", role: "Bug Bounty Hunter", description: "Cazar vulnerabilidades en programas de recompensas (#bugbounty #hacking). Camino al hacking web profesional.", domain: "ciberseguridad", estMonths: 12, estCostEUR: 480, difficulty: "alta", salaryRange: "Recompensas variables · 30.000 – 55.000 € en plantilla", steps: [ { certSlug: "comptia-security", title: "Security+ (base)" }, { certSlug: "htb-cbbh", title: "HTB CBBH (Bug Bounty Hunter)" }, { certSlug: "oswe", title: "OSWE (explotación web)" } ] },
  { slug: "forense-digital", title: "Forense Digital (DFIR)", role: "DFIR Analyst", description: "Investigar incidentes y recuperar evidencias: los CSI digitales.", domain: "ciberseguridad", estMonths: 14, estCostEUR: 1100, difficulty: "alta", salaryRange: "24.000 – 55.000 €+", steps: [ { certSlug: "comptia-security", title: "Security+ (base)" }, { certSlug: "htb-cdsa", title: "HTB CDSA (analista defensivo)" }, { certSlug: "chfi", title: "CHFI (forense)" } ] },
];

async function main() {
  const catMap: Record<string, string> = {};
  for (const c of categories) {
    const row = await prisma.category.upsert({
      where: { name: c.name },
      update: { domain: c.domain },
      create: c,
    });
    catMap[c.name] = row.id;
  }

  const vendorNames = [...new Set(certs.map((c) => c.vendor))];
  const venMap: Record<string, string> = {};
  for (const name of vendorNames) {
    const row = await prisma.vendor.upsert({
      where: { name },
      update: {},
      create: { name },
    });
    venMap[name] = row.id;
  }

  for (const c of certs) {
    await prisma.certification.upsert({
      where: { slug: c.slug },
      update: {},
      create: {
        slug: c.slug,
        name: c.name,
        code: c.code ?? null,
        level: c.level,
        cost: c.cost,
        priceEUR: c.priceEUR ?? null,
        url: c.url,
        prepHours: c.prepHours ?? null,
        validityYears: c.validityYears ?? null,
        demand: c.demand,
        skills: JSON.stringify(c.skills),
        vendorId: venMap[c.vendor],
        categoryId: catMap[c.cat],
      },
    });
  }

  for (const r of roadmaps) {
    await prisma.roadmap.upsert({
      where: { slug: r.slug },
      update: {},
      create: {
        slug: r.slug,
        title: r.title,
        role: r.role,
        description: r.description,
        domain: r.domain,
        estMonths: r.estMonths,
        estCostEUR: r.estCostEUR,
        difficulty: r.difficulty,
        salaryRange: r.salaryRange ?? null,
        steps: JSON.stringify(r.steps),
      },
    });
  }

  // eslint-disable-next-line no-console
  console.log(`Seed OK: ${certs.length} certs, ${roadmaps.length} roadmaps, ${categories.length} categorías`);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    // eslint-disable-next-line no-console
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
