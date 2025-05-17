import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { PrismaModule } from "./prisma/prisma.module";
import { UserModule } from "./user/user.module";
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from "@nestjs/core";
import { GlobalExceptionFilter } from "./common/filters/global-exception.filter";
import { AuthModule } from "./auth/auth.module";
import { ApiResponseInterceptor } from "./common/interceptors/api-response.interceptor";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { JwtStrategy } from "./infrastructure/authentication/strategies/jwt.strategy";
import { JwtAuthGuard } from "./infrastructure/authentication/guards/jwt-auth.guard";
import { JwtService } from "./infrastructure/authentication/jwt/jwt.service";
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    UserModule,
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
  controllers: [],
  providers: [
    JwtStrategy,
    JwtAuthGuard,
    JwtService,
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ApiResponseInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
