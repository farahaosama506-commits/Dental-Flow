"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/lib/auth/actions";

const navigationItems = [
  { label: "dashboard", icon: "fa-th-large", href: "/" },
  { label: "appointments", icon: "fa-calendar-alt", href: "/appointments" },
  { label: "calendar", icon: "fa-calendar-days", href: "/calendar" },
  { label: "patients", icon: "fa-user", href: "/patients" },
  { label: "treatments", icon: "fa-plus-square", href: "/treatments" },
  { label: "analytics", icon: "fa-chart-bar", href: "/analytics" },
  { label: "settings", icon: "fa-gear", href: "/settings" },
];

const Sidebar: React.FC = () => {
  const t = useTranslations();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
  };

  const sidebarContent = (
    <>
      {/* Logo */}
      <div className="px-5 pt-7 pb-5 flex items-center gap-3">
        <div className="w-8 h-8 bg-navy rounded-lg flex items-center justify-center text-white shrink-0">
          <i className="fas fa-tooth text-lg"></i>
        </div>
        <span className="font-bold text-navy text-xl tracking-tight">DentalFlow</span>
      </div>

      <div className="px-5 pb-2">
        <p className="text-xs text-gray-400 font-semibold tracking-wider uppercase">
          {t("common.clinicManagement")}
        </p>
      </div>

      <div className="px-4 mt-2 mb-6">
        <Link
          href="/appointments"
          onClick={() => setMobileOpen(false)}
          className="w-full bg-green-soft hover:bg-teal text-white font-semibold py-2.5 px-4 rounded-button shadow-sm flex items-center justify-center gap-2 text-sm transition-colors"
        >
          <i className="fas fa-plus-circle"></i>
          {t("common.newAppointment")}
        </Link>
      </div>

      <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
        {navigationItems.map((item) => {
          const isActive =
            item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          return (
            <Link
              key={item.label}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive ? "bg-navy text-white shadow-sm" : "text-gray-text hover:bg-gray-50"
              }`}
            >
              <i className={`fas ${item.icon} w-5 text-center`}></i>
              {t(`nav.${item.label}`)}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 pb-6 space-y-1 border-t border-gray-100 pt-4 mt-2">
        <Link
          href="/profile"
          onClick={() => setMobileOpen(false)}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-text hover:bg-gray-50 transition-colors"
        >
          <i className="fas fa-user-gear w-5 text-center"></i>
          الملف الشخصي
        </Link>
        <Link
          href="#"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-text hover:bg-gray-50 transition-colors"
        >
          <i className="fas fa-circle-question w-5 text-center"></i>
          {t("common.support")}
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-accent-red hover:bg-red-50 transition-colors w-full"
        >
          <i className="fas fa-arrow-right-from-bracket w-5 text-center"></i>
          {t("common.logout")}
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Hamburger Button */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed top-3 start-3 z-50 w-10 h-10 bg-navy text-white rounded-xl flex items-center justify-center shadow-lg"
      >
        <i className={`fas ${mobileOpen ? "fa-times" : "fa-bars"}`}></i>
      </button>

      {/* Mobile Overlay */}
    {mobileOpen && (
  <div className="sidebar-mobile-overlay" onClick={() => setMobileOpen(false)}></div>
)}

      {/* Desktop Sidebar */}
      <aside className="sidebar-desktop">
               {sidebarContent}
            </aside>

      {/* Mobile Sidebar */}
     <aside className={`sidebar-mobile ${mobileOpen ? "sidebar-mobile-open" : "sidebar-mobile-closed"}`}>
  <div className="flex flex-col h-full overflow-y-auto">
    {sidebarContent}
  </div>
</aside>
    </>
  );
};

export default Sidebar;