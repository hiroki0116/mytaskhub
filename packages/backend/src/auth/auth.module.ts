// src/user/user.module.ts

import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { AuthController } from "../presentation/controllers/auth.controller";
import { PrismaModule } from "../prisma/prisma.module";
import { JwtStrategy } from "../infrastructure/authentication/strategies/jwt.strategy";
import { JwtAuthGuard } from "../infrastructure/authentication/guards/jwt-auth.guard";
import { JwtService } from "../infrastructure/authentication/jwt/jwt.service";
import { APP_GUARD } from "@nestjs/core";
import { Reflector } from "@nestjs/core";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { PrismaUserRepository } from "../infrastructure/repositories/prisma-user.repository";
import { USER_REPOSITORY } from "../domain/user/repositories/user.reposiroty.interface";
import { UserMapper } from "../infrastructure/mappers/user.mapper";

@Module({
  imports: [
    // CQRSパターンを使用するためのモジュール
    CqrsModule,
    // Prismaを使用するためのモジュール
    PrismaModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>("JWT_SECRET"),
        signOptions: {
          expiresIn: configService.get<string>("JWT_EXPIRES_IN") || "1d",
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    JwtStrategy,
    JwtAuthGuard,
    JwtService,
    UserMapper,
    {
      provide: USER_REPOSITORY,
      useClass: PrismaUserRepository,
    },
    {
      provide: APP_GUARD,
      useFactory: (reflector) => {
        return new JwtAuthGuard(reflector);
      },
      inject: [Reflector],
    },
  ],
  exports: [JwtService],
})
export class AuthModule {}
