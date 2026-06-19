// Carga inicial de enlaces/recursos importantes (ejemplos del ENS / CCN-STIC).
// Uso: node scripts/seed-resources.mjs
import "dotenv/config";

const API = process.env.API_URL || "http://127.0.0.1:4000/api";
const TOKEN = process.env.IMPORT_TOKEN;

const items = [
  {
    title: "ENS — Portal oficial del Esquema Nacional de Seguridad",
    url: "https://ens.ccn.cni.es/es",
    category: "ENS",
    description: "Portal del CCN sobre el Esquema Nacional de Seguridad.",
  },
  {
    title: "ENS — Entidades Locales",
    url: "https://ens.ccn.cni.es/es/entidades-locales",
    category: "ENS",
    description: "Adecuación al ENS para ayuntamientos y diputaciones.",
  },
  {
    title: "CCN-CERT — Guías STIC (catálogo)",
    url: "https://www.ccn-cert.cni.es/es/guias?format=html",
    category: "Guías CCN-STIC",
    description: "Listado completo de guías CCN-STIC.",
  },
  {
    title: "CCN-STIC 802 — Auditoría del ENS",
    url: "https://www.ccn-cert.cni.es/es/800-guia-esquema-nacional-de-seguridad/502-ccn-stic-802-auditoria-del-ens/file.html",
    category: "Guías CCN-STIC",
    description: "Guía de auditoría del ENS.",
  },
  {
    title: "CCN-STIC 804 — Medidas de implantación del ENS",
    url: "https://www.ccn-cert.cni.es/es/800-guia-esquema-nacional-de-seguridad/505-ccn-stic-804-medidas-de-implantancion-del-ens/file.html",
    category: "Guías CCN-STIC",
    description: "Medidas de implantación del ENS.",
  },
  {
    title: "CCN-STIC 808 — Verificación del cumplimiento de las medidas en el ENS",
    url: "https://www.ccn-cert.cni.es/es/800-guia-esquema-nacional-de-seguridad/518-ccn-stic-808-verificacion-del-cumplimiento-de-las-medidas-en-el-ens/file.html",
    category: "Guías CCN-STIC",
    description: "Verificación del cumplimiento de medidas del ENS.",
  },
];

const res = await fetch(`${API}/resources/import`, {
  method: "POST",
  headers: { "Content-Type": "application/json", "x-import-token": TOKEN },
  body: JSON.stringify({ items }),
});
console.log(res.status, await res.text());
