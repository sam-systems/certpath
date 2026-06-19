// Carga masiva de todas las certificaciones/cursos REALES mencionados en el chat.
// Uso: node scripts/import-all.mjs   (la API debe estar corriendo en :4000)
const TOKEN = "certpath-admin-2026";

const c = (name, vendor, domain, level, cost, url, priceEUR, skills) => ({
  name, vendor, domain, level, cost, url, priceEUR, skills,
});

const items = [
  // ── MICROSOFT (Azure / Security / Data / Power / 365) ──
  c("Azure Network Engineer Associate (AZ-700)", "Microsoft", "redes", "associate", "pago", "https://learn.microsoft.com/credentials/certifications/azure-network-engineer-associate/", 165),
  c("Windows Server Hybrid Administrator Advanced (AZ-801)", "Microsoft", "linux", "associate", "pago", "https://learn.microsoft.com/credentials/certifications/", 165),
  c("Cybersecurity Architect Expert (SC-100)", "Microsoft", "ciberseguridad", "expert", "pago", "https://learn.microsoft.com/credentials/certifications/cybersecurity-architect-expert/", 165),
  c("Information Protection Administrator (SC-400)", "Microsoft", "ciberseguridad", "associate", "pago", "https://learn.microsoft.com/credentials/certifications/", 165),
  c("Azure Data Engineer Associate (DP-203)", "Microsoft", "ia", "associate", "pago", "https://learn.microsoft.com/credentials/certifications/azure-data-engineer/", 165),
  c("Azure Database Administrator Associate (DP-300)", "Microsoft", "ia", "associate", "pago", "https://learn.microsoft.com/credentials/certifications/azure-database-administrator-associate/", 165),
  c("Power Platform Fundamentals (PL-900)", "Microsoft", "ia", "fundamentos", "pago", "https://learn.microsoft.com/credentials/certifications/power-platform-fundamentals/", 99),
  c("Power BI Data Analyst Associate (PL-300)", "Microsoft", "ia", "associate", "pago", "https://learn.microsoft.com/credentials/certifications/power-bi-data-analyst-associate/", 165),
  c("Microsoft 365 Fundamentals (MS-900)", "Microsoft", "soporte", "fundamentos", "pago", "https://learn.microsoft.com/credentials/certifications/microsoft-365-fundamentals/", 99),
  c("Endpoint Administrator Associate (MD-102)", "Microsoft", "soporte", "associate", "pago", "https://learn.microsoft.com/credentials/certifications/", 165),

  // ── AWS ──
  c("AWS Certified Data Engineer Associate", "AWS", "ia", "associate", "pago", "https://aws.amazon.com/certification/", 145),
  c("AWS Certified Machine Learning Engineer Associate", "AWS", "ia", "associate", "pago", "https://aws.amazon.com/certification/", 145),
  c("AWS Certified Machine Learning Specialty", "AWS", "ia", "specialty", "pago", "https://aws.amazon.com/certification/", 290),
  c("AWS Certified Database Specialty", "AWS", "ia", "specialty", "pago", "https://aws.amazon.com/certification/", 290),
  c("AWS Certified DevOps Engineer Professional", "AWS", "devops", "professional", "pago", "https://aws.amazon.com/certification/", 290),
  c("AWS Certified SAP on AWS Specialty", "AWS", "cloud", "specialty", "pago", "https://aws.amazon.com/certification/", 290),

  // ── GOOGLE CLOUD ──
  c("Google Cloud Professional Cloud Developer", "Google Cloud", "cloud", "professional", "pago", "https://cloud.google.com/learn/certification", 185),
  c("Google Cloud Professional Data Engineer", "Google Cloud", "ia", "professional", "pago", "https://cloud.google.com/learn/certification/data-engineer", 185),
  c("Google Cloud Professional Network Engineer", "Google Cloud", "redes", "professional", "pago", "https://cloud.google.com/learn/certification/cloud-network-engineer", 185),
  c("Google Cloud Professional ML Engineer", "Google Cloud", "ia", "professional", "pago", "https://cloud.google.com/learn/certification/machine-learning-engineer", 185),
  c("Google Cloud Professional DevOps Engineer", "Google Cloud", "devops", "professional", "pago", "https://cloud.google.com/learn/certification/cloud-devops-engineer", 185),

  // ── CISCO ──
  c("Cisco DevNet Associate", "Cisco", "devops", "associate", "pago", "https://www.cisco.com/site/us/en/learn/training-certifications/certifications/devnet/", 300),
  c("CCNP Data Center", "Cisco", "redes", "professional", "pago", "https://www.cisco.com/site/us/en/learn/training-certifications/certifications/", 600),
  c("CCNP Service Provider", "Cisco", "redes", "professional", "pago", "https://www.cisco.com/site/us/en/learn/training-certifications/certifications/", 600),
  c("CCIE Security", "Cisco", "ciberseguridad", "expert", "pago", "https://www.cisco.com/site/us/en/learn/training-certifications/certifications/", 1500),
  c("CCDE (Design Expert)", "Cisco", "redes", "expert", "pago", "https://www.cisco.com/site/us/en/learn/training-certifications/certifications/", 1500),
  c("Cisco CyberOps Professional", "Cisco", "ciberseguridad", "professional", "pago", "https://www.cisco.com/site/us/en/learn/training-certifications/certifications/", 600),

  // ── COMPTIA ──
  c("CompTIA Tech+ (ITF+)", "CompTIA", "soporte", "fundamentos", "pago", "https://www.comptia.org/certifications/tech", 130),
  c("CompTIA SecurityX (CASP+)", "CompTIA", "ciberseguridad", "expert", "pago", "https://www.comptia.org/certifications/securityx", 520),
  c("CompTIA Cloud+", "CompTIA", "cloud", "professional", "pago", "https://www.comptia.org/certifications/cloud", 380),
  c("CompTIA Server+", "CompTIA", "linux", "associate", "pago", "https://www.comptia.org/certifications/server", 380),
  c("CompTIA Data+", "CompTIA", "ia", "associate", "pago", "https://www.comptia.org/certifications/data", 280),

  // ── ISC2 ──
  c("ISC2 CSSLP", "ISC2", "ciberseguridad", "expert", "pago", "https://www.isc2.org/certifications/csslp", 600),
  c("ISC2 CGRC", "ISC2", "grc", "professional", "pago", "https://www.isc2.org/certifications/cgrc", 600),

  // ── OFFSEC ──
  c("OSED", "OffSec", "ciberseguridad", "expert", "pago", "https://www.offsec.com/courses/exp-301/", 1600),
  c("OSWP", "OffSec", "ciberseguridad", "professional", "pago", "https://www.offsec.com/courses/pen-210/", 800),

  // ── INE / TCM (entrada pentest) ──
  c("eJPT (Junior Penetration Tester)", "INE", "ciberseguridad", "associate", "pago", "https://security.ine.com/certifications/ejpt-certification/", 200),
  c("eCPPT", "INE", "ciberseguridad", "professional", "pago", "https://security.ine.com/certifications/", 400),
  c("PNPT", "TCM Security", "ciberseguridad", "professional", "pago", "https://certifications.tcm-sec.com/pnpt/", 450),

  // ── GIAC (SANS) ──
  c("GIAC GSEC", "GIAC", "ciberseguridad", "associate", "pago", "https://www.giac.org/certifications/security-essentials-gsec/", 950),
  c("GIAC GCIA", "GIAC", "ciberseguridad", "professional", "pago", "https://www.giac.org/certifications/certified-intrusion-analyst-gcia/", 950),
  c("GIAC GCIH", "GIAC", "ciberseguridad", "professional", "pago", "https://www.giac.org/certifications/certified-incident-handler-gcih/", 950),
  c("GIAC GPEN", "GIAC", "ciberseguridad", "professional", "pago", "https://www.giac.org/certifications/penetration-tester-gpen/", 950),
  c("GIAC GXPN", "GIAC", "ciberseguridad", "expert", "pago", "https://www.giac.org/certifications/", 950),
  c("GIAC GCFA (Forensic Analyst)", "GIAC", "ciberseguridad", "professional", "pago", "https://www.giac.org/certifications/certified-forensic-analyst-gcfa/", 950),
  c("GIAC GNFA (Network Forensics)", "GIAC", "ciberseguridad", "professional", "pago", "https://www.giac.org/certifications/", 950),
  c("GIAC GREM (Reverse Malware)", "GIAC", "ciberseguridad", "expert", "pago", "https://www.giac.org/certifications/", 950),
  c("GIAC GCTI (Threat Intelligence)", "GIAC", "ciberseguridad", "professional", "pago", "https://www.giac.org/certifications/", 950),

  // ── ISACA ──
  c("ISACA CRISC", "ISACA", "grc", "expert", "pago", "https://www.isaca.org/credentialing/crisc", 700),
  c("ISACA CGEIT", "ISACA", "grc", "expert", "pago", "https://www.isaca.org/credentialing/cgeit", 700),
  c("ISACA CDPSE", "ISACA", "grc", "professional", "pago", "https://www.isaca.org/credentialing/cdpse", 700),

  // ── LINUX ──
  c("Linux Essentials", "LPI", "linux", "fundamentos", "pago", "https://www.lpi.org/our-certifications/linux-essentials-overview/", 110),
  c("LPIC-2", "LPI", "linux", "professional", "pago", "https://www.lpi.org/our-certifications/lpic-2-overview/", 380),
  c("LPIC-3 Security", "LPI", "linux", "expert", "pago", "https://www.lpi.org/our-certifications/lpic-3-overview/", 400),
  c("Red Hat Certified Architect (RHCA)", "Red Hat", "linux", "expert", "pago", "https://www.redhat.com/en/services/certification/rhca", 460),
  c("Linux Foundation LFCA", "Linux Foundation", "linux", "fundamentos", "pago", "https://training.linuxfoundation.org/certification/", 250),
  c("Linux Foundation LFCS", "Linux Foundation", "linux", "associate", "pago", "https://training.linuxfoundation.org/certification/linux-foundation-certified-sysadmin-lfcs/", 395),
  c("Linux Foundation LFCE", "Linux Foundation", "linux", "professional", "pago", "https://training.linuxfoundation.org/certification/", 395),

  // ── DEVOPS / CONTENEDORES ──
  c("Certified Kubernetes Application Developer (CKAD)", "CNCF", "devops", "professional", "pago", "https://www.cncf.io/training/certification/ckad/", 395),
  c("Certified Kubernetes Security Specialist (CKS)", "CNCF", "devops", "expert", "pago", "https://www.cncf.io/training/certification/cks/", 395),
  c("KCNA (Kubernetes and Cloud Native Associate)", "CNCF", "devops", "fundamentos", "pago", "https://www.cncf.io/training/certification/kcna/", 250),
  c("Red Hat Certified OpenShift Administrator", "Red Hat", "devops", "professional", "pago", "https://www.redhat.com/en/services/certification/", 460),
  c("GitLab Certified CI/CD Associate", "GitLab", "devops", "associate", "pago", "https://about.gitlab.com/services/education/", 0),
  c("FinOps Certified Practitioner", "FinOps Foundation", "devops", "fundamentos", "pago", "https://www.finops.org/certifications/", 300),
  c("DevSecOps Foundation", "DevOps Institute", "devops", "fundamentos", "pago", "https://www.devopsinstitute.com/certifications/", 500),
  c("SRE Foundation", "DevOps Institute", "devops", "fundamentos", "pago", "https://www.devopsinstitute.com/certifications/", 500),

  // ── IA / ML (reales) ──
  c("TensorFlow Developer Certificate", "Google", "ia", "associate", "pago", "https://www.tensorflow.org/certificate", 100),
  c("Databricks Certified ML Associate", "Databricks", "ia", "associate", "pago", "https://www.databricks.com/learn/certification", 200),
  c("Databricks Certified ML Professional", "Databricks", "ia", "professional", "pago", "https://www.databricks.com/learn/certification", 200),
  c("NVIDIA Certified Generative AI", "NVIDIA", "ia", "associate", "pago", "https://www.nvidia.com/en-us/learn/certification/", 135),
  c("IBM AI Engineering Professional", "IBM", "ia", "professional", "pago", "https://www.ibm.com/training/", 0),

  // ── VIRTUALIZACIÓN ──
  c("VMware VCP (Certified Professional)", "VMware", "linux", "professional", "pago", "https://www.vmware.com/learning/certification.html", 250),
  c("VMware VCAP (Advanced Professional)", "VMware", "linux", "expert", "pago", "https://www.vmware.com/learning/certification.html", 450),
  c("VMware NSX", "VMware", "redes", "professional", "pago", "https://www.vmware.com/learning/certification.html", 250),
  c("Nutanix NCP (Certified Professional)", "Nutanix", "linux", "professional", "pago", "https://www.nutanix.com/products/nutanix-university", 199),
  c("Citrix CCA-V", "Citrix", "linux", "associate", "pago", "https://www.citrix.com/training/", 200),

  // ── BASES DE DATOS / DATA ──
  c("Oracle Database Administrator Associate", "Oracle", "ia", "associate", "pago", "https://education.oracle.com/certification", 245),
  c("MongoDB Associate Developer", "MongoDB", "ia", "associate", "pago", "https://learn.mongodb.com/pages/certification", 150),
  c("Snowflake SnowPro Core", "Snowflake", "ia", "associate", "pago", "https://www.snowflake.com/certifications/", 175),
  c("PostgreSQL Associate Certification", "EDB", "ia", "associate", "pago", "https://www.enterprisedb.com/", 200),

  // ── GOBIERNO / GESTIÓN / COMPLIANCE ──
  c("ITIL 4 Foundation", "PeopleCert", "grc", "fundamentos", "pago", "https://www.peoplecert.org/browse-certifications/itil", 350),
  c("PMP (Project Management Professional)", "PMI", "grc", "professional", "pago", "https://www.pmi.org/certifications/project-management-pmp", 550),
  c("PRINCE2 Foundation", "PeopleCert", "grc", "fundamentos", "pago", "https://www.peoplecert.org/browse-certifications/prince2", 400),
  c("Professional Scrum Master I (PSM I)", "Scrum.org", "grc", "associate", "pago", "https://www.scrum.org/professional-scrum-certifications", 200),
  c("COBIT 2019 Foundation", "ISACA", "grc", "fundamentos", "pago", "https://www.isaca.org/credentialing/cobit", 250),
  c("ISO 27001 Lead Implementer", "PECB", "grc", "professional", "pago", "https://pecb.com/en/education-and-certification-for-individuals/iso-iec-27001", 1000),
  c("ISO 22301 Lead Implementer (Continuidad)", "PECB", "grc", "professional", "pago", "https://pecb.com/", 1000),
  c("Lean Six Sigma Green Belt", "IASSC", "grc", "associate", "pago", "https://www.iassc.org/", 295),
  c("DPO / Delegado de Protección de Datos", "AEPD/ENAC", "grc", "professional", "pago", "https://www.aepd.es/", 1000),

  // ── ESPAÑA: CNI / CCN-CERT / ENS / STIC (formación pública) ──
  c("Esquema Nacional de Seguridad (ENS)", "CCN (CNI)", "grc", "professional", "gratis", "https://www.ccn-cert.cni.es/", 0, ["ENS", "Cumplimiento", "Sector público"]),
  c("Formación CCN-CERT (Plataforma ÁNGELES)", "CCN-CERT (CNI)", "ciberseguridad", "professional", "gratis", "https://angeles.ccn-cert.cni.es/", 0, ["DFIR", "ENS", "Gestión de incidentes"]),
  c("Curso STIC — Cibervigilancia", "CCN (CNI)", "ciberseguridad", "professional", "gratis", "https://www.ccn-cert.cni.es/", 0, ["Threat Intelligence", "Cibervigilancia"]),
  c("Curso STIC — Análisis de Memoria", "CCN (CNI)", "ciberseguridad", "professional", "gratis", "https://www.ccn-cert.cni.es/", 0, ["Forense", "Memoria"]),
  c("Curso STIC — Desarrollo Seguro", "CCN (CNI)", "ciberseguridad", "professional", "gratis", "https://www.ccn-cert.cni.es/", 0, ["Desarrollo seguro", "OWASP"]),
  c("Guías CCN-STIC", "CCN (CNI)", "grc", "professional", "gratis", "https://www.ccn-cert.cni.es/guias.html", 0, ["Hardening", "Normativa"]),
  c("Curso básico técnico de ciberseguridad", "INCIBE", "ciberseguridad", "fundamentos", "gratis", "https://www.incibe.es/", 0, ["Fundamentos", "Redes"]),

  // ── CURSO DE ESPECIALIZACIÓN (FP oficial) ──
  c("Curso de Especialización en Ciberseguridad (FP)", "Ministerio de Educación FP", "ciberseguridad", "professional", "gratis", "https://www.todofp.es/", 0, ["Título oficial", "Ciberseguridad"]),
];

const res = await fetch("http://127.0.0.1:4000/api/certifications/import", {
  method: "POST",
  headers: { "Content-Type": "application/json", "x-import-token": TOKEN },
  body: JSON.stringify({ items }),
});
const data = await res.json();
console.log("Enviadas:", items.length);
console.log("Resultado:", JSON.stringify(data));
