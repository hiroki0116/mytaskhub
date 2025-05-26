import { Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiResponseWrapper } from "../../../common/responses/api-responses";
import { IS_PUBLIC_KEY } from "../../../common/decorators/public.decorator";
import { ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    // Public デコレーターが付いているかチェック
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // Public の場合は認証をスキップ
    if (isPublic) {
      return true;
    }

    // それ以外は通常の認証を実行
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any): any {
    if (err || !user) {
      throw (
        err ||
        new UnauthorizedException(
          ApiResponseWrapper.error("ログインをしてください", "UNAUTHORIZED", 401, null)
        )
      );
    }
    return user;
  }
}
