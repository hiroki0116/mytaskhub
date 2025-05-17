import { Test, TestingModule } from "@nestjs/testing";
import { AuthController } from "./auth.controller";
import { User } from "../../domain/user/entities/user.entity";

describe("AuthController", () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
    }).compile();

    controller = module.get<AuthController>(AuthController);
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
      const result = await controller.register();
      expect(result).toBeDefined();
      expect(result.success).toBe(true);
      expect(result.status).toBe(201);
      expect(result.data).toBeInstanceOf(User);
      expect(result.message).toBe("ユーザー登録が完了しました");
    });
  });

  describe("login", () => {
    it("should login user", async () => {
      const result = await controller.login();
      expect(result).toBeDefined();
      expect(result.success).toBe(true);
      expect(result.status).toBe(200);
      expect(result.data).toBeInstanceOf(User);
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
