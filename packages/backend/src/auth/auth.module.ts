// src/user/user.module.ts

import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { AuthController } from "src/presentation/controllers/auth.controller";
import { PrismaModule } from "src/prisma/prisma.module";

@Module({
  imports: [
    // CQRSパターンを使用するためのモジュール
    CqrsModule,
    // Prismaを使用するためのモジュール
    PrismaModule,
  ],
  controllers: [AuthController],
  providers: [],
  exports: [],
})
export class AuthModule {}
