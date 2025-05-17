import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class RegisterUserDto {
  @ApiProperty({
    example: "test@example.com",
    description: "ユーザーのメールアドレス",
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: "John Doe",
    description: "ユーザーの名前",
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: "firebaseToken",
    description: "ファイヤーベースのトークン",
  })
  @IsString()
  @IsNotEmpty({ message: "Firebaseトークンは必須です" })
  firebaseToken: string;

  @ApiProperty({
    example: "https://example.com/image.png",
    description: "ユーザーのプロフィール画像URL",
    required: false,
  })
  @IsString()
  @IsOptional()
  imageUrl?: string;
}
