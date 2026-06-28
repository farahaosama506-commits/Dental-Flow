"use client";

import React, { useState, useEffect } from "react";
import { StatsData } from "@/types";
import { useTranslations } from "next-intl";

interface StatsCardsProps {
  stats: StatsData;
}

const StatsCards: React.FC<StatsCardsProps> = ({ stats }) => {
  const t = useTranslations("dashboard");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const formatNumber = (num: number) => {
    if (!mounted) return num.toString();
    return num.toLocaleString("ar-SA");
  };

  const cards = [
    {
      title: "مرضى اليوم",
      value: formatNumber(stats.todaysPatients.count),
      change: stats.todaysPatients.change,
      changeText:
        stats.todaysPatients.change >= 0
          ? `↑ ${stats.todaysPatients.change}% مقابل الأمس`
          : `↓ ${Math.abs(stats.todaysPatients.change)}% مقابل الأمس`,
      icon: "fa-users",
      iconBg: "bg-teal-light",
      iconColor: "text-teal",
      isPositive: stats.todaysPatients.change >= 0,
    },
    {
      title: "إجمالي الإيرادات",
      value: mounted
        ? `$${stats.totalRevenue.amount.toLocaleString("ar-SA")}`
        : `$${stats.totalRevenue.amount}`,
      change: stats.totalRevenue.change,
      changeText: `${formatNumber(stats.totalRevenue.change)} مريض مسجل`,
      icon: "fa-dollar-sign",
      iconBg: "bg-green-light",
      iconColor: "text-green-soft",
      isPositive: true,
    },
    {
      title: "نسبة الإلغاء",
      value: `${stats.cancellationRate.rate}%`,
      change: stats.cancellationRate.change,
      changeText: `${formatNumber(stats.cancellationRate.change)} مريض أمس`,
      icon: "fa-ban",
      iconBg: "bg-red-50",
      iconColor: "text-accent-red",
      isPositive: stats.cancellationRate.rate < 10,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
      {cards.map((card) => (
        <div
          key={card.title}
          className="bg-white rounded-card p-5 shadow-card hover:shadow-hover transition-all duration-200 border border-gray-50"
        >
          <div className="flex items-start justify-between mb-3">
            <div className={`w-10 h-10 rounded-xl ${card.iconBg} flex items-center justify-center`}>
              <i className={`fas ${card.icon} ${card.iconColor} text-lg`}></i>
            </div>
          </div>
          <p className="text-sm text-gray-secondary font-medium mb-1">{card.title}</p>
          <p className="text-2xl font-bold text-navy mb-1">{card.value}</p>
          <p className={`text-xs font-medium ${card.isPositive ? "text-green-soft" : "text-accent-red"}`}>
            {card.changeText}
          </p>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;