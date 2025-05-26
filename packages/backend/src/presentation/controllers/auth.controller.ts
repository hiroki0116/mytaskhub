import { Body, Controller, Get, HttpStatus, Post, UseGuards } from "@nestjs/common";
import { ApiResponseWrapper } from "../../common/responses/api-responses";
import { User } from "../../domain/user/entities/user.entity";
import { JwtAuthGuard } from "../../infrastructure/authentication/guards/jwt-auth.guard";
import { Public } from "../../common/decorators/public.decorator";
import { ApiTags } from "@nestjs/swagger";
import { CommandBus } from "@nestjs/cqrs";
import { RegisterUserDto } from "../../application/auth/dto/register-user.dto";
import { RegisterUserCommand } from "../../application/auth/commands/register-user.command";
import { LoginUserCommand } from "../../application/auth/commands/login-user.command";
import { LoginDto } from "../../application/auth/dto/login.dto";

@ApiTags("認証")
@UseGuards(JwtAuthGuard)
@Controller("auth")
export class AuthController {
  constructor(private readonly commandBus: CommandBus) {}

  @Get("me")
  async getMe() {
    // TODO: 実際のユーザー取得ロジックを実装
    await new Promise((resolve) => setTimeout(resolve, 0));
    const user = User.create(
      "abcDEFGHIJKLmnopqrSTUVwxYZ1",
      "test@example.com",
      "johndoe",
      "aBcD1234_EfGh5678-IjKlMnOpQr"
    );

    // ApiResponseInterceptorがあればこの明示的な変換は不要になる
    return ApiResponseWrapper.success(user, "ユーザー取得が完了しました", HttpStatus.OK);
  }

  @Public()
  @Post("register")
  async register(@Body() registerDto: RegisterUserDto) {
    const { email, name, firebaseToken, password } = registerDto;

    const result = await this.commandBus.execute(
      new RegisterUserCommand(email, name, firebaseToken, password)
    );
    return ApiResponseWrapper.success(
      {
        token: result.token,
        user: {
          id: result.user.id,
          email: result.user.email,
          name: result.user.name,
          imageUrl: result.user.imageUrl,
        },
      },
      "ユーザー登録が完了しました",
      HttpStatus.CREATED
    );
  }

  @Public()
  @Post("login")
  async login(@Body() loginDto: LoginDto) {
    const { firebaseToken } = loginDto;

    const result = await this.commandBus.execute(new LoginUserCommand(firebaseToken));

    return ApiResponseWrapper.success(
      {
        user: {
          id: result.user.id,
          email: result.user.email,
          name: result.user.name,
          imageUrl: result.user.imageUrl,
        },
        token: result.token,
      },
      "ログインに成功しました",
      HttpStatus.OK
    );
  }

  @Post("google-login")
  async googleLogin() {
    // TODO: 実際のユーザー取得ロジックを実装
    await new Promise((resolve) => setTimeout(resolve, 0));
    const user = User.create(
      "abcDEFGHIJKLmnopqrSTUVwxYZ1",
      "test@example.com",
      "johndoe",
      "aBcD1234_EfGh5678-IjKlMnOpQr"
    );

    // ApiResponseInterceptorがあればこの明示的な変換は不要になる
    return ApiResponseWrapper.success(user, "Googleログインに成功しました", HttpStatus.OK);
  }
}
