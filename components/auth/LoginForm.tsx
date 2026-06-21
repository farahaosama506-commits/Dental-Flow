"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/lib/auth/actions";
import { useTranslations } from "next-intl";
import Link from "next/link";

const LoginForm: React.FC = () => {
  const t = useTranslations("auth");
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const result = await login(formData);

    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      // نجاح - توجيه للصفحة الرئيسية
      router.push("/");
      router.refresh();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="bg-red-50 border border-red-200 text-accent-red px-4 py-3 rounded-xl text-sm">
          <i className="fas fa-exclamation-circle ms-2"></i>
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          {t("email")}
        </label>
        <input
          type="email"
          name="email"
          required
          placeholder="doctor@clinic.com"
          className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-teal focus:ring-2 focus:ring-teal-light"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          {t("password")}
        </label>
        <input
          type="password"
          name="password"
          required
          placeholder="••••••••"
          className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-teal focus:ring-2 focus:ring-teal-light"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 bg-navy hover:bg-navy-dark text-white font-semibold rounded-button text-sm transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <i className="fas fa-spinner fa-spin"></i>
            جاري الدخول...
          </>
        ) : (
          <>
            <i className="fas fa-sign-in-alt"></i>
            {t("login")}
          </>
        )}
      </button>

      <p className="text-center text-sm text-gray-secondary">
        {t("noAccount")}{" "}
        <Link href="/auth/signup" className="text-teal font-semibold hover:underline">
          {t("signup")}
        </Link>
      </p>
    </form>
  );
};

export default LoginForm;