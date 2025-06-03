"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { loginSchema } from "@/lib/validations";
import { login } from "@/lib/api";
import { setAuth } from "@/lib/auth";
import {
  showSuccessToast,
  showErrorToast,
  showLoadingToast,
  dismissToast,
} from "@/lib/toast";
import type { LoginRequest } from "@/types/auth";

export const useLoginForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginRequest>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginRequest) => {
    try {
      setIsLoading(true);
      const toastId = showLoadingToast("ログイン中...");
      const response = await login(data);
      setAuth(response.token, response.user);
      dismissToast(toastId);
      showSuccessToast("ログインに成功しました");
      router.push("/dashboard");
    } catch {
      showErrorToast("ログインに失敗しました");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    register,
    handleSubmit,
    onSubmit,
    errors,
  };
};
