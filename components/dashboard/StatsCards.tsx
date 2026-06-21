import React from "react";
import { StatsData } from "@/types";
import { getTranslations } from "next-intl/server";

interface StatsCardsProps {
  stats: StatsData;
}

const StatsCards: React.FC<StatsCardsProps> = async ({ stats }) => {
  const t = await getTranslations("dashboard");

  const cards = [
    {
      title: t("todaysPatients"),
      value: stats.todaysPatients.count.toString(),
      change: stats.todaysPatients.change,
      changeText: t("vsYesterday", { change: stats.todaysPatients.change }),
      icon: "fa-users",
      iconBg: "bg-teal-light",
      iconColor: "text-teal",
      isPositive: true,
    },
    {
      title: t("totalRevenue"),
      value: `$${stats.totalRevenue.amount.toLocaleString("en-US")}`,
      change: stats.totalRevenue.change,
      changeText: t("up", { change: stats.totalRevenue.change }),
      icon: "fa-dollar-sign",
      iconBg: "bg-green-light",
      iconColor: "text-green-soft",
      isPositive: true,
    },
    {
      title: t("cancellationRate"),
      value: `${stats.cancellationRate.rate}%`,
      change: stats.cancellationRate.change,
      changeText: t("down", {
        change: Math.abs(stats.cancellationRate.change),
      }),
      icon: "fa-calendar-xmark",
      iconBg: "bg-red-50",
      iconColor: "text-accent-red",
      isPositive: false,
    },
  ];

  return (
    <div className="stats-grid">
      {cards.map((card) => (
        <div
          key={card.title}
          className="bg-white rounded-card p-5 shadow-card hover:shadow-hover transition-all duration-200 border border-gray-50"
        >
          <div className="flex items-start justify-between mb-3">
            <div
              className={`w-10 h-10 rounded-xl ${card.iconBg} flex items-center justify-center`}
            >
              <i className={`fas ${card.icon} ${card.iconColor} text-lg`}></i>
            </div>
          </div>
          <p className="text-sm text-gray-secondary font-medium mb-1">
            {card.title}
          </p>
          <p className="text-2xl font-bold text-navy mb-1">{card.value}</p>
          <p
            className={`text-xs font-medium ${
              card.isPositive ? "text-green-soft" : "text-accent-red"
            }`}
          >
            {card.changeText}
          </p>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;