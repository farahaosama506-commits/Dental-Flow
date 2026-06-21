"use client";

import React, { useState } from "react";
import { updateDoctorProfile, type DoctorProfile } from "@/lib/db/doctor";

interface ProfileFormProps {
  profile: DoctorProfile;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ profile }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("");
    setError("");

    const formData = new FormData(e.currentTarget);
    const result = await updateDoctorProfile(formData);

    if (result.error) {
      setError(result.error);
    } else {
      setMessage(result.message || "تم التحديث");
    }
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {message && (
        <div className="bg-green-light border border-green-200 text-green-soft px-4 py-3 rounded-xl text-sm">
          <i className="fas fa-check-circle ms-2"></i> {message}
        </div>
      )}
      {error && (
        <div className="bg-red-50 border border-red-200 text-accent-red px-4 py-3 rounded-xl text-sm">
          <i className="fas fa-exclamation-circle ms-2"></i> {error}
        </div>
      )}

      {/* Avatar */}
      <div className="flex items-center gap-4 pb-6 border-b border-gray-100">
        <div className="w-20 h-20 rounded-full bg-teal flex items-center justify-center text-white text-2xl font-bold">
          {profile.full_name.charAt(0)}
        </div>
        <div>
          <h3 className="font-semibold text-gray-800 text-lg">{profile.full_name}</h3>
          <p className="text-sm text-gray-secondary">{profile.email}</p>
        </div>
      </div>

      {/* Full Name */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          الاسم الكامل
        </label>
        <input
          type="text"
          name="full_name"
          defaultValue={profile.full_name}
          required
          className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-teal focus:ring-2 focus:ring-teal-light"
        />
      </div>

      {/* Email (readonly) */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          البريد الإلكتروني
        </label>
        <input
          type="email"
          value={profile.email}
          disabled
          className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm bg-gray-50 text-gray-500"
        />
        <p className="text-xs text-gray-secondary mt-1">لا يمكن تغيير البريد الإلكتروني</p>
      </div>

      {/* Specialization */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          التخصص
        </label>
        <input
          type="text"
          name="specialization"
          defaultValue={profile.specialization}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-teal focus:ring-2 focus:ring-teal-light"
        />
      </div>

      {/* Phone */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          رقم الهاتف
        </label>
        <input
          type="tel"
          name="phone"
          defaultValue={profile.phone || ""}
          placeholder="+966 5XXXXXXXX"
          className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-teal focus:ring-2 focus:ring-teal-light"
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-3 bg-navy hover:bg-navy-dark text-white font-semibold rounded-button text-sm transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {isSubmitting ? (
          <>
            <i className="fas fa-spinner fa-spin"></i>
            جاري الحفظ...
          </>
        ) : (
          <>
            <i className="fas fa-save"></i>
            حفظ التغييرات
          </>
        )}
      </button>
    </form>
  );
};

export default ProfileForm;