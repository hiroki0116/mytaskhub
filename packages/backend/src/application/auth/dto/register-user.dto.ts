import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";

export class RegisterUserDto {
  @ApiProperty({ example: "user@example.com" })
  @IsEmail({}, { message: "有効なメールアドレスを入力してください" })
  @IsNotEmpty({ message: "メールアドレスは必須です" })
  email: string;

  @ApiProperty({ example: "山田太郎" })
  @IsString({ message: "名前は文字列である必要があります" })
  @IsNotEmpty({ message: "名前は必須です" })
  name: string;

  @ApiProperty({ required: false, description: "Googleから登録した場合はパスワード不要" })
  @IsString()
  @IsOptional()
  @MinLength(6, { message: "パスワードは6文字以上である必要があります" })
  password?: string;

  @ApiProperty({
    required: false,
    example:
      "eyJhbGciOiJSUzI1NiIsImtpZCI6IjEyMzQ1Njc4OTAifQ.eyJpc3MiOiJodHRwczovL2lkZW50aXR5LmZpcmViYXNlYXBwLmNvbS8iLCJhdWQiOiJteS1hcHAtMTIzNDUiLCJhdXRoX3RpbWUiOjE2ODYwMDAwMDAsInVz",
    description: "Googleから登録をした場合、そこで生成されたtokenを使用する",
  })
  @IsString()
  @IsOptional()
  firebaseToken: string;
}
