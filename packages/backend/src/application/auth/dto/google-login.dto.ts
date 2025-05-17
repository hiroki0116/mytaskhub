import { IsNotEmpty, IsString } from "class-validator";

export class GoogleLoginDto {
  @IsString()
  @IsNotEmpty({ message: "トークンが必要です" })
  token: string;
}
