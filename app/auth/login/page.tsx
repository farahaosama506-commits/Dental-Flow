import { getTranslations } from "next-intl/server";
import LoginForm from "@/components/auth/LoginForm";
import Link from "next/link";

export default async function LoginPage() {
  const t = await getTranslations("auth");

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-teal-light/20 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-navy rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <i className="fas fa-tooth text-white text-2xl"></i>
          </div>
          <h1 className="text-2xl font-bold text-navy">DentalFlow</h1>
          <p className="text-gray-secondary text-sm mt-1">{t("loginTitle")}</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-card p-8 border border-gray-50">
          <LoginForm />
        </div>

        {/* Back to home */}
        <div className="text-center mt-6">
          <Link
            href="/"
            className="text-sm text-gray-secondary hover:text-navy transition-colors"
          >
            <i className="fas fa-arrow-left me-2"></i>
            {t("backToHome")}
          </Link>
        </div>
      </div>
    </div>
  );
}