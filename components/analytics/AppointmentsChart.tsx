"use client";

import { useMemo } from "react";

type Props = { data: { month: string; count: number; revenue: number }[] };

export default function AppointmentsChart({ data }: Props) {
  const maxCount = useMemo(() => Math.max(...data.map((d) => d.count), 1), [data]);
  const months = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];

  return (
    <div className="bg-white rounded-card p-5 shadow-card border border-gray-50">
      <h3 className="font-semibold text-navy mb-4">المواعيد الشهرية</h3>
      <div className="flex items-end gap-2 h-48">
        {data.map((d) => {
          const monthIndex = parseInt(d.month.split("-")[1]) - 1;
          return (
            <div key={d.month} className="flex-1 flex flex-col items-center gap-1">
              <span className="text-xs text-gray-600">{d.count}</span>
              <div
                className="w-full bg-green-soft rounded-t-md transition-all hover:opacity-80"
                style={{ height: `${(d.count / maxCount) * 100}%` }}
              ></div>
              <span className="text-xs text-gray-secondary">{months[monthIndex]}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}