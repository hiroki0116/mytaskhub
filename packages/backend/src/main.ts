import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import * as admin from "firebase-admin";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get<ConfigService>(ConfigService);

  app.enableCors();

  // Firebase Admin SDKの初期化
  const firebaseCredential = configService.get<string>("FIREBASE_CREDENTIAL");
  if (firebaseCredential) {
    admin.initializeApp({
      credential: admin.credential.cert(
        JSON.parse(Buffer.from(firebaseCredential, "base64").toString("ascii"))
      ),
    });
  }

  // バリデーションパイプの設定
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  );

  // APIプレフィックスの設定
  app.setGlobalPrefix("api/v1");

  // Swagger設定
  const options = new DocumentBuilder()
    .setTitle("MyTaskHub API")
    .setDescription("MyTaskHub Application API Documentation")
    .setVersion("1.0")
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup("api-docs", app, document);

  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap().catch((error) => {
  console.error("Application failed to start:", error);
  process.exit(1);
});
