import { Controller, Get, HttpStatus, Post, UseGuards } from "@nestjs/common";
import { ApiResponseWrapper } from "../../common/responses/api-responses";
import { User } from "../../domain/user/entities/user.entity";
import { JwtAuthGuard } from "../../infrastructure/authentication/guards/jwt-auth.guard";
import { Public } from "../../common/decorators/public.decorator";

@UseGuards(JwtAuthGuard)
@Controller("auth")
export class AuthController {
  @Get("me")
  async getMe() {
    // TODO: 実際のユーザー取得ロジックを実装
    await new Promise((resolve) => setTimeout(resolve, 0));
    const user = User.create(
      "1234567890",
      "test@example.com",
      "johndoe",
      "aBcD1234_EfGh5678-IjKlMnOpQr"
    );

    // ApiResponseInterceptorがあればこの明示的な変換は不要になる
    return ApiResponseWrapper.success(user, "ユーザー取得が完了しました", HttpStatus.OK);
  }

  @Public()
  @Post("register")
  async register() {
    // TODO: 実際のユーザー取得ロジックを実装
    await new Promise((resolve) => setTimeout(resolve, 0));
    const user = User.create(
      "1234567890",
      "test@example.com",
      "johndoe",
      "aBcD1234_EfGh5678-IjKlMnOpQr"
    );

    // ApiResponseInterceptorがあればこの明示的な変換は不要になる
    return ApiResponseWrapper.success(user, "ユーザー登録が完了しました", HttpStatus.CREATED);
  }

  @Post("login")
  async login() {
    // TODO: 実際のユーザー取得ロジックを実装
    await new Promise((resolve) => setTimeout(resolve, 0));
    const user = User.create(
      "1234567890",
      "test@example.com",
      "johndoe",
      "aBcD1234_EfGh5678-IjKlMnOpQr"
    );

    // ApiResponseInterceptorがあればこの明示的な変換は不要になる
    return ApiResponseWrapper.success(user, "ログインに成功しました", HttpStatus.OK);
  }

  @Post("google-login")
  async googleLogin() {
    // TODO: 実際のユーザー取得ロジックを実装
    await new Promise((resolve) => setTimeout(resolve, 0));
    const user = User.create(
      "1234567890",
      "test@example.com",
      "johndoe",
      "aBcD1234_EfGh5678-IjKlMnOpQr"
    );

    // ApiResponseInterceptorがあればこの明示的な変換は不要になる
    return ApiResponseWrapper.success(user, "Googleログインに成功しました", HttpStatus.OK);
  }
}
