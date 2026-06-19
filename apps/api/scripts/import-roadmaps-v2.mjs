import "dotenv/config";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const s = (certSlug, title) => ({ certSlug, title });
const t = (title, url, note) => ({ title, url, note });

const R = {
  "security-engineer": [
    t("Fundamentos de redes", "https://www.professormesser.com/network-plus/n10-009/n10-009-video/n10-009-training-course/", "OSI, TCP/IP, puertos"),
    s("comptia-network", "CompTIA Network+"),
    t("Linux + Bash", "https://linuxjourney.com/", "Administración y scripting"),
    s("comptia-security", "CompTIA Security+"),
    t("Criptografía y PKI", "https://www.coursera.org/learn/crypto", "Cifrado, certificados, TLS"),
    t("Hardening (CIS Benchmarks)", "https://www.cisecurity.org/cis-benchmarks", "Endurecer sistemas"),
    s("az-500", "AZ-500 (Azure Security)"),
    s("aws-security", "AWS Security Specialty"),
    t("Zero Trust", "https://www.nist.gov/publications/zero-trust-architecture", "NIST 800-207"),
    s("cks", "Kubernetes Security (CKS)"),
    s("isc2-cissp", "CISSP"),
  ],
  "security-architect": [
    s("ccna", "CCNA (redes)"),
    s("comptia-network", "Network+"),
    s("comptia-security", "Security+"),
    s("ccnp-ent", "CCNP Enterprise"),
    t("Cloud (Azure/AWS)", "https://learn.microsoft.com/training/azure/", "Infra en la nube"),
    s("az-305", "AZ-305 (arquitectura cloud)"),
    t("Zero Trust & SABSA", "https://www.nist.gov/publications/zero-trust-architecture", "Marcos de arquitectura"),
    s("isc2-cissp", "CISSP"),
    t("CISSP-ISSAP (arquitectura de seguridad)", "https://www.isc2.org/certifications/issap"),
    t("CCDE (diseño de redes)", "https://www.cisco.com/site/us/en/learn/training-certifications/certifications/index.html"),
  ],
  "ciberseguridad-soc": [
    t("Fundamentos IT", "https://www.professormesser.com/", "Bases antes de empezar"),
    t("Redes (OSI/puertos)", "https://www.professormesser.com/network-plus/n10-009/n10-009-video/n10-009-training-course/"),
    s("comptia-network", "Network+"),
    s("comptia-security", "Security+"),
    t("TryHackMe — SOC Level 1", "https://tryhackme.com/path/outline/soclevel1", "Ruta práctica de SOC"),
    t("SIEM (Splunk)", "https://www.splunk.com/en_us/training/free-courses/overview.html"),
    s("sc-200", "SC-200 (Microsoft Sentinel)"),
    t("MITRE ATT&CK", "https://attack.mitre.org/", "TTPs de adversarios"),
    s("comptia-cysa", "CySA+"),
    s("htb-cdsa", "HTB CDSA"),
    t("Threat Intelligence", "https://www.sans.org/cyber-security-courses/cyber-threat-intelligence/"),
  ],
  redes: [
    t("Modelo OSI / TCP-IP", "https://www.professormesser.com/network-plus/n10-009/n10-009-video/n10-009-training-course/"),
    t("Subnetting (práctica)", "https://subnettingpractice.com/"),
    s("comptia-network", "Network+"),
    s("ccna", "CCNA"),
    t("Routing & Switching (Packet Tracer)", "https://www.netacad.com/"),
    s("ccnp-ent", "CCNP Enterprise"),
    t("Automatización (Python/Ansible)", "https://developer.cisco.com/learning/", "NetDevOps"),
    t("SD-WAN / SDN", "https://www.cisco.com/c/en/us/solutions/enterprise-networks/sd-wan/index.html"),
    s("ccie-ent", "CCIE Enterprise"),
    t("Diseño (CCDE)", "https://www.cisco.com/site/us/en/learn/training-certifications/certifications/index.html"),
  ],
  pentester: [
    s("comptia-security", "Security+"),
    t("Linux para pentest", "https://overthewire.org/wargames/bandit/", "OverTheWire Bandit"),
    t("TryHackMe — Jr Pentester", "https://tryhackme.com/path/outline/jrpenetrationtester"),
    t("PortSwigger Web Academy (gratis)", "https://portswigger.net/web-security"),
    s("htb-cpts", "HTB CPTS"),
    t("HackTheBox (máquinas)", "https://app.hackthebox.com/"),
    s("oscp", "OSCP"),
    t("Active Directory pentest", "https://www.alteredsecurity.com/", "CRTP"),
    s("osep", "OSEP (avanzado)"),
  ],
  "devops-engineer": [
    t("Linux + Bash", "https://linuxjourney.com/"),
    t("Git & GitHub", "https://docs.github.com/get-started"),
    s("docker-dca", "Docker"),
    t("CI/CD (GitHub Actions)", "https://docs.github.com/actions"),
    s("cka", "Kubernetes (CKA)"),
    s("terraform-assoc", "Terraform"),
    t("Observabilidad (Prometheus + Grafana)", "https://prometheus.io/docs/introduction/overview/"),
    s("aws-saa", "Cloud (AWS SAA)"),
  ],
  "cloud-architect": [
    s("az-900", "AZ-900"),
    s("az-104", "AZ-104"),
    t("Redes en Azure", "https://learn.microsoft.com/azure/networking/"),
    s("az-305", "AZ-305"),
    t("IaC con Terraform", "https://developer.hashicorp.com/terraform/tutorials"),
    t("Well-Architected Framework", "https://learn.microsoft.com/azure/well-architected/"),
    s("isc2-ccsp", "CCSP (seguridad cloud)"),
  ],
  "ai-engineer": [
    t("Python", "https://docs.python.org/3/tutorial/"),
    s("ai-900", "AI-900"),
    t("Machine Learning básico", "https://www.coursera.org/learn/machine-learning"),
    s("ai-102", "AI-102"),
    s("aws-ai-practitioner", "AWS AI Practitioner"),
    t("LLMs & RAG", "https://www.deeplearning.ai/short-courses/"),
    t("MLOps", "https://ml-ops.org/"),
  ],
  "threat-hunter": [
    s("comptia-security", "Security+"),
    s("comptia-cysa", "CySA+"),
    t("MITRE ATT&CK", "https://attack.mitre.org/"),
    s("sc-200", "SC-200 (Sentinel)"),
    s("htb-cdsa", "HTB CDSA"),
    t("Threat Intelligence (CTI)", "https://www.sans.org/cyber-security-courses/cyber-threat-intelligence/"),
  ],
  "forense-digital": [
    s("comptia-security", "Security+"),
    t("Autopsy / Sleuth Kit", "https://www.autopsy.com/", "Forense de disco"),
    t("Volatility (memoria)", "https://volatilityfoundation.org/"),
    t("CyberDefenders (práctica)", "https://cyberdefenders.org/"),
    s("htb-cdsa", "HTB CDSA"),
    s("chfi", "CHFI"),
  ],
  "sysadmin-linux": [
    t("Linux Journey", "https://linuxjourney.com/"),
    s("linux-essentials", "Linux Essentials"),
    s("lpic-1", "LPIC-1"),
    t("Bash scripting", "https://www.gnu.org/software/bash/manual/"),
    s("rhcsa", "RHCSA"),
    s("docker-dca", "Docker"),
  ],
  "bug-bounty-hunter": [
    s("comptia-security", "Security+"),
    t("PortSwigger Web Academy (gratis)", "https://portswigger.net/web-security"),
    s("htb-cbbh", "HTB CBBH"),
    t("Bug bounty (HackerOne)", "https://www.hackerone.com/hackers"),
    s("oswe", "OSWE"),
  ],
};

let n = 0;
for (const [slug, steps] of Object.entries(R)) {
  const res = await prisma.roadmap.updateMany({
    where: { slug },
    data: { steps: JSON.stringify(steps) },
  });
  if (res.count) n++;
}
console.log("Roadmaps enriquecidos:", n);
await prisma.$disconnect();
