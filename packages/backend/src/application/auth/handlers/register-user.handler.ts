import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { RegisterUserCommand } from "../commands/register-user.command";
import {
  BadRequestException,
  ConflictException,
  Inject,
  InternalServerErrorException,
} from "@nestjs/common";
import {
  IUserRepository,
  USER_REPOSITORY,
} from "../../../domain/user/repositories/user.reposiroty.interface";
import {
  FirebaseAuthService,
  FirebaseUserInfo,
} from "../../../infrastructure/authentication/firebase/firebase.service";
import { JwtService } from "../../../infrastructure/authentication/jwt/jwt.service";
import { User } from "../../../domain/user/entities/user.entity";
import { v4 as uuidv4 } from "uuid";

/**
 * ユーザー登録コマンドのハンドラー
 */
@CommandHandler(RegisterUserCommand)
export class RegisterUserHandler implements ICommandHandler<RegisterUserCommand> {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    private readonly firebaseAuthService: FirebaseAuthService,
    private readonly jwtService: JwtService
  ) {}

  async execute(command: RegisterUserCommand): Promise<{ user: User; token: string }> {
    const { email, name, firebaseToken, password } = command;
    try {
      let firebaseUser: FirebaseUserInfo | null = null;

      // Firebaseでのユーザー作成または検証
      if (!firebaseToken && !password) {
        throw new BadRequestException("パスワードまたはFirebaseトークンが必要です");
      }

      // Google認証を使用してユーザーを作成
      if (firebaseToken) {
        // Firebase トークンを検証
        firebaseUser = await this.firebaseAuthService.verifyToken(firebaseToken);
        if (!firebaseUser) {
          throw new BadRequestException("無効なFirebaseトークンです");
        }
      }

      // パスワード認証を使用してユーザーを作成
      if (password) {
        const exstingFirebaseUser = await this.firebaseAuthService.getUserByEmail(email);
        if (exstingFirebaseUser) {
          throw new ConflictException("このメールアドレスは既に使用されています");
        }

        firebaseUser = await this.firebaseAuthService.createUser(email, password, name);
      }

      if (!firebaseUser) {
        throw new InternalServerErrorException("Firebaseユーザー情報の取得に失敗しました");
      }

      // メールアドレスが自分のDBに存在するかチェック
      let user = await this.userRepository.findByEmail(email);

      if (user) {
        // 既存ユーザーのFirebase UIDを更新
        user = User.create(
          user.id,
          email,
          name || user.name,
          firebaseUser.uid,
          firebaseUser.picture || user.imageUrl
        );
      } else {
        // 新規ユーザー作成
        user = User.create(
          uuidv4(),
          email,
          name || email.split("@")[0], // 名前がない場合はメールの一部を使用
          firebaseUser.uid,
          firebaseUser.picture
        );
      }

      const savedUser = await this.userRepository.save(user);

      // JWTトークンを生成
      const token = this.jwtService.generateToken(savedUser);

      return { user: savedUser, token };
    } catch (error) {
      // Firebase認証エラーの変換
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
      throw error;
    }
  }
}
