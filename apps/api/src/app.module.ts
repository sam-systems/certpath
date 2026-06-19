import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { ThrottlerModule, ThrottlerGuard } from "@nestjs/throttler";
import { PrismaModule } from "./prisma/prisma.module";
import { CertificationsModule } from "./certifications/certifications.module";
import { RoadmapsModule } from "./roadmaps/roadmaps.module";
import { AuthModule } from "./auth/auth.module";
import { ProgressModule } from "./progress/progress.module";
import { BooksModule } from "./books/books.module";
import { ResourcesModule } from "./resources/resources.module";
import { HealthController } from "./health.controller";

@Module({
  imports: [
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 300 }]),
    PrismaModule,
    CertificationsModule,
    RoadmapsModule,
    AuthModule,
    ProgressModule,
    BooksModule,
    ResourcesModule,
  ],
  controllers: [HealthController],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
