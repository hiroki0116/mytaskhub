import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2, "2文字以上で入力してください"),
  email: z.string().email("有効なメールアドレスを入力してください"),
  password: z
    .string()
    .min(8, "8文字以上で入力してください")
    .regex(/[a-z]/, "小文字を含めてください")
    .regex(/[A-Z]/, "大文字を含めてください")
    .regex(/[0-9]/, "数字を含めてください"),
});

export const loginSchema = z.object({
  email: z.string().email("有効なメールアドレスを入力してください"),
  password: z.string().min(8, "8文字以上で入力してください"),
});
