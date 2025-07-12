"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRegisterForm } from "./hooks";
import { showErrorToast } from "@/lib/toast";

export function RegisterForm() {
  const { registerField, handleSubmit, errors, isLoading, onSubmit } =
    useRegisterForm();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium leading-6 text-gray-900"
        >
          お名前
        </label>
        <div className="mt-2">
          <Input
            id="name"
            type="text"
            autoComplete="name"
            {...registerField("name")}
            aria-invalid={!!errors.name}
          />
          {errors.name && (
            <p className="mt-2 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>
      </div>

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium leading-6 text-gray-900"
        >
          メールアドレス
        </label>
        <div className="mt-2">
          <Input
            id="email"
            type="email"
            autoComplete="email"
            {...registerField("email")}
            aria-invalid={!!errors.email}
          />
          {errors.email && (
            <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium leading-6 text-gray-900"
        >
          パスワード
        </label>
        <div className="mt-2">
          <Input
            id="password"
            type="password"
            autoComplete="new-password"
            {...registerField("password")}
            aria-invalid={!!errors.password}
          />
          {errors.password && (
            <p className="mt-2 text-sm text-red-600">
              {errors.password.message}
            </p>
          )}
        </div>
      </div>

      <div>
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              登録中...
            </>
          ) : (
            "新規登録"
          )}
        </Button>
      </div>

      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-2 text-gray-500">または</span>
          </div>
        </div>

        <div className="mt-6">
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => {
              // TODO: Googleログインの実装
              showErrorToast("Googleログインは現在準備中です");
            }}
          >
            <svg
              className="mr-2 h-5 w-5"
              aria-hidden="true"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
            </svg>
            Googleで登録
          </Button>
        </div>
      </div>

      <div className="text-center text-sm">
        <span className="text-gray-600">すでにアカウントをお持ちの方は</span>{" "}
        <Link
          href="/login"
          className="font-medium text-indigo-600 hover:text-indigo-500"
        >
          ログイン
        </Link>
      </div>

      <div className="text-center text-xs text-gray-500">
        <p>
          登録することで、
          <Link
            href="/terms"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            利用規約
          </Link>
          と
          <Link
            href="/privacy"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            プライバシーポリシー
          </Link>
          に同意したことになります。
        </p>
      </div>
    </form>
  );
}
