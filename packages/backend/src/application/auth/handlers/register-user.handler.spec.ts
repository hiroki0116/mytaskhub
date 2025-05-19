import { Test, TestingModule } from "@nestjs/testing";
import { RegisterUserHandler } from "./register-user.handler";
import { RegisterUserCommand } from "../commands/register-user.command";
import {
  IUserRepository,
  USER_REPOSITORY,
} from "../../../domain/user/repositories/user.reposiroty.interface";
import { FirebaseAuthService } from "../../../infrastructure/authentication/firebase/firebase.service";
import { JwtService } from "../../../infrastructure/authentication/jwt/jwt.service";
import { User } from "../../../domain/user/entities/user.entity";
import { BadRequestException, ConflictException } from "@nestjs/common";

jest.mock("uuid", () => ({
  v4: jest.fn().mockReturnValue("abcDEFGHIJKLmnopqrSTUVwxYZ123456789"),
}));

describe("RegisterUserHandler", () => {
  let handler: RegisterUserHandler;
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
        RegisterUserHandler,
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
            createUser: jest.fn(),
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

    handler = module.get<RegisterUserHandler>(RegisterUserHandler);
    userRepository = module.get(USER_REPOSITORY);
    firebaseAuthService = module.get(FirebaseAuthService);
    jwtService = module.get(JwtService);
  });

  it("should be defined", () => {
    expect(handler).toBeDefined();
  });

  describe("execute", () => {
    const execute = async (command: RegisterUserCommand) => {
      return handler.execute(command);
    };

    it("should throw BadRequestException when neither firebaseToken nor password is provided", async () => {
      const command = new RegisterUserCommand("test@example.com", "TestUser", "", undefined);

      await expect(execute(command)).rejects.toThrow(BadRequestException);
    });

    it("should create new user with firebase token", async () => {
      const command = new RegisterUserCommand(
        "test@example.com",
        "TestUser",
        "valid-firebase-token",
        undefined
      );

      const firebaseUser = {
        uid: "a1b2c3d4e5f6g7h8i9j0k1l2m3n4",
        email: "test@example.com",
        picture: "https://example.com/avatar.jpg",
      };

      firebaseAuthService.verifyToken.mockResolvedValue(firebaseUser);
      userRepository.findByEmail.mockResolvedValue(null);
      userRepository.save.mockResolvedValue(mockUser);
      jwtService.generateToken.mockReturnValue("jwt-token");

      const result = await execute(command);

      expect(result).toEqual({
        user: mockUser,
        token: "jwt-token",
      });
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(firebaseAuthService.verifyToken).toHaveBeenCalledWith("valid-firebase-token");
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(userRepository.save).toHaveBeenCalled();
    });

    it("should create new user with password", async () => {
      const command = new RegisterUserCommand("test@example.com", "TestUser", "", "password123");

      const firebaseUser = {
        uid: "a1b2c3d4e5f6g7h8i9j0k1l2m3n4",
        email: "test@example.com",
        picture: "https://example.com/avatar.jpg",
      };

      firebaseAuthService.getUserByEmail.mockResolvedValue(null);
      firebaseAuthService.createUser.mockResolvedValue(firebaseUser);
      userRepository.findByEmail.mockResolvedValue(null);
      userRepository.save.mockResolvedValue(mockUser);
      jwtService.generateToken.mockReturnValue("jwt-token");

      const result = await execute(command);

      expect(result).toEqual({
        user: mockUser,
        token: "jwt-token",
      });
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(firebaseAuthService.createUser).toHaveBeenCalledWith(
        "test@example.com",
        "password123",
        "TestUser"
      );
    });

    it("should update existing user with new firebase UID", async () => {
      const command = new RegisterUserCommand(
        "test@example.com",
        "TestUser",
        "valid-firebase-token",
        undefined
      );

      const existingUser = User.create(
        "abcDEFGHIJKLmnopqrSTUVwxYZ123456789",
        "test@example.com",
        "TestUser",
        "a1b2c3d4e5f6g7h8i9j0k1l2m3n4",
        "https://example.com/old-avatar.jpg"
      );

      const firebaseUser = {
        uid: "a1b2c3d4e5f6g7h8i9j0k1l2m3n4",
        email: "test@example.com",
        picture: "https://example.com/new-avatar.jpg",
      };

      firebaseAuthService.verifyToken.mockResolvedValue(firebaseUser);
      userRepository.findByEmail.mockResolvedValue(existingUser);
      userRepository.save.mockResolvedValue(mockUser);
      jwtService.generateToken.mockReturnValue("jwt-token");

      const result = await execute(command);

      expect(result).toEqual({
        user: mockUser,
        token: "jwt-token",
      });
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(userRepository.save).toHaveBeenCalled();
    });

    it("should throw ConflictException when email already exists in Firebase", async () => {
      const command = new RegisterUserCommand("test@example.com", "TestUser", "", "password123");

      firebaseAuthService.getUserByEmail.mockResolvedValue({
        uid: "a1b2c3d4e5f6g7h8i9j0k1l2m3n4",
        email: "test@example.com",
      });

      await expect(execute(command)).rejects.toThrow(ConflictException);
    });

    it("should handle Firebase authentication errors", async () => {
      const command = new RegisterUserCommand("test@example.com", "TestUser", "", "password123");

      firebaseAuthService.getUserByEmail.mockRejectedValue({
        code: "auth/email-already-in-use",
        message: "Email already in use",
      });

      await expect(execute(command)).rejects.toThrow(ConflictException);
    });
  });
});
