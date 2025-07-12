export interface User {
  id: string;
  email: string;
  name: string;
  imageUrl?: string;
  createdAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface GoogleAuthRequest {
  token: string;
}
