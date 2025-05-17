// src/common/filters/global-exception.filter.ts

import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from "@nestjs/common";
import { ApiResponseWrapper } from "../responses/api-responses";

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger("GlobalExceptionFilter");

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    // デフォルトエラー情報
    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = "内部サーバーエラーが発生しました";
    let errorCode = "INTERNAL_SERVER_ERROR";
    let errorDetails: { validationErrors?: string[] } | undefined = undefined;

    // 例外の種類に応じた処理
    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === "object") {
        // NestJSの例外レスポンスからデータを抽出
        const exceptionObject = exceptionResponse as any;
        message = exceptionObject.message || exception.message;

        // エラーコードの抽出（もしあれば）
        errorCode = exceptionObject.code || this.getErrorCodeFromStatus(statusCode);

        // ValidationPipeからのバリデーションエラーの処理
        if (Array.isArray(exceptionObject.message)) {
          errorDetails = { validationErrors: exceptionObject.message };
          message = "バリデーションエラーが発生しました";
          errorCode = "VALIDATION_ERROR";
        }
      } else {
        message = exceptionResponse;
        errorCode = this.getErrorCodeFromStatus(statusCode);
      }
    } else if (exception instanceof Error) {
      // 通常のJavaScriptエラー
      message =
        process.env.NODE_ENV === "production"
          ? "内部サーバーエラーが発生しました"
          : exception.message;
    }

    // エラーをログに記録
    this.logger.error(
      `${request.method} ${request.url} - ${statusCode}: ${message}`,
      exception instanceof Error ? exception.stack : ""
    );

    // 統一されたエラーレスポンスを返す
    const errorResponse = ApiResponseWrapper.error(message, errorCode, statusCode, errorDetails);

    response.status(statusCode).json(errorResponse);
  }

  // HTTPステータスコードからエラーコードを取得
  private getErrorCodeFromStatus(status: number): string {
    const errorCodes: Record<number, string> = {
      400: "BAD_REQUEST",
      401: "UNAUTHORIZED",
      403: "FORBIDDEN",
      404: "NOT_FOUND",
      409: "CONFLICT",
      422: "UNPROCESSABLE_ENTITY",
      500: "INTERNAL_SERVER_ERROR",
    };

    return errorCodes[status] ?? "UNKNOWN_ERROR";
  }
}
