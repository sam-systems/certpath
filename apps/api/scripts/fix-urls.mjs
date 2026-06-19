// Rellena las URLs vacías con la web OFICIAL de cada fabricante/organismo.
// Las que no tengan oficial conocida -> búsqueda directa (fácil de encontrar).
const TOKEN = "certpath-admin-2026";

const VENDOR_URL = {
  AWS: "https://aws.amazon.com/certification/",
  Microsoft: "https://learn.microsoft.com/credentials/certifications/",
  "Google Cloud": "https://cloud.google.com/learn/certification",
  Google: "https://cloud.google.com/learn/certification",
  Cisco: "https://www.cisco.com/site/us/en/learn/training-certifications/certifications/index.html",
  CompTIA: "https://www.comptia.org/certifications",
  ISC2: "https://www.isc2.org/certifications",
  OffSec: "https://www.offsec.com/courses-and-certifications/",
  "Hack The Box": "https://academy.hackthebox.com/certifications",
  GIAC: "https://www.giac.org/certifications/",
  ISACA: "https://www.isaca.org/credentialing",
  LPI: "https://www.lpi.org/our-certifications/",
  "Red Hat": "https://www.redhat.com/en/services/certification",
  CNCF: "https://www.cncf.io/training/certification/",
  "Linux Foundation": "https://training.linuxfoundation.org/certification/",
  HashiCorp: "https://www.hashicorp.com/certification",
  Docker: "https://www.docker.com/",
  Fortinet: "https://training.fortinet.com/",
  "Palo Alto": "https://www.paloaltonetworks.com/services/education/certification",
  "Check Point": "https://www.checkpoint.com/support-services/training-certification/",
  "EC-Council": "https://www.eccouncil.org/train-certify/",
  INE: "https://security.ine.com/certifications/",
  "TCM Security": "https://certifications.tcm-sec.com/",
  VMware: "https://www.vmware.com/learning/certification.html",
  Nutanix: "https://www.nutanix.com/products/nutanix-university",
  Citrix: "https://www.citrix.com/training/",
  Oracle: "https://education.oracle.com/certification",
  MongoDB: "https://learn.mongodb.com/pages/certification",
  Snowflake: "https://www.snowflake.com/certifications/",
  Databricks: "https://www.databricks.com/learn/certification",
  NVIDIA: "https://www.nvidia.com/en-us/learn/certification/",
  IBM: "https://www.ibm.com/training/",
  PeopleCert: "https://www.peoplecert.org/",
  PMI: "https://www.pmi.org/certifications",
  "Scrum.org": "https://www.scrum.org/professional-scrum-certifications",
  PECB: "https://pecb.com/",
  IASSC: "https://www.iassc.org/",
  "The Open Group": "https://www.opengroup.org/certifications",
  OpenAI: "https://platform.openai.com/docs",
  "Hugging Face": "https://huggingface.co/learn",
  Tableau: "https://www.tableau.com/learn/certification",
  Qlik: "https://www.qlik.com/us/services/training",
  SUSE: "https://www.suse.com/training/",
  GitHub: "https://resources.github.com/learn/certifications/",
  GitLab: "https://about.gitlab.com/services/education/",
  CloudBees: "https://www.cloudbees.com/",
  "DevOps Institute": "https://www.devopsinstitute.com/certifications/",
  "FinOps Foundation": "https://www.finops.org/certifications/",
  Pulumi: "https://www.pulumi.com/",
  "Zero-Point Security": "https://www.zeropointsecurity.co.uk/",
  "Altered Security": "https://www.alteredsecurity.com/",
  LangChain: "https://www.langchain.com/",
  Dataiku: "https://academy.dataiku.com/",
  APMG: "https://apmg-international.com/",
  EDB: "https://www.enterprisedb.com/",
  INCIBE: "https://www.incibe.es/",
};

const search = (name) =>
  `https://www.google.com/search?q=${encodeURIComponent(name + " certificación oficial")}`;

const all = await (await fetch("http://127.0.0.1:4000/api/certifications")).json();
const toFix = all.filter((c) => !c.url || String(c.url).trim() === "");

const items = toFix.map((c) => ({
  slug: c.slug,
  name: c.name,
  vendor: c.vendor.name,
  domain: c.category.domain,
  code: c.code,
  level: c.level,
  cost: c.cost,
  priceEUR: c.priceEUR,
  prepHours: c.prepHours,
  validityYears: c.validityYears,
  demand: c.demand,
  skills: c.skills,
  url: VENDOR_URL[c.vendor.name] || search(c.name),
}));

const res = await fetch("http://127.0.0.1:4000/api/certifications/import", {
  method: "POST",
  headers: { "Content-Type": "application/json", "x-import-token": TOKEN },
  body: JSON.stringify({ items }),
});
console.log("Sin URL:", toFix.length, "-> corregidas:", JSON.stringify(await res.json()));
