import { Test, TestingModule } from "@nestjs/testing";
import { AuthController } from "./auth.controller";
import { User } from "../../domain/user/entities/user.entity";
import { CommandBus } from "@nestjs/cqrs";
import { RegisterUserDto } from "../../application/auth/dto/register-user.dto";

describe("AuthController", () => {
  let controller: AuthController;
  let commandBus: jest.Mocked<CommandBus>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: CommandBus,
          useValue: {
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    commandBus = module.get(CommandBus);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("getMe", () => {
    it("should return user information", async () => {
      const result = await controller.getMe();
      expect(result).toBeDefined();
      expect(result.success).toBe(true);
      expect(result.status).toBe(200);
      expect(result.data).toBeInstanceOf(User);
      expect(result.message).toBe("ユーザー取得が完了しました");
    });
  });

  describe("register", () => {
    it("should register a new user", async () => {
      const registerDto: RegisterUserDto = {
        email: "test@example.com",
        name: "TestUser",
        firebaseToken: "valid-firebase-token",
      };

      const mockUser = User.create(
        "abcDEFGHIJKLmnopqrSTUVwxYZ123456789",
        "test@example.com",
        "TestUser",
        "a1b2c3d4e5f6g7h8i9j0k1l2m3n4",
        "https://example.com/avatar.jpg"
      );

      const mockResult = {
        user: mockUser,
        token: "jwt-token",
      };

      commandBus.execute.mockResolvedValue(mockResult);

      const result = await controller.register(registerDto);

      expect(result).toBeDefined();
      expect(result.success).toBe(true);
      expect(result.status).toBe(201);
      expect(result.data).toEqual({
        token: "jwt-token",
        user: {
          id: mockUser.id,
          email: mockUser.email,
          name: mockUser.name,
          imageUrl: mockUser.imageUrl,
        },
      });
      expect(result.message).toBe("ユーザー登録が完了しました");
    });
  });

  describe("login", () => {
    it("should login user", async () => {
      const mockUser = User.create(
        "abcDEFGHIJKLmnopqrSTUVwxYZ123456789",
        "test@example.com",
        "TestUser",
        "a1b2c3d4e5f6g7h8i9j0k1l2m3n4",
        "https://example.com/avatar.jpg"
      );

      const mockResult = {
        user: mockUser,
        token: "jwt-token",
      };

      commandBus.execute.mockResolvedValue(mockResult);

      const result = await controller.login({ firebaseToken: "valid-firebase-token" });
      expect(result).toBeDefined();
      expect(result.success).toBe(true);
      expect(result.status).toBe(200);
      expect(result.data).toEqual({
        user: {
          id: mockUser.id,
          email: mockUser.email,
          name: mockUser.name,
          imageUrl: mockUser.imageUrl,
        },
        token: "jwt-token",
      });
      expect(result.message).toBe("ログインに成功しました");
    });
  });

  describe("googleLogin", () => {
    it("should login with Google", async () => {
      const result = await controller.googleLogin();
      expect(result).toBeDefined();
      expect(result.success).toBe(true);
      expect(result.status).toBe(200);
      expect(result.data).toBeInstanceOf(User);
      expect(result.message).toBe("Googleログインに成功しました");
    });
  });
});
