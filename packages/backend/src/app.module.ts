import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { PrismaModule } from "./prisma/prisma.module";
import { UserModule } from "./user/user.module";
import { APP_FILTER, APP_INTERCEPTOR } from "@nestjs/core";
import { GlobalExceptionFilter } from "./common/filters/global-exception.filter";
import { AuthModule } from "./auth/auth.module";
import { ApiResponseInterceptor } from "./common/interceptors/api-response.interceptor";
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    UserModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ApiResponseInterceptor,
    },
  ],
})
export class AppModule {}
