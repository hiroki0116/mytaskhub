import { Injectable, Logger } from "@nestjs/common";
import * as admin from "firebase-admin";

export interface FirebaseUserInfo {
  uid: string;
  email: string;
  name?: string;
  picture?: string;
  emailVerified?: boolean;
}

@Injectable()
export class FirebaseAuthService {
  private readonly logger = new Logger(FirebaseAuthService.name);

  /**
   * Firebaseトークンを検証し、ユーザー情報を取得
   */
  async verifyToken(token: string): Promise<FirebaseUserInfo | null> {
    try {
      const decodedToken = await admin.auth().verifyIdToken(token);

      // ユーザー情報を取得
      const userRecord = await admin.auth().getUser(decodedToken.uid);

      return {
        uid: userRecord.uid,
        email: userRecord.email ?? "",
        name: userRecord.displayName ?? "",
        picture: userRecord.photoURL ?? "",
        emailVerified: userRecord.emailVerified,
      };
    } catch (error) {
      this.logger.error(`Firebase verifyTokenにてエラー: ${error.message}`);
      return null;
    }
  }

  /**
   * メールアドレスとパスワードで新規ユーザーをFirebase Authに作成
   */
  async createUser(
    email: string,
    password: string,
    displayName?: string
  ): Promise<FirebaseUserInfo | null> {
    try {
      const userRecord = await admin.auth().createUser({
        email,
        password,
        displayName,
        emailVerified: false,
      });

      return {
        uid: userRecord.uid,
        email: userRecord.email || "",
        name: userRecord.displayName || "",
        picture: userRecord.photoURL || "",
        emailVerified: userRecord.emailVerified,
      };
    } catch (error) {
      this.logger.error(`Firebase user creation error: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * メールアドレスでユーザーを検索
   */
  async getUserByEmail(email: string): Promise<FirebaseUserInfo | null> {
    try {
      const userRecord = await admin.auth().getUserByEmail(email);

      return {
        uid: userRecord.uid,
        email: userRecord.email || "",
        name: userRecord.displayName || "",
        picture: userRecord.photoURL || "",
        emailVerified: userRecord.emailVerified,
      };
    } catch (error) {
      if (error.code === "auth/user-not-found") {
        return null;
      }
      this.logger.error(`Firebase get user error: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Firebase UIDでユーザーを検索
   */
  async getUserByUid(uid: string): Promise<FirebaseUserInfo | null> {
    try {
      const userRecord = await admin.auth().getUser(uid);

      return {
        uid: userRecord.uid,
        email: userRecord.email || "",
        name: userRecord.displayName || "",
        picture: userRecord.photoURL || "",
        emailVerified: userRecord.emailVerified,
      };
    } catch (error) {
      if (error.code === "auth/user-not-found") {
        return null;
      }
      this.logger.error(`Firebase get user error: ${error.message}`, error.stack);
      throw error;
    }
  }
}
