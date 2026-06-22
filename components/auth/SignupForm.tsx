"use client";

import React, { useState } from "react";
import { signup } from "@/lib/auth/actions";
import { useTranslations } from "next-intl";
import Link from "next/link";

const SignupForm: React.FC = () => {
  const t = useTranslations("auth");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [isExistingUser, setIsExistingUser] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    setIsExistingUser(false);

    const formData = new FormData(e.currentTarget);
    const result = await signup(formData);

    if (result.error) {
      setError(result.error);
      if ((result as any).isExistingUser) {
        setIsExistingUser(true);
      }
    } else {
      setSuccess(result.message || "تم إنشاء الحساب! تحقق من بريدك الإلكتروني.");
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="bg-red-50 border border-red-200 text-accent-red px-4 py-3 rounded-xl text-sm">
          <i className="fas fa-exclamation-circle ms-2"></i>
          {error}
          {isExistingUser && (
            <div className="mt-2">
              <Link href="/auth/login" className="text-navy font-semibold hover:underline">
                {t("goToLogin")} ←
              </Link>
            </div>
          )}
        </div>
      )}

      {success && (
        <div className="bg-green-light border border-green-200 text-green-soft px-4 py-3 rounded-xl text-sm">
          <i className="fas fa-check-circle ms-2"></i>
          {success}
        </div>
      )}

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">{t("fullName")}</label>
        <input type="text" name="full_name" required placeholder="د. أحمد محمد" className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm" />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">{t("email")}</label>
        <input type="email" name="email" required placeholder="doctor@clinic.com" className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm" />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">{t("specialization")}</label>
        <input type="text" name="specialization" required placeholder="تقويم الأسنان" className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm" />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">{t("password")}</label>
        <input type="password" name="password" required minLength={6} placeholder="••••••••" className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm" />
      </div>

      <button type="submit" disabled={loading} className="w-full py-3 bg-green-soft hover:bg-teal text-white font-semibold rounded-button text-sm">
        {loading ? "جاري الإنشاء..." : t("signup")}
      </button>

      <p className="text-center text-sm text-gray-secondary">
        {t("haveAccount")}{" "}
        <Link href="/auth/login" className="text-teal font-semibold hover:underline">{t("login")}</Link>
      </p>
    </form>
  );
};

export default SignupForm;