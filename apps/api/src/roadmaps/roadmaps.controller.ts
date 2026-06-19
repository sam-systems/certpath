import {
  Controller,
  Get,
  Param,
  NotFoundException,
} from "@nestjs/common";
import { RoadmapsService } from "./roadmaps.service";

@Controller("roadmaps")
export class RoadmapsController {
  constructor(private readonly service: RoadmapsService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(":slug")
  async findOne(@Param("slug") slug: string) {
    const r = await this.service.findOne(slug);
    if (!r) throw new NotFoundException("Roadmap no encontrado");
    return r;
  }
}
