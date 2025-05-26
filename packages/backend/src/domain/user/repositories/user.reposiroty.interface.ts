import { User } from "../entities/user.entity";

export interface IUserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findByFirebaseUid(firebaseUid: string): Promise<User | null>;
  save(user: User): Promise<User>;
}

export const USER_REPOSITORY = "USER_REPOSITORY";
