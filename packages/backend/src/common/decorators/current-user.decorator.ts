import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { User } from "../../domain/user/entities/user.entity";

// オーバーロード定義
export function CurrentUser(): ParameterDecorator;
export function CurrentUser<K extends keyof User>(key: K): ParameterDecorator;
export function CurrentUser<K extends keyof User>(key?: K) {
  return createParamDecorator((data: K | undefined, ctx: ExecutionContext): User | User[K] => {
    const request = ctx.switchToHttp().getRequest();
    const user: User = request.user;

    if (data) {
      return user[data];
    }

    return user;
  })(key);
}
