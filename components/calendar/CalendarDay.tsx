import React from "react";
import type { CalendarAppointment } from "@/lib/db/calendar";

interface CalendarDayProps {
  day: number | null;
  appointments: CalendarAppointment[];
  isToday: boolean;
}

const statusColors: Record<string, string> = {
  scheduled: "bg-blue-100 text-blue-700",
  "in-progress": "bg-teal-light text-teal",
  completed: "bg-green-light text-green-soft",
  cancelled: "bg-red-50 text-accent-red line-through",
};

const statusLabels: Record<string, string> = {
  scheduled: "مجدول",
  "in-progress": "قيد التنفيذ",
  completed: "مكتمل",
  cancelled: "ملغي",
};

const CalendarDay: React.FC<CalendarDayProps> = ({ day, appointments, isToday }) => {
  if (!day) {
    return <div className="min-h-[100px] border-b border-e border-gray-50 bg-gray-50/30">
      
    </div>;
  }

  return (
    <div
      className={`min-h-[100px] border-b border-e border-gray-50 p-2 transition-colors hover:bg-gray-50/50 ${
        isToday ? "bg-teal-light/20" : ""
      }`}
    >
      <span
        className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-sm font-bold mb-1 ${
          isToday ? "bg-teal text-white" : "text-gray-700"
        }`}
      >
        {day}
      </span>

      <div className="space-y-1">
        {appointments.slice(0, 3).map((apt) => (
          <div
            key={apt.id}
            className={`text-xs px-1.5 py-0.5 rounded truncate ${statusColors[apt.status] || "bg-gray-100"}`}
            title={`${apt.patient?.full_name} - ${apt.treatment?.name} (${apt.appointment_time?.substring(0, 5)})`}
          >
            <span className="font-semibold">{apt.appointment_time?.substring(0, 5)}</span>{" "}
            {apt.patient?.full_name?.split(" ")[0]}
          </div>
        ))}

        {appointments.length > 3 && (
          <p className="text-xs text-teal font-semibold px-1">
            +{appointments.length - 3} مواعيد
          </p>
        )}
      </div>
    </div>
  );
};

export default CalendarDay;