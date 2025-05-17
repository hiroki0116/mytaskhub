export interface ApiResponse<T> {
  status: number;
  success: boolean;
  message: string;
  data?: T;
  error?: ApiError;
  timestamp: string;
}

export interface ApiError {
  code: string;
  details: string;
}
