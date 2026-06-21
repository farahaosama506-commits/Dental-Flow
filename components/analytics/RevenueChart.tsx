"use client";

import { useMemo } from "react";

type Props = { data: { month: string; count: number; revenue: number }[] };

export default function RevenueChart({ data }: Props) {
  const maxRevenue = useMemo(() => Math.max(...data.map((d) => d.revenue), 1), [data]);
  const months = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];

  return (
    <div className="bg-white rounded-card p-5 shadow-card border border-gray-50">
      <h3 className="font-semibold text-navy mb-4">الإيرادات الشهرية</h3>
      <div className="flex items-end gap-2 h-48">
        {data.map((d) => {
          const monthIndex = parseInt(d.month.split("-")[1]) - 1;
          return (
            <div key={d.month} className="flex-1 flex flex-col items-center gap-1">
              <span className="text-xs text-gray-600">${Math.round(d.revenue / 1000)}k</span>
              <div
                className="w-full bg-teal rounded-t-md transition-all hover:opacity-80"
                style={{ height: `${(d.revenue / maxRevenue) * 100}%` }}
              ></div>
              <span className="text-xs text-gray-secondary">{months[monthIndex]}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}