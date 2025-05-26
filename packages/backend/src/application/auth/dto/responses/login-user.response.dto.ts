import { User } from ".././../../../domain/user/entities/user.entity";
import { UserDto } from "../user.dto";

export class LoginUserResponseDto {
  token: string;
  user: UserDto;
  constructor(token: string, user: UserDto) {
    this.token = token;
    this.user = user;
  }

  static create(token: string, user: User) {
    return new LoginUserResponseDto(token, UserDto.fromEntity(user));
  }
}
