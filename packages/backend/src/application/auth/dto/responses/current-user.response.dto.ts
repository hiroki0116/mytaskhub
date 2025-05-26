import { User } from "../../../../domain/user/entities/user.entity";
import { UserDto } from "../user.dto";

export class CurrentUserResponseDto {
  user: UserDto;

  constructor(user: UserDto) {
    this.user = user;
  }

  static fromEntity(user: User): CurrentUserResponseDto {
    return new CurrentUserResponseDto(UserDto.fromEntity(user));
  }
}
