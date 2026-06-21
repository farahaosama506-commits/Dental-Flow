import React, { useMemo } from "react";
import type { CalendarAppointment } from "@/lib/db/calendar";
import CalendarDay from "./CalendarDay";

interface CalendarGridProps {
  year: number;
  month: number;
  appointments: CalendarAppointment[];
  loading: boolean;
}

const CalendarGrid: React.FC<CalendarGridProps> = ({
  year,
  month,
  appointments,
  loading,
}) => {
  const today = new Date();
  const daysInMonth = new Date(year, month, 0).getDate();
  const firstDayOfWeek = new Date(year, month - 1, 1).getDay(); // 0=Sun

  const dayNames = ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];

  // تجميع المواعيد حسب اليوم - O(n) باستخدام Map
  const appointmentsByDay = useMemo(() => {
    const map = new Map<number, CalendarAppointment[]>();
    appointments.forEach((apt) => {
      const day = parseInt(apt.appointment_date.split("-")[2]);
      if (!map.has(day)) map.set(day, []);
      map.get(day)!.push(apt);
    });
    return map;
  }, [appointments]);

  // بناء أيام التقويم
  const days = useMemo(() => {
    const result: (number | null)[] = [];

    // أيام فارغة قبل بداية الشهر
    for (let i = 0; i < firstDayOfWeek; i++) {
      result.push(null);
    }

    // أيام الشهر
    for (let i = 1; i <= daysInMonth; i++) {
      result.push(i);
    }

    return result;
  }, [firstDayOfWeek, daysInMonth]);

  if (loading) {
    return (
      <div className="text-center py-16">
        <i className="fas fa-spinner fa-spin text-2xl text-teal"></i>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-card shadow-card border border-gray-50 overflow-hidden">
      {/* أسماء الأيام */}
      <div className="grid grid-cols-7 border-b border-gray-100">
        {dayNames.map((name) => (
          <div
            key={name}
            className="p-3 text-center text-sm font-semibold text-gray-secondary bg-gray-card"
          >
            {name}
          </div>
        ))}
      </div>

      {/* شبكة الأيام */}
      <div className="grid grid-cols-7">
        {days.map((day, index) => (
          <CalendarDay
            key={index}
            day={day}
            appointments={day ? appointmentsByDay.get(day) || [] : []}
            isToday={
              day === today.getDate() &&
              month === today.getMonth() + 1 &&
              year === today.getFullYear()
            }
          />
        ))}
      </div>
    </div>
  );
};

export default CalendarGrid;