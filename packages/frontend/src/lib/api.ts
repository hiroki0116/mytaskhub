import { ApiResponse } from "@/types/api";
import { AuthResponse, LoginRequest, RegisterRequest } from "../types/auth";
import { FirebaseAuthService } from "./firebaseAuth";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function register(data: RegisterRequest): Promise<AuthResponse> {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  const resJson: ApiResponse<AuthResponse> = await response.json();
  if (!resJson.success) {
    throw new Error("登録に失敗しました");
  }
  return resJson.data;
}

export async function login(data: LoginRequest): Promise<AuthResponse> {
  const firebaseToken = await FirebaseAuthService.signInAndGetToken(
    data.email,
    data.password
  );
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ firebaseToken }),
  });
  const resJson: ApiResponse<AuthResponse> = await response.json();
  if (!resJson.success) {
    throw new Error(resJson.message || "ログインに失敗しました");
  }
  return resJson.data;
}

export async function getMe(token: string) {
  const response = await fetch(`${API_URL}/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error("認証情報の取得に失敗しました");
  }
  return response.json();
}
