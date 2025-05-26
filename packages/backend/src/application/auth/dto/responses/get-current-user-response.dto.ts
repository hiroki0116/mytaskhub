import { User } from "../../../../domain/user/entities/user.entity";

export class GetCurrentUserResponseDto {
  id: string;
  email: string;
  name: string;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
  constructor(
    id: string,
    email: string,
    name: string,
    createdAt: Date,
    updatedAt: Date,
    imageUrl?: string
  ) {
    this.id = id;
    this.email = email;
    this.name = name;
    this.imageUrl = imageUrl;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static fromEntity(user: User) {
    return new GetCurrentUserResponseDto(
      user.id,
      user.email,
      user.name,
      user.createdAt,
      user.updatedAt,
      user.imageUrl ?? undefined
    );
  }
}
