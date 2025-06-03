/**
 * APIレスポンスの型定義
 */
export type ApiResponse<T> = {
  status: number;
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
};
