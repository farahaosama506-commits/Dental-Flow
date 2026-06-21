"use server";

import { createClient } from "@/lib/supabase/server";

export type CalendarAppointment = {
  id: string;
  appointment_date: string;
  appointment_time: string;
  status: string;
  patient: { id: string; full_name: string } | null;
  treatment: { id: string; name: string } | null;
};

export async function getMonthAppointments(year: number, month: number): Promise<CalendarAppointment[]> {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return [];

  const startDate = `${year}-${String(month).padStart(2, "0")}-01`;
  const lastDay = new Date(year, month, 0).getDate();
  const endDate = `${year}-${String(month).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`;

  const { data, error } = await supabase
    .from("appointments")
    .select(`id, appointment_date, appointment_time, status, patient:patients(id, full_name), treatment:treatments(id, name)`)
    .eq("doctor_id", userData.user.id)
    .gte("appointment_date", startDate)
    .lte("appointment_date", endDate)
    .order("appointment_time");

  if (error || !data) return [];

  // تحويل آمن بدون as
  return data.map((item: any): CalendarAppointment => {
    const patient = Array.isArray(item.patient) ? item.patient[0] : item.patient;
    const treatment = Array.isArray(item.treatment) ? item.treatment[0] : item.treatment;

    return {
      id: String(item.id || ""),
      appointment_date: String(item.appointment_date || ""),
      appointment_time: String(item.appointment_time || ""),
      status: String(item.status || "scheduled"),
      patient: patient ? { id: String(patient.id || ""), full_name: String(patient.full_name || "") } : null,
      treatment: treatment ? { id: String(treatment.id || ""), name: String(treatment.name || "") } : null,
    };
  });
}