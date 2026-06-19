import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { ProgressService } from "./progress.service";
import { AuthGuard } from "../auth/auth.guard";

@Controller("progress")
@UseGuards(AuthGuard)
export class ProgressController {
  constructor(private readonly service: ProgressService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Post()
  set(@Body() body: { certSlug: string; status: string }) {
    return this.service.set(body.certSlug, body.status);
  }

  @Get("books")
  findAllBooks() {
    return this.service.findAllBooks();
  }

  @Post("books")
  setBook(
    @Body() body: { bookSlug: string; status: string; currentPage?: number },
  ) {
    return this.service.setBook(body.bookSlug, body.status, body.currentPage);
  }
}
