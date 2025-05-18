// src/user/user.module.ts

import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { PrismaModule } from "../prisma/prisma.module";
import { PrismaUserRepository } from "../infrastructure/repositories/prisma-user.repository";
import { UserMapper } from "../infrastructure/mappers/user.mapper";
import { USER_REPOSITORY } from "../domain/user/repositories/user.reposiroty.interface";

@Module({
  imports: [
    // CQRSパターンを使用するためのモジュール
    CqrsModule,
    // Prismaを使用するためのモジュール
    PrismaModule,
  ],
  controllers: [],
  providers: [
    UserMapper,
    {
      provide: USER_REPOSITORY,
      useClass: PrismaUserRepository,
    },
  ],
  exports: [USER_REPOSITORY],
})
export class UserModule {}
