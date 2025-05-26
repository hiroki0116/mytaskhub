import { User } from "../../../domain/user/entities/user.entity";

export class UserDto {
  id: string;
  name: string;
  email: string;
  imageUrl?: string | null;

  constructor(id: string, name: string, email: string, imageUrl?: string | null) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.imageUrl = imageUrl;
  }

  static fromEntity(user: User): UserDto {
    return new UserDto(user.id, user.name, user.email, user?.imageUrl);
  }
}
