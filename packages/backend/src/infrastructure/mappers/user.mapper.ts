import { Injectable } from "@nestjs/common";
import { User as PrismaUser } from "@prisma/client";
import { User } from "src/domain/user/entities/user.entity";

@Injectable()
export class UserMapper {
  toDomain(prismaUser: PrismaUser): User {
    return User.create(
      prismaUser.id as string,
      prismaUser.email as string,
      prismaUser.name as string,
      prismaUser.firebaseUid as string,
      prismaUser.imageUrl as string
    );
  }

  toPersistence(user: User): Omit<PrismaUser, "createdAt" | "updatedAt"> {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      firebaseUid: user.firebaseUid,
      imageUrl: user.imageUrl,
    };
  }
}
