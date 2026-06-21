import React from "react";
import { getDoctorProfile } from "@/lib/db/doctor";
import ProfileForm from "./ProfileForm";
import PageHeader from "@/components/ui/PageHeader";

const ProfilePage: React.FC = async () => {
  const profile = await getDoctorProfile();

  if (!profile) {
    return (
      <div className="text-center py-16">
        <i className="fas fa-exclamation-triangle text-3xl text-accent-orange mb-3"></i>
        <p className="text-gray-secondary">لم يتم العثور على الملف الشخصي</p>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="الملف الشخصي"
        subtitle="تعديل بياناتك الشخصية"
        icon="fa-user-gear"
      />

      <div className="bg-white rounded-card shadow-card border border-gray-50 p-6 max-w-2xl">
        <ProfileForm profile={profile} />
      </div>
    </div>
  );
};

export default ProfilePage;