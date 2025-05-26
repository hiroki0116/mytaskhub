import { Test, TestingModule } from "@nestjs/testing";
import { GetCurrentUserHandler } from "./get-current-user.handler";
import { GetCurrentUserQuery } from "../queries/get-current-user.query";
import {
  IUserRepository,
  USER_REPOSITORY,
} from "../../../domain/user/repositories/user.reposiroty.interface";
import { User } from "../../../domain/user/entities/user.entity";
import { NotFoundException } from "@nestjs/common";

describe("GetCurrentUserHandler", () => {
  let handler: GetCurrentUserHandler;
  let userRepository: jest.Mocked<IUserRepository>;

  const mockUser = User.create(
    "abcDEFGHIJKLmnopqrSTUVwxYZ123456789",
    "test@example.com",
    "TestUser",
    "a1b2c3d4e5f6g7h8i9j0k1l2m3n4",
    "https://example.com/avatar.jpg"
  );

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetCurrentUserHandler,
        {
          provide: USER_REPOSITORY,
          useValue: {
            findById: jest.fn(),
          },
        },
      ],
    }).compile();

    handler = module.get<GetCurrentUserHandler>(GetCurrentUserHandler);
    userRepository = module.get(USER_REPOSITORY);
  });

  it("should be defined", () => {
    expect(handler).toBeDefined();
  });

  describe("execute", () => {
    it("should return user when user exists", async () => {
      const query = new GetCurrentUserQuery("abcDEFGHIJKLmnopqrSTUVwxYZ123456789");

      userRepository.findById.mockResolvedValue(mockUser);

      const result = await handler.execute(query);

      expect(result).toEqual({
        id: mockUser.id,
        email: mockUser.email,
        name: mockUser.name,
        imageUrl: mockUser.imageUrl,
        createdAt: mockUser.createdAt,
        updatedAt: mockUser.updatedAt,
      });

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(userRepository.findById).toHaveBeenCalledWith("abcDEFGHIJKLmnopqrSTUVwxYZ123456789");
    });

    it("should throw NotFoundException when user does not exist", async () => {
      const query = new GetCurrentUserQuery("non-existent-id");

      userRepository.findById.mockResolvedValue(null);

      await expect(handler.execute(query)).rejects.toThrow(
        new NotFoundException("ユーザーが見つかりません")
      );

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(userRepository.findById).toHaveBeenCalledWith("non-existent-id");
    });
  });
});
