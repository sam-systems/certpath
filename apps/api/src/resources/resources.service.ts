import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

export interface ResourceItem {
  title: string;
  url: string;
  description?: string;
  category?: string;
}

@Injectable()
export class ResourcesService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(category?: string) {
    return this.prisma.resource.findMany({
      where: category ? { category } : {},
      orderBy: [{ category: "asc" }, { title: "asc" }],
    });
  }

  async importMany(items: ResourceItem[]) {
    let created = 0;
    let updated = 0;
    const errors: string[] = [];
    for (const it of items) {
      try {
        if (!it?.title || !it?.url) {
          errors.push("Falta title o url");
          continue;
        }
        const data = {
          title: it.title,
          url: it.url,
          description: it.description ?? null,
          category: it.category?.trim() || "General",
        };
        const ex = await this.prisma.resource.findUnique({
          where: { url: it.url },
        });
        if (ex) {
          await this.prisma.resource.update({ where: { url: it.url }, data });
          updated++;
        } else {
          await this.prisma.resource.create({ data });
          created++;
        }
      } catch (e) {
        errors.push(`${it?.title ?? "?"}: ${(e as Error).message}`);
      }
    }
    return { created, updated, total: items.length, errors };
  }

  async remove(id: string) {
    const ex = await this.prisma.resource.findUnique({ where: { id } });
    if (!ex) return { ok: false, notFound: true };
    await this.prisma.resource.delete({ where: { id } });
    return { ok: true };
  }
}
