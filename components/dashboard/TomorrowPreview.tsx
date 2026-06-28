"use client";

import React from "react";
import Link from "next/link";
import { TomorrowEvent } from "@/types";
import { useTranslations } from "next-intl";

interface TomorrowPreviewProps {
  events: TomorrowEvent[];
}

const TomorrowPreview: React.FC<TomorrowPreviewProps> = ({ events }) => {
  const t = useTranslations();

  return (
    <div className="bg-white rounded-card p-5 shadow-card border border-gray-50">
      <h3 className="text-lg font-bold text-navy mb-4 flex items-center gap-2">
        <i className="far fa-calendar-alt text-teal"></i>
        {t("dashboard.tomorrow")}
      </h3>

      {events.length === 0 ? (
        <div className="text-center py-6">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <i className="fas fa-calendar-xmark text-gray-400 text-lg"></i>
          </div>
          <p className="text-sm text-gray-secondary mb-1">لا يوجد مواعيد</p>
          <p className="text-xs text-gray-400">0 مرضى</p>
        </div>
      ) : (
        <div className="space-y-4">
          {events.map((event, index) => (
            <div
              key={event.id || `event-${index}`}
              className="flex items-start gap-3 p-3 bg-gray-card rounded-xl"
            >
              <div className="w-9 h-9 rounded-lg bg-teal-light flex items-center justify-center shrink-0">
                <i className="fas fa-clock text-teal text-xs"></i>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-gray-800">
                  {event.doctorName
                    ? `${event.doctorName} - ${event.type}`
                    : event.type}
                </p>
                <p className="text-xs text-gray-secondary mt-0.5">
                  {event.time}
                </p>
                <p className="text-xs font-medium text-teal mt-1">
                  {event.patientsCount} {t("dashboard.patients")}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      <Link
        href="/calendar"
        className="w-full mt-4 py-2.5 px-4 bg-teal hover:bg-teal-dark text-white font-semibold rounded-button text-sm transition-colors shadow-sm flex items-center justify-center gap-2"
      >
        <i className="fas fa-calendar-alt"></i>
        {t("common.viewFullCalendar")}
      </Link>
    </div>
  );
};

export default TomorrowPreview;