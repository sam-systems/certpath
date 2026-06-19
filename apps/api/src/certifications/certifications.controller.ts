import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Headers,
  Param,
  Query,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import {
  CertificationsService,
  type ImportItem,
} from "./certifications.service";

@Controller("certifications")
export class CertificationsController {
  constructor(private readonly service: CertificationsService) {}

  @Get()
  findAll(
    @Query("domain") domain?: string,
    @Query("vendor") vendor?: string,
    @Query("cost") cost?: string,
  ) {
    return this.service.findAll({ domain, vendor, cost });
  }

  @Get(":slug")
  async findOne(@Param("slug") slug: string) {
    const cert = await this.service.findOne(slug);
    if (!cert) throw new NotFoundException("Certificación no encontrada");
    return cert;
  }

  // Añadir UNA (manual)
  @Post()
  createOne(
    @Headers("x-import-token") token: string,
    @Body() body: ImportItem,
  ) {
    this.assertToken(token);
    return this.service.importMany([body]);
  }

  // Añadir MUCHAS (automático, pegando JSON)
  @Post("import")
  importMany(
    @Headers("x-import-token") token: string,
    @Body() body: { items: ImportItem[] },
  ) {
    this.assertToken(token);
    return this.service.importMany(body?.items ?? []);
  }

  // Borrar UNA
  @Delete(":slug")
  async remove(
    @Headers("x-import-token") token: string,
    @Param("slug") slug: string,
  ) {
    this.assertToken(token);
    const res = await this.service.remove(slug);
    if (res.notFound) throw new NotFoundException("Certificación no encontrada");
    return res;
  }

  private assertToken(token?: string) {
    const expected = process.env.IMPORT_TOKEN;
    if (!expected || token !== expected) {
      throw new UnauthorizedException("Token de importación inválido");
    }
  }
}
