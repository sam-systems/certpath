import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class ProgressService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.progress.findMany({ orderBy: { updatedAt: "desc" } });
  }

  set(certSlug: string, status: string) {
    return this.prisma.progress.upsert({
      where: { certSlug },
      update: { status },
      create: { certSlug, status },
    });
  }

  async remove(certSlug: string) {
    await this.prisma.progress.deleteMany({ where: { certSlug } });
    return { ok: true };
  }

  // ── Progreso de lectura de libros ──
  findAllBooks() {
    return this.prisma.bookProgress.findMany({
      orderBy: { updatedAt: "desc" },
    });
  }

  setBook(bookSlug: string, status: string, currentPage?: number) {
    const page =
      typeof currentPage === "number" && !Number.isNaN(currentPage)
        ? currentPage
        : null;
    return this.prisma.bookProgress.upsert({
      where: { bookSlug },
      update: { status, currentPage: page },
      create: { bookSlug, status, currentPage: page },
    });
  }
}
