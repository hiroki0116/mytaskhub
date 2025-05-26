import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class LoginDto {
  @ApiProperty({ example: "firebaseToken" })
  @IsString({ message: "firebaseトークンは文字列である必要があります" })
  @IsNotEmpty({ message: "firebaseトークンが必要です" })
  firebaseToken: string;
}
