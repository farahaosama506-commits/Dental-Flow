import MainLayout from "@/components/layout/MainLayout";
import ProfilePage from "@/components/profile/ProfilePage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "الملف الشخصي",
  description: "تعديل بيانات الطبيب الشخصية - الاسم، التخصص، ورقم الهاتف.",
};
export default function Profile() {
  return (
    <MainLayout>
      <ProfilePage />
    </MainLayout>
  );
}