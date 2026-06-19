const TOKEN = "certpath-admin-2026";
const u = "https://learn.microsoft.com/credentials/certifications/";
const c = (name, domain, level, code, priceEUR = 165) => ({
  name, vendor: "Microsoft", domain, level, cost: "pago", priceEUR, url: u, code,
});

const items = [
  c("Azure Developer Associate (AZ-204)", "cloud", "associate", "AZ-204"),
  c("Microsoft 365 Administrator (MS-102)", "soporte", "associate", "MS-102"),
  c("Teams Administrator (MS-700)", "soporte", "associate", "MS-700"),
  c("Collaboration Communications Systems Engineer (MS-721)", "soporte", "associate", "MS-721"),
  c("Power Platform App Maker (PL-100)", "ia", "associate", "PL-100"),
  c("Power Platform Functional Consultant (PL-200)", "ia", "associate", "PL-200"),
  c("Power Automate RPA Developer (PL-500)", "ia", "associate", "PL-500"),
  c("Power Platform Solution Architect (PL-600)", "ia", "expert", "PL-600"),
  c("Azure Data Scientist Associate (DP-100)", "ia", "associate", "DP-100"),
  c("Azure Cosmos DB Developer Specialty (DP-420)", "ia", "specialty", "DP-420"),
  c("Information Security Administrator (SC-401)", "ciberseguridad", "associate", "SC-401"),
  c("Dynamics 365 Fundamentals CRM (MB-910)", "soporte", "fundamentos", "MB-910", 99),
  c("Dynamics 365 Fundamentals ERP (MB-920)", "soporte", "fundamentos", "MB-920", 99),
  c("Dynamics 365 Customer Service Functional Consultant (MB-230)", "soporte", "associate", "MB-230"),
  c("Dynamics 365 Finance Functional Consultant (MB-310)", "grc", "associate", "MB-310"),
  c("Dynamics 365 Supply Chain Management (MB-330)", "grc", "associate", "MB-330"),
  c("Dynamics 365 Business Central Functional Consultant (MB-800)", "grc", "associate", "MB-800"),
];

const res = await fetch("http://127.0.0.1:4000/api/certifications/import", {
  method: "POST",
  headers: { "Content-Type": "application/json", "x-import-token": TOKEN },
  body: JSON.stringify({ items }),
});
console.log("Microsoft:", items.length, "->", JSON.stringify(await res.json()));
