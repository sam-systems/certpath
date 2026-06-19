// Exporta el catálogo actual (SQLite) a JSON para migrarlo a Postgres/Neon.
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import fs from "fs";

const p = new PrismaClient();
const data = {
  vendors: await p.vendor.findMany(),
  categories: await p.category.findMany(),
  certifications: await p.certification.findMany(),
  roadmaps: await p.roadmap.findMany(),
  books: await p.book.findMany(),
  resources: await p.resource.findMany(),
};
fs.writeFileSync(
  "scripts/data-export.json",
  JSON.stringify(data, null, 2),
);
console.log(
  "Exportado:",
  Object.fromEntries(Object.entries(data).map(([k, v]) => [k, v.length])),
);
process.exit(0);
