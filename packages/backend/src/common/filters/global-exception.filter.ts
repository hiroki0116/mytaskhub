// src/common/filters/global-exception.filter.ts

import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from "@nestjs/common";
import { Request, Response } from "express";

@Catch() // 引数なしで指定すると、すべての例外をキャッチする
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger("GlobalExceptionFilter");

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // HTTPステータスコードの決定
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = "内部サーバーエラーが発生しました";
    let details: any = undefined;

    // 例外の種類ごとに処理を分ける
    if (exception instanceof HttpException) {
      // NestJSの標準HttpException
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === "object") {
        message = (exceptionResponse as any).message || exception.message;

        // ValidationPipeからのエラーデータを保持
        if ((exceptionResponse as any).message instanceof Array) {
          details = { errors: (exceptionResponse as any).message };
          message = "リクエストデータのバリデーションに失敗しました";
        }
      } else {
        message = exceptionResponse;
      }
    } else if (exception instanceof Error) {
      // Errorオブジェクトの場合
      message =
        process.env.NODE_ENV === "production"
          ? "内部サーバーエラーが発生しました"
          : exception.message;
    }

    // エラーをログに記録
    this.logger.error(
      `${request.method} ${request.url} - ${status}: ${message}`,
      exception instanceof Error ? exception.stack : ""
    );

    // クライアントにレスポンスを返す
    response.status(status).json({
      statusCode: status,
      message,
      details,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
