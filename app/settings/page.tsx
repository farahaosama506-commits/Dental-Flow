import MainLayout from "@/components/layout/MainLayout";
import SettingsPage from "@/components/settings/SettingsPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "الإعدادات",
  description: "إعدادات العيادة - الإشعارات، ساعات العمل، واللغة.",
};

export default function Settings() {
  return (
    <MainLayout>
      <SettingsPage />
    </MainLayout>
  );
}