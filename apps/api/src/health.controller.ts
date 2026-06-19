import { Controller, Get } from "@nestjs/common";
import { PrismaService } from "./prisma/prisma.service";

@Controller("health")
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async health() {
    const [certs, roadmaps] = await Promise.all([
      this.prisma.certification.count(),
      this.prisma.roadmap.count(),
    ]);
    return { status: "ok", certs, roadmaps };
  }
}
