import {
  Controller,
  Get,
  Param,
  HttpException,
  HttpStatus,
  NotFoundException,
} from "@nestjs/common";

@Controller("users")
export class UserController {
  @Get(":id")
  async getUser(@Param("id") id: string) {
    try {
      // TODO: 実際のユーザー取得ロジックを実装
      await new Promise((resolve) => setTimeout(resolve, 0));
      throw new NotFoundException(`ユーザーが見つかりません (ID: ${id})`);
      return {
        id,
        message: "User retrieved successfully",
      };
    } catch (error) {
      console.error(error);
      throw new HttpException("Failed to retrieve user", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
