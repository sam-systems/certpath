import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

export interface BookItem {
  title: string;
  author: string;
  slug?: string;
  publisher?: string;
  pages?: number;
  domain?: string;
  level?: string;
  audience?: string;
  tags?: string[];
  buyUrl?: string;
  fileUrl?: string;
  summary?: string;
  isbn?: string;
  coverUrl?: string;
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

@Injectable()
export class BooksService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(f: { domain?: string; level?: string; audience?: string }) {
    const where: Record<string, unknown> = {};
    if (f.domain) where.domain = f.domain;
    if (f.level) where.level = f.level;
    if (f.audience) where.audience = f.audience;
    const items = await this.prisma.book.findMany({
      where,
      orderBy: { title: "asc" },
    });
    return items.map(this.serialize);
  }

  async findOne(slug: string) {
    const b = await this.prisma.book.findUnique({ where: { slug } });
    return b ? this.serialize(b) : null;
  }

  async importMany(items: BookItem[]) {
    let created = 0;
    let updated = 0;
    const errors: string[] = [];
    for (const it of items) {
      try {
        if (!it?.title) {
          errors.push("Falta el título");
          continue;
        }
        const slug = slugify(it.slug || it.title);
        const data = {
          title: it.title,
          author: it.author?.trim() || "Autor desconocido",
          publisher: it.publisher ?? null,
          pages: it.pages ?? null,
          domain: it.domain ?? "ciberseguridad",
          level: it.level ?? "intermedio",
          audience: it.audience ?? "ambos",
          tags: JSON.stringify(it.tags ?? []),
          buyUrl: it.buyUrl ?? null,
          fileUrl: it.fileUrl ?? null,
          summary: it.summary ?? null,
          isbn: it.isbn ?? null,
          coverUrl: it.coverUrl ?? null,
        };
        const ex = await this.prisma.book.findUnique({ where: { slug } });
        if (ex) {
          await this.prisma.book.update({ where: { slug }, data });
          updated++;
        } else {
          await this.prisma.book.create({ data: { slug, ...data } });
          created++;
        }
      } catch (e) {
        errors.push(`${it?.title ?? "?"}: ${(e as Error).message}`);
      }
    }
    return { created, updated, total: items.length, errors };
  }

  async remove(slug: string) {
    const ex = await this.prisma.book.findUnique({ where: { slug } });
    if (!ex) return { ok: false, notFound: true };
    await this.prisma.book.delete({ where: { slug } });
    return { ok: true };
  }

  private serialize = (b: { tags: string; [k: string]: unknown }) => ({
    ...b,
    tags: JSON.parse(b.tags || "[]") as string[],
  });

  // Busca los datos de un libro por ISBN (Google Books -> Open Library).
  async lookupByIsbn(rawIsbn: string): Promise<Partial<BookItem> | null> {
    let isbn = (rawIsbn || "").replace(/[^0-9Xx]/g, "");
    // Si vienen dígitos de más (p.ej. se pegó la etiqueta "ISBN-13"),
    // extrae el ISBN-13 (97[89]+10) o, en su defecto, los 13/10 finales.
    if (isbn.length > 13) {
      const m13 = isbn.match(/97[89]\d{10}/);
      isbn = m13 ? m13[0] : isbn.slice(-13);
    }
    if (isbn.length < 10) return null;

    // 1) Google Books (country es obligatorio o devuelve vacío en muchos casos)
    try {
      const res = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}&country=ES&maxResults=1`,
        { signal: AbortSignal.timeout(5000) },
      );
      if (res.ok) {
        const data = (await res.json()) as {
          totalItems?: number;
          items?: Array<{ volumeInfo?: Record<string, unknown> }>;
        };
        const v = data.items?.[0]?.volumeInfo as
          | {
              title?: string;
              subtitle?: string;
              authors?: string[];
              publisher?: string;
              pageCount?: number;
              description?: string;
              categories?: string[];
              imageLinks?: { thumbnail?: string; smallThumbnail?: string };
            }
          | undefined;
        if (v?.title) {
          const cover = (v.imageLinks?.thumbnail || v.imageLinks?.smallThumbnail || "")
            .replace(/^http:/, "https:")
            .replace("&edge=curl", "");
          return {
            title: v.subtitle ? `${v.title}: ${v.subtitle}` : v.title,
            author: (v.authors ?? []).join(", "),
            publisher: v.publisher,
            pages: v.pageCount,
            summary: v.description,
            tags: v.categories ?? [],
            coverUrl: cover || undefined,
            isbn,
          };
        }
      }
    } catch {
      /* sigue al fallback */
    }

    // 2) Open Library (fallback)
    try {
      const res = await fetch(
        `https://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&format=json&jscmd=data`,
        { signal: AbortSignal.timeout(5000) },
      );
      if (res.ok) {
        const data = (await res.json()) as Record<
          string,
          {
            title?: string;
            authors?: Array<{ name?: string }>;
            publishers?: Array<{ name?: string }>;
            number_of_pages?: number;
            subjects?: Array<{ name?: string }>;
            cover?: { medium?: string; large?: string };
          }
        >;
        const v = data[`ISBN:${isbn}`];
        if (v?.title) {
          return {
            title: v.title,
            author: (v.authors ?? []).map((a) => a.name).filter(Boolean).join(", "),
            publisher: v.publishers?.[0]?.name,
            pages: v.number_of_pages,
            tags: (v.subjects ?? []).map((s) => s.name).filter(Boolean).slice(0, 6) as string[],
            coverUrl: v.cover?.large || v.cover?.medium,
            isbn,
          };
        }
      }
    } catch {
      /* sigue al tercer intento */
    }

    // 3) Open Library edición directa (/isbn/X.json) — cubre libros que el
    //    endpoint anterior devuelve vacíos (frecuente en libros en español).
    try {
      const res = await fetch(`https://openlibrary.org/isbn/${isbn}.json`, {
        signal: AbortSignal.timeout(5000),
      });
      if (res.ok) {
        const v = (await res.json()) as {
          title?: string;
          by_statement?: string;
          publishers?: string[];
          number_of_pages?: number;
          subjects?: string[];
        };
        if (v?.title) {
          return {
            title: v.title,
            author: (v.by_statement || "").replace(/\.$/, ""),
            publisher: v.publishers?.[0],
            pages: v.number_of_pages,
            tags: (v.subjects ?? []).slice(0, 6),
            coverUrl: `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`,
            isbn,
          };
        }
      }
    } catch {
      /* sigue al último intento */
    }

    // 4) Open Library search (índice más amplio que las ediciones)
    try {
      const res = await fetch(
        `https://openlibrary.org/search.json?isbn=${isbn}&fields=title,author_name,publisher,number_of_pages_median,subject,cover_i&limit=1`,
        { signal: AbortSignal.timeout(5000) },
      );
      if (res.ok) {
        const data = (await res.json()) as {
          docs?: Array<{
            title?: string;
            author_name?: string[];
            publisher?: string[];
            number_of_pages_median?: number;
            subject?: string[];
            cover_i?: number;
          }>;
        };
        const v = data.docs?.[0];
        if (v?.title) {
          return {
            title: v.title,
            author: (v.author_name ?? []).join(", "),
            publisher: v.publisher?.[0],
            pages: v.number_of_pages_median,
            tags: (v.subject ?? []).slice(0, 6),
            coverUrl: v.cover_i
              ? `https://covers.openlibrary.org/b/id/${v.cover_i}-L.jpg`
              : `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`,
            isbn,
          };
        }
      }
    } catch {
      /* nada */
    }

    return null;
  }
}
