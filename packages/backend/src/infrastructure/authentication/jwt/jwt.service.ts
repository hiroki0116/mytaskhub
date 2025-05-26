import { Injectable } from "@nestjs/common";
import { JwtService as NestJwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { User } from "../../../domain/user/entities/user.entity";

interface JwtPayload {
  sub: string;
  email: string;
  iat?: number;
  exp?: number;
}

@Injectable()
export class JwtService {
  constructor(
    private readonly jwtService: NestJwtService,
    private readonly configService: ConfigService
  ) {}

  generateToken(user: User): string {
    const payload: JwtPayload = {
      sub: user.id, // JWTの主体（ユーザーID）
      email: user.email,
    };

    const secret = this.configService.get<string>("JWT_SECRET");
    if (!secret) {
      throw new Error("JWT_SECRET is not defined");
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.jwtService.sign(payload, {
      secret,
      expiresIn: this.configService.get<string>("JWT_EXPIRES_IN") || "1d",
    });
  }

  verifyToken(token: string): JwtPayload | null {
    try {
      const secret = this.configService.get<string>("JWT_SECRET");
      if (!secret) {
        throw new Error("JWT_SECRET is not defined");
      }

      const payload = this.jwtService.verify(token, { secret });
      return payload as JwtPayload;
    } catch {
      return null;
    }
  }
}
