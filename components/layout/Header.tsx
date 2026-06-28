"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { logout } from "@/lib/auth/actions";
import { createClient } from "@/lib/supabase/client";
import NotificationsDropdown from "./NotificationsDropdown";

const Header: React.FC = () => {
  const t = useTranslations("common");
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [doctorName, setDoctorName] = useState("طبيب");
  const [doctorInitials, setDoctorInitials] = useState("ط");
  const [searchTerm, setSearchTerm] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);

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

  const handleSearch = useCallback(async (term: string) => {
    setSearchTerm(term);
    if (term.length < 2) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }
    setSearching(true);
    setShowResults(true);
    const supabase = createClient();
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return;
    const searchPattern = `%${term}%`;
    const [patientsRes, appointmentsRes] = await Promise.all([
      supabase.from("patients").select("id, full_name").eq("doctor_id", userData.user.id).ilike("full_name", searchPattern).limit(5),
      supabase.from("appointments").select("id, appointment_date, appointment_time, patient:patients(full_name)").eq("doctor_id", userData.user.id).ilike("patient.full_name", searchPattern).limit(5),
    ]);
    const results = [
      ...(patientsRes.data || []).map((p) => ({ type: "patient", id: p.id, title: p.full_name, subtitle: "مريض", link: "/patients" })),
      ...(appointmentsRes.data || []).map((a: any) => ({ type: "appointment", id: a.id, title: a.patient?.full_name || "غير معروف", subtitle: `${a.appointment_date} - ${a.appointment_time?.substring(0, 5)}`, link: "/appointments" })),
    ];
    setSearchResults(results);
    setSearching(false);
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await logout();
  };

  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-4 lg:px-6 shadow-nav z-10 shrink-0">
      {/* Search */}
      <div className="flex-1 max-w-xl hidden sm:block ms-10 lg:ms-0 relative">
        <div className="relative">
          <i className="fas fa-search absolute start-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
          <input
            type="text"
            placeholder={t("search")}
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            onFocus={() => searchResults.length > 0 && setShowResults(true)}
            onBlur={() => setTimeout(() => setShowResults(false), 200)}
            className="w-full ps-11 pe-10 py-2.5 bg-gray-card border border-gray-100 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-teal focus:ring-2 focus:ring-teal-light transition-all"
          />
          {searching && <i className="fas fa-spinner fa-spin absolute end-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>}
          {searchTerm && !searching && (
            <button onClick={() => { setSearchTerm(""); setSearchResults([]); setShowResults(false); }} className="absolute end-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <i className="fas fa-times text-sm"></i>
            </button>
          )}
        </div>
        {showResults && searchResults.length > 0 && (
          <div className="absolute top-full start-0 end-0 mt-2 bg-white rounded-xl shadow-hover border border-gray-100 z-50 max-h-80 overflow-y-auto">
            {searchResults.map((result, index) => (
              <Link key={`${result.type}-${result.id}`} href={result.link} onClick={() => setShowResults(false)} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${result.type === "patient" ? "bg-teal-light text-teal" : "bg-green-light text-green-soft"}`}>
                  <i className={`fas ${result.type === "patient" ? "fa-user" : "fa-calendar"}`}></i>
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">{result.title}</p>
                  <p className="text-xs text-gray-secondary">{result.subtitle}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
        {showResults && searchTerm.length >= 2 && searchResults.length === 0 && !searching && (
          <div className="absolute top-full start-0 end-0 mt-2 bg-white rounded-xl shadow-hover border border-gray-100 z-50 p-6 text-center">
            <i className="fas fa-search text-2xl text-gray-300 mb-2 block"></i>
            <p className="text-sm text-gray-secondary">لا توجد نتائج</p>
          </div>
        )}
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-2 sm:gap-4 ms-auto sm:ms-6">
        {/* Notifications */}
        <NotificationsDropdown />

        {/* Profile */}
        <Link href="/profile" className="flex items-center gap-2 sm:gap-3 ps-2 border-s border-gray-200 hover:bg-gray-50 rounded-lg px-2 py-1 transition-colors">
          <span className="text-sm font-semibold text-navy hidden sm:block hover:text-teal transition-colors">{doctorName}</span>
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-teal flex items-center justify-center text-white font-bold text-xs sm:text-sm hover:bg-teal-dark transition-colors shrink-0">{doctorInitials}</div>
        </Link>

        {/* Logout */}
        <button onClick={handleLogout} disabled={isLoggingOut} title={t("logout")} className="p-2 text-gray-secondary hover:text-accent-red transition-colors disabled:opacity-50">
          {isLoggingOut ? <i className="fas fa-spinner fa-spin text-sm"></i> : <i className="fas fa-sign-out-alt text-sm"></i>}
        </button>
      </div>
    </header>
  );
};

export default Header;