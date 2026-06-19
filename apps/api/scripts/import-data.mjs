// Importa el catálogo (data-export.json) a la BD actual (Postgres/Neon).
// Orden: vendors -> categories -> certifications -> roadmaps -> books -> resources.
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import fs from "fs";

const p = new PrismaClient();
const d = JSON.parse(fs.readFileSync("scripts/data-export.json", "utf8"));

for (const v of d.vendors)
  await p.vendor.upsert({ where: { id: v.id }, update: v, create: v });
for (const c of d.categories)
  await p.category.upsert({ where: { id: c.id }, update: c, create: c });
for (const c of d.certifications)
  await p.certification.upsert({ where: { id: c.id }, update: c, create: c });
for (const r of d.roadmaps)
  await p.roadmap.upsert({ where: { id: r.id }, update: r, create: r });
for (const b of d.books)
  await p.book.upsert({ where: { id: b.id }, update: b, create: b });
for (const r of d.resources)
  await p.resource.upsert({ where: { id: r.id }, update: r, create: r });

console.log("Importado a Postgres:", {
  vendors: await p.vendor.count(),
  categories: await p.category.count(),
  certifications: await p.certification.count(),
  roadmaps: await p.roadmap.count(),
  books: await p.book.count(),
  resources: await p.resource.count(),
});
process.exit(0);
