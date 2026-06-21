"use client";

import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { logout } from "@/lib/auth/actions";
import { createClient } from "@/lib/supabase/client";

const Header: React.FC = () => {
  const t = useTranslations("common");
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [doctorName, setDoctorName] = useState("طبيب");
  const [doctorInitials, setDoctorInitials] = useState("ط");

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient();
      const { data: userData } = await supabase.auth.getUser();
      if (userData.user) {
        const fullName = userData.user.user_metadata?.full_name || "طبيب";
        setDoctorName(fullName);
        setDoctorInitials(fullName.charAt(0));
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await logout();
  };

  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-4 lg:px-6 shadow-nav z-10 shrink-0">
      {/* Search - مخفي على الموبايل الصغير */}
      <div className="header-search">
        <div className="relative">
          <i className="fas fa-search absolute start-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
          <input
            type="text"
            placeholder={t("search")}
            className="w-full ps-11 pe-4 py-2.5 bg-gray-card border border-gray-100 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-teal focus:ring-2 focus:ring-teal-light transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4 ms-auto sm:ms-6">
        {/* Notifications */}
        <button className="relative p-2 text-gray-secondary hover:text-navy transition-colors">
          <i className="far fa-bell text-lg sm:text-xl"></i>
          <span className="absolute top-1.5 end-1.5 w-2 h-2 bg-accent-red rounded-full border-2 border-white"></span>
        </button>

        {/* Profile */}
        <Link
          href="/profile"
          className="flex items-center gap-2 sm:gap-3 ps-2 sm:ps-2 border-s border-gray-200 hover:bg-gray-50 rounded-lg px-2 py-1 transition-colors"
        >
         <span className="header-doctor-name">{doctorName}</span>
          <div className="header-avatar">{doctorInitials}</div>
        </Link>

        {/* Logout */}
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          title={t("logout")}
          className="p-2 text-gray-secondary hover:text-accent-red transition-colors disabled:opacity-50"
        >
          {isLoggingOut ? (
            <i className="fas fa-spinner fa-spin text-sm"></i>
          ) : (
            <i className="fas fa-sign-out-alt text-sm"></i>
          )}
        </button>
      </div>
    </header>
  );
};

export default Header;