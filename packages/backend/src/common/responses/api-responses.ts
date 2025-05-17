import { ApiResponse } from "../interfaces/api-response.interface";

export class ApiResponseWrapper {
  /**
   * 成功時のレスポンス
   */
  static success<T>(data: T, message = "Success", status = 200): ApiResponse<T> {
    return {
      status,
      success: true,
      message,
      data,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * エラー時のレスポンス
   */
  static error<T>(message: string, errorCode: string, status = 400, details?: any): ApiResponse<T> {
    return {
      status,
      success: false,
      message,
      error: {
        code: errorCode,
        details,
      },
      timestamp: new Date().toISOString(),
    };
  }
}
