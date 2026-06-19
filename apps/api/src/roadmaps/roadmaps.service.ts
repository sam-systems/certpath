import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class RoadmapsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const items = await this.prisma.roadmap.findMany({
      orderBy: { title: "asc" },
    });
    return items.map(this.serialize);
  }

  async findOne(slug: string) {
    const r = await this.prisma.roadmap.findUnique({ where: { slug } });
    return r ? this.serialize(r) : null;
  }

  private serialize = (r: { steps: string; [k: string]: unknown }) => ({
    ...r,
    steps: JSON.parse(r.steps || "[]") as unknown[],
  });
}
