import React from "react";
import { Appointment } from "@/types";
import StatusBadge from "@/components/ui/StatusBadge";

interface AppointmentCardProps {
  appointment: Appointment;
}

const AppointmentCard: React.FC<AppointmentCardProps> = ({ appointment }) => {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="flex items-center gap-4 p-4 bg-white rounded-card shadow-card hover-lift border border-gray-50">
      {/* Time */}
      <div className="w-16 flex-shrink-0">
        <p className="text-sm font-bold text-navy">{appointment.time}</p>
      </div>

      {/* Avatar */}
      <div className="w-10 h-10 rounded-full bg-teal-light flex items-center justify-center flex-shrink-0">
        <span className="text-sm font-bold text-teal-DEFAULT">
          {getInitials(appointment.patientName)}
        </span>
      </div>

      {/* Patient info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="font-semibold text-gray-800 text-sm truncate">
            {appointment.patientName}
          </p>
          {appointment.patientNameArabic && (
            <span className="text-xs text-gray-secondary" dir="rtl">
              {appointment.patientNameArabic}
            </span>
          )}
        </div>
        <p className="text-xs text-gray-secondary mt-0.5">{appointment.treatment}</p>
      </div>

      {/* Status badge */}
      <div className="flex-shrink-0">
        <StatusBadge status={appointment.status} />
      </div>

      {/* Menu */}
      <button className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0 p-1">
        <i className="fas fa-ellipsis-v"></i>
      </button>
    </div>
  );
};

export default AppointmentCard;