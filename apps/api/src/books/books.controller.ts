import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  NotFoundException,
  Param,
  Post,
  Query,
  UnauthorizedException,
} from "@nestjs/common";
import { BooksService, type BookItem } from "./books.service";

@Controller("books")
export class BooksController {
  constructor(private readonly service: BooksService) {}

  @Get()
  findAll(
    @Query("domain") domain?: string,
    @Query("level") level?: string,
    @Query("audience") audience?: string,
  ) {
    return this.service.findAll({ domain, level, audience });
  }

  // Autocompletar por ISBN (Google Books / Open Library)
  // Datos: Google Books + Open Library. Enlace de compra: Amazon (búsqueda por ISBN).
  @Get("lookup")
  async lookup(@Query("isbn") isbn: string) {
    const data = await this.service.lookupByIsbn(isbn || "");
    if (!data) throw new NotFoundException("No se encontró el ISBN");
    if (!data.buyUrl && data.isbn) {
      const tag = process.env.AMAZON_AFFILIATE_TAG;
      data.buyUrl = `https://www.amazon.es/s?k=${data.isbn}${tag ? `&tag=${encodeURIComponent(tag)}` : ""}`;
    }
    return data;
  }

  @Get(":slug")
  async findOne(@Param("slug") slug: string) {
    const b = await this.service.findOne(slug);
    if (!b) throw new NotFoundException("Libro no encontrado");
    return b;
  }

  @Post()
  create(@Headers("x-import-token") token: string, @Body() body: BookItem) {
    this.assert(token);
    return this.service.importMany([body]);
  }

  @Post("import")
  importMany(
    @Headers("x-import-token") token: string,
    @Body() body: { items: BookItem[] },
  ) {
    this.assert(token);
    return this.service.importMany(body?.items ?? []);
  }

  @Delete(":slug")
  async remove(
    @Headers("x-import-token") token: string,
    @Param("slug") slug: string,
  ) {
    this.assert(token);
    const res = await this.service.remove(slug);
    if (res.notFound) throw new NotFoundException("Libro no encontrado");
    return res;
  }

  private assert(token?: string) {
    if (!process.env.IMPORT_TOKEN || token !== process.env.IMPORT_TOKEN) {
      throw new UnauthorizedException("Token inválido");
    }
  }
}
