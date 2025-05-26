import {
  IUserRepository,
  USER_REPOSITORY,
} from "../../../domain/user/repositories/user.reposiroty.interface";
import { User } from "../../../domain/user/entities/user.entity";
import { LoginUserHandler } from "./login-user.handler";
import { FirebaseAuthService } from "../../../infrastructure/authentication/firebase/firebase.service";
import { JwtService } from "../../../infrastructure/authentication/jwt/jwt.service";
import { Test, TestingModule } from "@nestjs/testing";
import { LoginUserCommand } from "../commands/login-user.command";
import { UnauthorizedException, InternalServerErrorException } from "@nestjs/common";

describe("LoginUserHandler", () => {
  let handler: LoginUserHandler;
  let userRepository: jest.Mocked<IUserRepository>;
  let firebaseAuthService: jest.Mocked<FirebaseAuthService>;
  let jwtService: jest.Mocked<JwtService>;

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
        LoginUserHandler,
        {
          provide: USER_REPOSITORY,
          useValue: {
            findByEmail: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: FirebaseAuthService,
          useValue: {
            verifyToken: jest.fn(),
            getUserByEmail: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            generateToken: jest.fn(),
          },
        },
      ],
    }).compile();

    handler = module.get<LoginUserHandler>(LoginUserHandler);
    userRepository = module.get(USER_REPOSITORY);
    firebaseAuthService = module.get(FirebaseAuthService);
    jwtService = module.get(JwtService);
  });

  it("should be defined", () => {
    expect(handler).toBeDefined();
  });

  describe("execute", () => {
    const execute = async (command: LoginUserCommand) => {
      return handler.execute(command);
    };

    it("should throw UnauthorizedException when no firebaseToken is provided", async () => {
      const command = new LoginUserCommand("");

      firebaseAuthService.verifyToken.mockRejectedValue(
        new UnauthorizedException("無効なfirebaseトークンです")
      );

      await expect(execute(command)).rejects.toThrow(
        new UnauthorizedException("無効なfirebaseトークンです")
      );
    });

    it("should login user with firebase token", async () => {
      const command = new LoginUserCommand("valid-firebase-token");

      const firebaseUser = {
        uid: "a1b2c3d4e5f6g7h8i9j0k1l2m3n4",
        email: "test@example.com",
        picture: "https://example.com/avatar.jpg",
      };

      firebaseAuthService.verifyToken.mockResolvedValue(firebaseUser);
      userRepository.findByEmail.mockResolvedValue(mockUser);
      jwtService.generateToken.mockReturnValue("jwt-token");

      const result = await execute(command);

      expect(result).toEqual({
        user: mockUser,
        token: "jwt-token",
      });

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(firebaseAuthService.verifyToken).toHaveBeenCalledWith("valid-firebase-token");
    });

    it("should throw UnauthorizedException when user is not found", async () => {
      const command = new LoginUserCommand("valid-firebase-token");

      const firebaseUser = {
        uid: "a1b2c3d4e5f6g7h8i9j0k1l2m3n4",
        email: "test@example.com",
        picture: "https://example.com/avatar.jpg",
      };

      firebaseAuthService.verifyToken.mockResolvedValue(firebaseUser);
      userRepository.findByEmail.mockResolvedValue(null);

      await expect(execute(command)).rejects.toThrow(
        new UnauthorizedException("ユーザーが見つかりません")
      );
    });

    it("should handle Firebase authentication errors", async () => {
      const command = new LoginUserCommand("invalid-token");

      firebaseAuthService.verifyToken.mockRejectedValue(
        new UnauthorizedException("無効なfirebaseトークンです")
      );

      await expect(execute(command)).rejects.toThrow(
        new UnauthorizedException("無効なfirebaseトークンです")
      );
    });

    it("should handle unexpected errors", async () => {
      const command = new LoginUserCommand("valid-token");

      firebaseAuthService.verifyToken.mockRejectedValue(new Error("予期せぬエラー"));

      await expect(execute(command)).rejects.toThrow(
        new InternalServerErrorException("認証処理中にエラーが発生しました")
      );
    });
  });
});
