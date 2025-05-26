import { Injectable } from "@nestjs/common";
import { User as PrismaUser } from "@prisma/client";
import { User } from "../../domain/user/entities/user.entity";

@Injectable()
export class UserMapper {
  /**
   * Prismaのユーザーをドメインのユーザーに変換
   * @param prismaUser Prismaのユーザー
   * @returns ドメインのユーザー
   */
  toDomain(prismaUser: PrismaUser): User {
    return User.create(
      prismaUser.id,
      prismaUser.email,
      prismaUser.name,
      prismaUser.firebaseUid,
      prismaUser.imageUrl ?? undefined
    );
  }

  /**
   * ドメインのユーザーをPrismaのユーザーに変換
   * @param user ドメインのユーザー
   * @returns Prismaのユーザー
   */
  toPersistence(user: User): Omit<PrismaUser, "createdAt" | "updatedAt"> {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      firebaseUid: user.firebaseUid,
      imageUrl: user.imageUrl ?? null,
    };
  }
}
