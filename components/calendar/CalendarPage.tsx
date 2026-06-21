"use client";

import React, { useState, useEffect, useCallback } from "react";
import { getMonthAppointments, type CalendarAppointment } from "@/lib/db/calendar";
import CalendarHeader from "./CalendarHeader";
import CalendarGrid from "./CalendarGrid";
import PageHeader from "@/components/ui/PageHeader";

const CalendarPage: React.FC = () => {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [appointments, setAppointments] = useState<CalendarAppointment[]>([]);
  const [loading, setLoading] = useState(true);

  const loadAppointments = useCallback(async () => {
    setLoading(true);
    const data = await getMonthAppointments(year, month);
    setAppointments(data);
    setLoading(false);
  }, [year, month]);

  useEffect(() => {
    loadAppointments();
  }, [loadAppointments]);

  const prevMonth = () => {
    if (month === 1) {
      setMonth(12);
      setYear(year - 1);
    } else {
      setMonth(month - 1);
    }
  };

  const nextMonth = () => {
    if (month === 12) {
      setMonth(1);
      setYear(year + 1);
    } else {
      setMonth(month + 1);
    }
  };

  const goToToday = () => {
    setYear(today.getFullYear());
    setMonth(today.getMonth() + 1);
  };

  const monthNames = [
    "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
    "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر",
  ];

  return (
    <div>
      <PageHeader
        title="التقويم"
        subtitle={`${monthNames[month - 1]} ${year}`}
        icon="fa-calendar-alt"
      />

      <CalendarHeader
        year={year}
        month={month}
        monthName={monthNames[month - 1]}
        onPrev={prevMonth}
        onNext={nextMonth}
        onToday={goToToday}
      />

      <CalendarGrid
        year={year}
        month={month}
        appointments={appointments}
        loading={loading}
      />
    </div>
  );
};

export default CalendarPage;