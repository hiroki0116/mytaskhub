import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { registerSchema } from "@/lib/validations";
import { register } from "@/lib/api";
import { setAuth } from "@/lib/auth";
import {
  showSuccessToast,
  showErrorToast,
  showLoadingToast,
  dismissToast,
} from "@/lib/toast";
import type { RegisterRequest } from "@/types/auth";

export function useRegisterForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterRequest>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterRequest) => {
    let toastId: string | number | undefined;
    try {
      setIsLoading(true);
      toastId = showLoadingToast("登録中...");
      const response = await register(data);
      setAuth(response.token, response.user);
      dismissToast(toastId);
      showSuccessToast("登録に成功しました");
      router.push("/dashboard");
    } catch {
      if (toastId) {
        dismissToast(toastId);
      }
      showErrorToast("登録に失敗しました");
      setIsLoading(false);
    }
  };

  return {
    registerField,
    handleSubmit,
    errors,
    isLoading,
    onSubmit,
  };
}
