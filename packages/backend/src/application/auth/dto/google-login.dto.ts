import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class GoogleLoginDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: "トークンは必須です" })
  token: string;
}
