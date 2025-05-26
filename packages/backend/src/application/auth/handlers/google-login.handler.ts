// src/application/auth/handlers/google-login.handler.ts

import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { Inject, BadRequestException, InternalServerErrorException } from "@nestjs/common";
import { User } from "../../../domain/user/entities/user.entity";
import { JwtService } from "../../../infrastructure/authentication/jwt/jwt.service";
import { v4 as uuidv4 } from "uuid";
import { GoogleLoginCommand } from "../commands/google-login.command";
import {
  IUserRepository,
  USER_REPOSITORY,
} from "../../../domain/user/repositories/user.reposiroty.interface";
import { FirebaseAuthService } from "../../../infrastructure/authentication/firebase/firebase.service";

@CommandHandler(GoogleLoginCommand)
export class GoogleLoginHandler implements ICommandHandler<GoogleLoginCommand> {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    private readonly firebaseAuthService: FirebaseAuthService,
    private readonly jwtService: JwtService
  ) {}

  async execute(command: GoogleLoginCommand): Promise<{ user: User; token: string }> {
    try {
      const { token: firebaseToken } = command;
      // Firebaseトークンを検証
      const firebaseUser = await this.firebaseAuthService.verifyToken(firebaseToken);
      if (!firebaseUser) {
        throw new BadRequestException("無効なFirebaseトークンです");
      }

      // Firebaseから取得したメールアドレスがない場合
      if (!firebaseUser.email) {
        throw new BadRequestException("メールアドレスが取得できませんでした");
      }

      // ユーザーを検索
      let user = await this.userRepository.findByFirebaseUid(firebaseUser.uid);

      // Firebase UIDで見つからない場合はメールアドレスで検索
      if (!user) {
        user = await this.userRepository.findByEmail(firebaseUser.email);
      }

      // ユーザーが存在しない場合は新規作成
      if (!user) {
        user = User.create(
          uuidv4(),
          firebaseUser.email,
          firebaseUser.name || firebaseUser.email.split("@")[0],
          firebaseUser.uid,
          firebaseUser.picture
        );
      } else {
        // 既存ユーザーのFirebase UIDを更新（必要な場合）
        if (user.firebaseUid !== firebaseUser.uid) {
          user = User.create(
            user.id,
            user.email,
            user.name,
            firebaseUser.uid,
            firebaseUser.picture || user.imageUrl
          );
        }
      }

      // ユーザーを保存
      const savedUser = await this.userRepository.save(user);

      // JWTトークンを生成
      const jwtToken = this.jwtService.generateToken(savedUser);

      return { user: savedUser, token: jwtToken };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }

      throw new InternalServerErrorException(`認証エラー: ${error.message}`);
    }
  }
}
