import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { IUserRepository } from "../../domain/user/repositories/user.reposiroty.interface";
import { User } from "../../domain/user/entities/user.entity";
import { UserMapper } from "../mappers/user.mapper";

@Injectable()
export class PrismaUserRepository implements IUserRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userMapper: UserMapper
  ) {}

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return null;
    }

    return this.userMapper.toDomain(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return null;
    }

    return this.userMapper.toDomain(user);
  }

  async findByFirebaseUid(firebaseUid: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { firebaseUid },
    });

    if (!user) {
      return null;
    }

    return this.userMapper.toDomain(user);
  }

  async save(user: User): Promise<User> {
    const data = this.userMapper.toPersistence(user);
    const savedUser = await this.prisma.user.upsert({
      where: { id: user.id },
      update: {
        email: data.email,
        name: data.name,
        firebaseUid: data.firebaseUid,
        imageUrl: data.imageUrl,
      },
      create: {
        id: data.id,
        email: data.email,
        name: data.name,
        firebaseUid: data.firebaseUid,
        imageUrl: data.imageUrl,
      },
    });

    return this.userMapper.toDomain(savedUser);
  }
}
