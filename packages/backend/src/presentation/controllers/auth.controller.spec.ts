import { Test, TestingModule } from "@nestjs/testing";
import { AuthController } from "./auth.controller";
import { User } from "../../domain/user/entities/user.entity";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { RegisterUserDto } from "../../application/auth/dto/register-user.dto";
import { CurrentUserResponseDto } from "../../application/auth/dto/responses/current-user.response.dto";
import { RegisterUserResponseDto } from "../../application/auth/dto/responses/register-user.response.dto";
import { LoginUserResponseDto } from "../../application/auth/dto/responses/login-user.response.dto";

describe("AuthController", () => {
  let controller: AuthController;
  let commandBus: jest.Mocked<CommandBus>;
  let queryBus: jest.Mocked<QueryBus>;

  const mockUser = User.create(
    "abcDEFGHIJKLmnopqrSTUVwxYZ123456789",
    "test@example.com",
    "TestUser",
    "a1b2c3d4e5f6g7h8i9j0k1l2m3n4",
    "https://example.com/avatar.jpg"
  );

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
        {
          provide: QueryBus,
          useValue: {
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    commandBus = module.get(CommandBus);
    queryBus = module.get(QueryBus);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("getMe", () => {
    it("should return user information", async () => {
      const mockResponse = CurrentUserResponseDto.fromEntity(mockUser);

      queryBus.execute.mockResolvedValue(mockResponse);

      const result = await controller.getMe(mockUser);

      expect(result).toBeDefined();
      expect(result.success).toBe(true);
      expect(result.status).toBe(200);
      expect(result.data).toEqual(mockResponse);
      expect(result.message).toBe("ユーザー取得が完了しました");
    });

    it("should handle user without imageUrl", async () => {
      const userWithoutImage = User.create(
        "abcDEFGHIJKLmnopqrSTUVwxYZ123456789",
        "test@example.com",
        "TestUser",
        "a1b2c3d4e5f6g7h8i9j0k1l2m3n4"
      );

      const mockResponse = CurrentUserResponseDto.fromEntity(userWithoutImage);

      queryBus.execute.mockResolvedValue(mockResponse);

      const result = await controller.getMe(userWithoutImage);

      expect(result).toBeDefined();
      expect(result.success).toBe(true);
      expect(result.status).toBe(200);
      expect(result.data).toEqual(mockResponse);
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

      const mockResponse: RegisterUserResponseDto = {
        token: "jwt-token",
        user: {
          id: mockUser.id,
          email: mockUser.email,
          name: mockUser.name,
          imageUrl: mockUser.imageUrl,
        },
      };

      commandBus.execute.mockResolvedValue(mockResponse);

      const result = await controller.register(registerDto);

      expect(result).toBeDefined();
      expect(result.success).toBe(true);
      expect(result.status).toBe(201);
      expect(result.data).toEqual(mockResponse);
      expect(result.message).toBe("ユーザー登録が完了しました");
    });
  });

  describe("login", () => {
    it("should login user", async () => {
      const mockResponse: LoginUserResponseDto = {
        token: "jwt-token",
        user: {
          id: mockUser.id,
          email: mockUser.email,
          name: mockUser.name,
          imageUrl: mockUser.imageUrl,
        },
      };

      commandBus.execute.mockResolvedValue(mockResponse);

      const result = await controller.login({ firebaseToken: "valid-firebase-token" });
      expect(result).toBeDefined();
      expect(result.success).toBe(true);
      expect(result.status).toBe(200);
      expect(result.data).toEqual(mockResponse);
      expect(result.message).toBe("ログインに成功しました");
    });
  });
});
