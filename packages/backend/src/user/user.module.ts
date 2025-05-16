// src/user/user.module.ts

import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { PrismaModule } from "src/prisma/prisma.module";
import { UserController } from "src/presentation/controllers/user.controller";

@Module({
  imports: [
    // CQRSパターンを使用するためのモジュール
    CqrsModule,
    // Prismaを使用するためのモジュール
    PrismaModule,
  ],
  controllers: [
    // ユーザー関連のエンドポイントを提供するコントローラー
    UserController,
  ],
  providers: [],
  exports: [],
})
export class UserModule {}
