import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from "@nestjs/common";
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
  async verifyToken(token: string): Promise<FirebaseUserInfo> {
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

      switch (error.code) {
        case "auth/token-expired":
          throw new UnauthorizedException("トークンの有効期限が切れています");
        case "auth/user-disabled":
          throw new UnauthorizedException("アカウントが無効化されています");
        case "auth/argument-error":
        case "auth/invalid-token":
          throw new UnauthorizedException("無効なfirebaseトークンです");
        default:
          throw new UnauthorizedException("認証に失敗しました");
      }
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
      if (error.code) {
        switch (error.code) {
          case "auth/email-already-exists":
          case "auth/email-already-in-use":
            throw new ConflictException("このメールアドレスは既に使用されています");
          case "auth/invalid-email":
            throw new BadRequestException("無効なメールアドレス形式です");
          case "auth/weak-password":
            throw new BadRequestException("パスワードが弱すぎます。6文字以上にしてください");
          default:
            throw new InternalServerErrorException(`認証エラー: ${error.message}`);
        }
      }
      this.logger.error(`Firebase user creation error: ${JSON.stringify(error)}`);
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
