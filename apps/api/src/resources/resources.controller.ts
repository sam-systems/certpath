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
import { ResourcesService, type ResourceItem } from "./resources.service";

@Controller("resources")
export class ResourcesController {
  constructor(private readonly service: ResourcesService) {}

  @Get()
  findAll(@Query("category") category?: string) {
    return this.service.findAll(category);
  }

  @Post()
  create(@Headers("x-import-token") token: string, @Body() body: ResourceItem) {
    this.assert(token);
    return this.service.importMany([body]);
  }

  @Post("import")
  importMany(
    @Headers("x-import-token") token: string,
    @Body() body: { items: ResourceItem[] },
  ) {
    this.assert(token);
    return this.service.importMany(body?.items ?? []);
  }

  @Delete(":id")
  async remove(
    @Headers("x-import-token") token: string,
    @Param("id") id: string,
  ) {
    this.assert(token);
    const res = await this.service.remove(id);
    if (res.notFound) throw new NotFoundException("Recurso no encontrado");
    return res;
  }

  private assert(token?: string) {
    if (!process.env.IMPORT_TOKEN || token !== process.env.IMPORT_TOKEN) {
      throw new UnauthorizedException("Token inválido");
    }
  }
}
