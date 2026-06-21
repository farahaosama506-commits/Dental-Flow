"use client";

import { useState, useEffect } from "react";
import type { AnalyticsResult } from "@/lib/db/analytics";
import { useTranslations } from "next-intl";

export default function StatsOverview({ data }: { data: AnalyticsResult }) {
  const t = useTranslations("analytics");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const formatNumber = (num: number) => {
    if (!mounted) return num.toString();
    return num.toLocaleString("ar-SA");
  };

  const stats = [
    { label: t("totalPatients"), value: formatNumber(data.totalPatients), icon: "fa-users", color: "bg-teal-light text-teal" },
    { label: t("totalAppointments"), value: formatNumber(data.totalAppointments), icon: "fa-calendar-check", color: "bg-green-light text-green-soft" },
    { label: t("totalRevenue"), value: `$${formatNumber(data.totalRevenue)}`, icon: "fa-dollar-sign", color: "bg-navy/10 text-navy" },
    { label: t("completionRate"), value: `${data.completionRate}%`, icon: "fa-chart-line", color: "bg-orange-50 text-accent-orange" },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div key={stat.label} className="bg-white rounded-card p-5 shadow-card border border-gray-50">
          <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center mb-3`}>
            <i className={`fas ${stat.icon}`}></i>
          </div>
          <p className="text-2xl font-bold text-navy">{stat.value}</p>
          <p className="text-sm text-gray-secondary">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}