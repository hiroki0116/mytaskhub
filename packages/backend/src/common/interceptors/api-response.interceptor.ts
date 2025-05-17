// src/common/interceptors/api-response.interceptor.ts

import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpStatus,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { ApiResponseWrapper } from "../responses/api-responses";
import { ApiResponse } from "../interfaces/api-response.interface";

@Injectable()
export class ApiResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<ApiResponse<unknown>> {
    return next.handle().pipe(
      map((data: unknown) => {
        const response = context.switchToHttp().getResponse();
        const statusCode = response.statusCode || HttpStatus.OK;

        // 既にApiResponse形式の場合はそのまま返す
        if (
          data &&
          typeof data === "object" &&
          "status" in data &&
          "success" in data &&
          "message" in data
        ) {
          return data as ApiResponse<unknown>;
        }

        // デフォルトメッセージを設定
        let message = "操作が成功しました";

        // ステータスコードに基づいてメッセージをカスタマイズ
        if (statusCode === HttpStatus.CREATED) {
          message = "リソースが正常に作成されました";
        }

        return ApiResponseWrapper.success(data, message, statusCode);
      })
    );
  }
}
