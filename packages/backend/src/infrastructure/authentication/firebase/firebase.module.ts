// src/infrastructure/firebase/firebase.module.ts

import { InternalServerErrorException, Module, OnModuleInit } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import * as admin from "firebase-admin";
import { FirebaseAuthService } from "./firebase.service";

@Module({
  imports: [ConfigModule],
  providers: [FirebaseAuthService],
  exports: [FirebaseAuthService],
})
export class FirebaseModule implements OnModuleInit {
  constructor(private configService: ConfigService) {}

  onModuleInit() {
    // Firebase Admin SDKの初期化
    // 方法1: サービスアカウントJSONファイルを使用
    const serviceAccount = this.configService.get("FIREBASE_SERVICE_ACCOUNT") as string;

    if (!serviceAccount) {
      throw new InternalServerErrorException("Firebase service account info is not set in Env");
    }

    // 環境変数からJSONを取得する場合（Base64でエンコードされている場合）
    try {
      // Base64デコードして元のJSONに戻す
      const decodedServiceAccount: string = JSON.parse(
        Buffer.from(serviceAccount, "base64").toString("utf8")
      );

      admin.initializeApp({
        credential: admin.credential.cert(decodedServiceAccount),
      });
    } catch (error) {
      console.error("Firebase初期化エラー:", error.message);
      throw error;
    }
  }
}
