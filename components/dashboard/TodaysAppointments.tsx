"use client";

import React from "react";
import AppointmentCard from "./AppointmentCard";
import { useTranslations } from "next-intl";

interface Appointment {
  id: string;
  time: string;
  patientName: string;
  treatment: string;
  status: string;
}

interface TodaysAppointmentsProps {
  appointments: Appointment[];
}

const TodaysAppointments: React.FC<TodaysAppointmentsProps> = ({ appointments }) => {
  const t = useTranslations();

  return (
    <div className="bg-gray-card rounded-card p-5 shadow-card border border-gray-50">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-navy">
          {appointments.length > 0 ? "Today's Appointments" : "Recent Appointments"}
        </h3>
        <a href="/appointments" className="text-sm font-semibold text-teal hover:text-teal-dark transition-colors">
          {t("common.viewAll")}
        </a>
      </div>
      {appointments.length === 0 ? (
        <div className="text-center py-8 text-gray-secondary">
          <i className="fas fa-calendar-day text-3xl mb-2 block"></i>
          No appointments yet
        </div>
      ) : (
        <div className="space-y-3">
          {appointments.map((appointment) => (
            <AppointmentCard key={appointment.id} appointment={appointment as any} />
          ))}
        </div>
      )}
    </div>
  );
};

export default TodaysAppointments;