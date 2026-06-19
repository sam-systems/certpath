import "dotenv/config";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const sec = (title) => ({ title, section: true });
const t = (title) => ({ title });
const s = (certSlug, title) => ({ certSlug, title });

const ROADMAPS = [
  {
    slug: "redes", title: "Network Engineer (completo)", role: "Network Engineer",
    description: "Camino completo de redes: fundamentos, switching, routing, WAN, seguridad y automatización.",
    domain: "redes", estMonths: 30, estCostEUR: 1200, difficulty: "alta", salaryRange: "25.000 – 55.000 €",
    steps: [
      sec("Fundamentos"), t("Modelo OSI"), t("Modelo TCP/IP"), t("Direccionamiento IP"), t("Subnetting"), t("IPv6"), t("Ethernet y cableado"),
      sec("Dispositivos"), t("Switches"), t("Routers"), t("Firewalls"), t("Balanceadores"), t("Access Points"), t("Gateways"),
      sec("Switching"), t("VLANs"), t("Trunking 802.1Q"), t("Spanning Tree (STP)"), t("EtherChannel"), t("Port Security"), t("Inter-VLAN routing"),
      sec("Routing"), t("Routing estático"), t("OSPF"), t("EIGRP"), t("BGP"), t("Administrative Distance"), t("Redistribución"),
      sec("Servicios de red"), t("DHCP"), t("DNS"), t("NAT / PAT"), t("NTP"), t("SNMP"), t("QoS"),
      sec("WAN y moderno"), t("MPLS"), t("SD-WAN"), t("VPN IPSec"), t("Wireless"), t("SDN"),
      sec("Seguridad de red"), t("ACLs"), t("802.1X"), t("NGFW"), t("Zero Trust"), t("Segmentación"),
      sec("Automatización"), t("Python para redes"), t("Ansible"), t("NETCONF / RESTCONF"), t("Netmiko"),
      sec("Herramientas"), t("Packet Tracer / GNS3"), t("Wireshark"), t("nmap"), t("ping / traceroute"),
      sec("Certificaciones"), s("ccst-net", "CCST Networking"), s("comptia-network", "Network+"), s("ccna", "CCNA"), s("ccnp-ent", "CCNP Enterprise"), s("ccie-ent", "CCIE"), t("CCDE (diseño)"),
    ],
  },
  {
    slug: "cloud", title: "Cloud Architect (completo)", role: "Cloud Architect",
    description: "Ruta completa de cloud: cómputo, redes, almacenamiento, identidad, IaC y arquitectura.",
    domain: "cloud", estMonths: 24, estCostEUR: 900, difficulty: "alta", salaryRange: "30.000 – 70.000 €",
    steps: [
      sec("Fundamentos cloud"), t("IaaS / PaaS / SaaS"), t("Público / privado / híbrido"), t("Responsabilidad compartida"), t("Regiones y zonas"), t("Pricing y FinOps"),
      sec("Cómputo"), t("Máquinas virtuales"), t("Contenedores"), t("Serverless / Functions"), t("Auto-scaling"), t("Load balancing"),
      sec("Redes cloud"), t("VPC / VNet"), t("Subnets"), t("Security Groups / NSG"), t("VPN / ExpressRoute"), t("CDN"), t("DNS"),
      sec("Almacenamiento"), t("Object storage (S3 / Blob)"), t("Block storage"), t("File storage"), t("BBDD gestionadas"), t("Backups"),
      sec("Identidad y seguridad"), t("IAM"), t("MFA"), t("Key Management"), t("Secrets"), t("Cifrado"), t("WAF"),
      sec("IaC y automatización"), t("Terraform"), t("Bicep / CloudFormation"), t("CI/CD"), t("GitOps"),
      sec("Arquitectura"), t("Alta disponibilidad"), t("Disaster Recovery"), t("Well-Architected"), t("Microservicios"), t("Event-driven"),
      sec("Observabilidad"), t("Monitoring"), t("Logging"), t("Tracing"), t("Alertas"),
      sec("Certificaciones"), s("az-900", "AZ-900"), s("aws-ccp", "AWS Cloud Practitioner"), s("gcp-ace", "GCP ACE"), s("az-104", "AZ-104"), s("aws-saa", "AWS SAA"), s("az-305", "AZ-305"), s("terraform-assoc", "Terraform"),
    ],
  },
  {
    slug: "devops-engineer", title: "DevOps Engineer (completo)", role: "DevOps Engineer",
    description: "Ruta completa DevOps: contenedores, Kubernetes, IaC, CI/CD, observabilidad y DevSecOps.",
    domain: "devops", estMonths: 24, estCostEUR: 1000, difficulty: "alta", salaryRange: "30.000 – 60.000 €",
    steps: [
      sec("Fundamentos"), t("Linux"), t("Bash"), t("Git y GitHub"), t("Redes básicas"),
      sec("Lenguajes / Scripting"), t("Python"), t("Go"), t("YAML / JSON"),
      sec("Contenedores"), t("Docker"), t("Imágenes / Dockerfile"), t("Docker Compose"), t("Registries"),
      sec("Orquestación"), t("Kubernetes"), t("Pods / Deployments"), t("Services / Ingress"), t("Helm"), t("Operators"),
      sec("IaC"), t("Terraform"), t("Ansible"), t("Pulumi"),
      sec("CI/CD"), t("GitHub Actions"), t("GitLab CI"), t("Jenkins"), t("ArgoCD / GitOps"),
      sec("Observabilidad"), t("Prometheus"), t("Grafana"), t("Loki"), t("OpenTelemetry"),
      sec("Cloud"), t("AWS / Azure / GCP"), t("Serverless"), t("Optimización de costes"),
      sec("DevSecOps"), t("SAST / DAST"), t("Gestión de secretos"), t("Seguridad de contenedores"), t("Policy as Code"),
      sec("Certificaciones"), s("docker-dca", "Docker"), s("cka", "CKA"), s("cks", "CKS"), s("terraform-assoc", "Terraform"), s("aws-saa", "AWS SAA"),
    ],
  },
  {
    slug: "frontend", title: "Frontend Developer (completo)", role: "Frontend Developer",
    description: "Ruta completa de frontend: HTML/CSS/JS, frameworks, tooling, testing y rendimiento.",
    domain: "desarrollo", estMonths: 12, estCostEUR: 0, difficulty: "media", salaryRange: "22.000 – 45.000 €",
    steps: [
      sec("Fundamentos"), t("HTML"), t("CSS"), t("JavaScript"), t("Git y GitHub"), t("Cómo funciona internet"),
      sec("CSS avanzado"), t("Flexbox"), t("Grid"), t("Responsive design"), t("Tailwind CSS"), t("Sass"),
      sec("JavaScript"), t("ES6+"), t("DOM"), t("Async / Promises"), t("Fetch / APIs"), t("Módulos"),
      sec("Frameworks"), t("React"), t("Vue"), t("Angular"), t("Gestión de estado"),
      sec("Tooling"), t("npm / pnpm"), t("Vite / Webpack"), t("TypeScript"), t("ESLint / Prettier"),
      sec("Testing"), t("Vitest / Jest"), t("Testing Library"), t("Playwright / Cypress"),
      sec("Avanzado"), t("SSR / Next.js"), t("PWA"), t("Web Performance"), t("Accesibilidad"), t("Seguridad web"),
      sec("Despliegue"), t("Vercel / Netlify"), t("CI/CD"),
    ],
  },
  {
    slug: "backend", title: "Backend Developer (completo)", role: "Backend Developer",
    description: "Ruta completa de backend: lenguajes, BBDD, APIs, arquitectura, caching y seguridad.",
    domain: "desarrollo", estMonths: 14, estCostEUR: 0, difficulty: "media", salaryRange: "24.000 – 50.000 €",
    steps: [
      sec("Fundamentos"), t("Un lenguaje (Node / Python / Java)"), t("Git y GitHub"), t("Terminal / Linux"), t("Cómo funciona internet"),
      sec("Bases de datos"), t("SQL relacional"), t("NoSQL"), t("ORMs"), t("Indexación"), t("Transacciones"),
      sec("APIs"), t("REST"), t("GraphQL"), t("Autenticación (JWT / OAuth)"), t("Rate limiting"), t("Versionado"),
      sec("Arquitectura"), t("MVC"), t("Clean / Hexagonal"), t("Microservicios"), t("Event-driven"), t("Colas (Kafka / RabbitMQ)"),
      sec("Caching y rendimiento"), t("Redis"), t("CDN"), t("Optimización de queries"),
      sec("Testing"), t("Unitario"), t("Integración"), t("E2E"),
      sec("DevOps básico"), t("Docker"), t("CI/CD"), t("Logging / Monitoring"),
      sec("Seguridad"), t("OWASP Top 10"), t("Cifrado"), t("Secrets"), t("HTTPS / TLS"),
    ],
  },
  {
    slug: "ai-engineer", title: "AI Engineer (completo)", role: "AI Engineer",
    description: "Ruta completa de IA: ML, deep learning, LLMs/GenAI, MLOps y cloud IA.",
    domain: "ia", estMonths: 18, estCostEUR: 500, difficulty: "alta", salaryRange: "35.000 – 70.000 €",
    steps: [
      sec("Fundamentos"), t("Python"), t("Matemáticas (álgebra / estadística)"), t("Pandas / NumPy"), t("Jupyter"),
      sec("Machine Learning"), t("Aprendizaje supervisado"), t("No supervisado"), t("Scikit-learn"), t("Evaluación de modelos"), t("Feature engineering"),
      sec("Deep Learning"), t("Redes neuronales"), t("TensorFlow / PyTorch"), t("CNNs"), t("RNNs / Transformers"),
      sec("LLMs y GenAI"), t("Prompt engineering"), t("RAG"), t("Embeddings / Vector DB"), t("Fine-tuning"), t("LangChain"),
      sec("MLOps"), t("MLflow"), t("Pipelines"), t("Despliegue de modelos"), t("Monitorización"),
      sec("Cloud IA"), t("Azure AI / AWS / Vertex"), t("APIs (OpenAI / Anthropic)"),
      sec("Ética y seguridad IA"), t("Responsible AI"), t("AI Security"), t("Sesgos"),
      sec("Certificaciones"), s("ai-900", "AI-900"), s("ai-102", "AI-102"), s("aws-ai-practitioner", "AWS AI Practitioner"),
    ],
  },
  {
    slug: "sysadmin-linux", title: "Linux SysAdmin (completo)", role: "Linux System Administrator",
    description: "Ruta completa de administración Linux: sistema, scripting, redes, almacenamiento y hardening.",
    domain: "linux", estMonths: 14, estCostEUR: 600, difficulty: "media", salaryRange: "24.000 – 45.000 €",
    steps: [
      sec("Fundamentos"), t("Sistema de archivos"), t("CLI / terminal"), t("Permisos"), t("Usuarios y grupos"), t("Procesos"),
      sec("Administración"), t("Gestión de paquetes"), t("systemd / servicios"), t("Cron"), t("Logs / journald"),
      sec("Scripting"), t("Bash"), t("Variables / condiciones / bucles"), t("Automatización"),
      sec("Redes"), t("Configuración de red"), t("SSH"), t("Firewall (iptables / firewalld)"), t("DNS / DHCP"),
      sec("Almacenamiento"), t("Particiones"), t("LVM"), t("RAID"), t("Sistemas de archivos (ext4 / xfs)"),
      sec("Seguridad / Hardening"), t("SELinux / AppArmor"), t("SSH hardening"), t("Actualizaciones"), t("CIS Benchmarks"),
      sec("Servidores"), t("Web (Nginx / Apache)"), t("Bases de datos"), t("Contenedores (Docker)"),
      sec("Certificaciones"), s("linux-essentials", "Linux Essentials"), s("lpic-1", "LPIC-1"), s("rhcsa", "RHCSA"), s("comptia-linux", "Linux+"),
    ],
  },
];

let n = 0;
let total = 0;
for (const r of ROADMAPS) {
  const data = {
    title: r.title, role: r.role, description: r.description, domain: r.domain,
    estMonths: r.estMonths, estCostEUR: r.estCostEUR, difficulty: r.difficulty,
    salaryRange: r.salaryRange, steps: JSON.stringify(r.steps),
  };
  await prisma.roadmap.upsert({ where: { slug: r.slug }, update: data, create: { slug: r.slug, ...data } });
  n++;
  total += r.steps.length;
}
console.log(`Roadmaps completos: ${n} (${total} nodos en total)`);
await prisma.$disconnect();
