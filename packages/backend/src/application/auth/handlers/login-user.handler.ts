import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { LoginUserCommand } from "../commands/login-user.command";
import {
  IUserRepository,
  USER_REPOSITORY,
} from "../../../domain/user/repositories/user.reposiroty.interface";
import {
  Inject,
  UnauthorizedException,
  Logger,
  InternalServerErrorException,
} from "@nestjs/common";
import { FirebaseAuthService } from "../../../infrastructure/authentication/firebase/firebase.service";
import { User } from "src/domain/user/entities/user.entity";
import { JwtService } from "../../../infrastructure/authentication/jwt/jwt.service";

@CommandHandler(LoginUserCommand)
export class LoginUserHandler implements ICommandHandler<LoginUserCommand> {
  private readonly logger = new Logger(LoginUserHandler.name);

  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    private readonly firebaseAuthService: FirebaseAuthService,
    private readonly jwtService: JwtService
  ) {}

  async execute(command: LoginUserCommand): Promise<{ user: User; token: string }> {
    const { firebaseToken } = command;

    try {
      // firebaseトークンを検証
      const firebaseUser = await this.firebaseAuthService.verifyToken(firebaseToken);

      // メールアドレスでユーザーを検索
      const user = await this.userRepository.findByEmail(firebaseUser.email);

      if (!user) {
        throw new UnauthorizedException("ユーザーが見つかりません");
      }

      // ユーザーのトークンを生成
      const token = this.jwtService.generateToken(user);

      return { user, token };
    } catch (error: unknown) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }

      this.logger.error(`予期せぬエラー: ${JSON.stringify(error)}`);
      throw new InternalServerErrorException("認証処理中にエラーが発生しました");
    }
  }
}
