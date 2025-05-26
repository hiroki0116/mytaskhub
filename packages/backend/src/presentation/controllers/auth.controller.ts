import { Body, Controller, Get, HttpStatus, Post, UseGuards } from "@nestjs/common";
import { ApiResponseWrapper } from "../../common/responses/api-responses";
import { JwtAuthGuard } from "../../infrastructure/authentication/guards/jwt-auth.guard";
import { Public } from "../../common/decorators/public.decorator";
import { ApiTags } from "@nestjs/swagger";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { RegisterUserDto } from "../../application/auth/dto/register-user.dto";
import { RegisterUserCommand } from "../../application/auth/commands/register-user.command";
import { LoginUserCommand } from "../../application/auth/commands/login-user.command";
import { LoginDto } from "../../application/auth/dto/login.dto";
import { ApiResponse } from "../../common/interfaces/api-response.interface";
import { CurrentUserResponseDto } from "../../application/auth/dto/responses/current-user.response.dto";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { User } from "../../domain/user/entities/user.entity";
import { GetCurrentUserQuery } from "../../application/auth/queries/get-current-user.query";
import { RegisterUserResponseDto } from "../../application/auth/dto/responses/register-user.response.dto";
import { LoginUserResponseDto } from "../../application/auth/dto/responses/login-user.response.dto";

@ApiTags("認証")
@UseGuards(JwtAuthGuard)
@Controller("auth")
export class AuthController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus
  ) {}

  @Get("me")
  async getMe(@CurrentUser() user: User): Promise<ApiResponse<CurrentUserResponseDto>> {
    const { id } = user;

    const userData = await this.queryBus.execute<GetCurrentUserQuery, CurrentUserResponseDto>(
      new GetCurrentUserQuery(id)
    );
    return ApiResponseWrapper.success(userData, "ユーザー取得が完了しました", HttpStatus.OK);
  }

  @Public()
  @Post("register")
  async register(
    @Body() registerDto: RegisterUserDto
  ): Promise<ApiResponse<RegisterUserResponseDto>> {
    const { email, name, firebaseToken, password } = registerDto;

    const result = await this.commandBus.execute<RegisterUserCommand, RegisterUserResponseDto>(
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

    const result = await this.commandBus.execute<LoginUserCommand, LoginUserResponseDto>(
      new LoginUserCommand(firebaseToken)
    );

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
}
