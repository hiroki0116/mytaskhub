import { User } from ".././../../../domain/user/entities/user.entity";
import { UserDto } from "../user.dto";

export class RegisterUserResponseDto {
  token: string;
  user: UserDto;
  constructor(token: string, user: UserDto) {
    this.token = token;
    this.user = user;
  }

  static create(token: string, user: User) {
    return new RegisterUserResponseDto(token, UserDto.fromEntity(user));
  }
}
