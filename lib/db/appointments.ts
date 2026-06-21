"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type AppointmentRow = {
  id: string;
  appointment_date: string;
  appointment_time: string;
  status: string;
  notes: string | null;
  patient: { id: string; full_name: string } | null;
  treatment: { id: string; name: string } | null;
};

// جلب المواعيد
export async function getAppointments(): Promise<AppointmentRow[]> {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return [];

  const { data, error } = await supabase
    .from("appointments")
    .select(`id, appointment_date, appointment_time, status, notes, patient:patients(id, full_name), treatment:treatments(id, name)`)
    .eq("doctor_id", userData.user.id)
    .order("appointment_date", { ascending: false })
    .order("appointment_time", { ascending: true });

  if (error || !data) return [];

  // تحويل آمن بدون as
  return data.map((item: any): AppointmentRow => {
    const patient = Array.isArray(item.patient) ? item.patient[0] : item.patient;
    const treatment = Array.isArray(item.treatment) ? item.treatment[0] : item.treatment;

    return {
      id: String(item.id || ""),
      appointment_date: String(item.appointment_date || ""),
      appointment_time: String(item.appointment_time || ""),
      status: String(item.status || "scheduled"),
      notes: item.notes || null,
      patient: patient ? { id: String(patient.id || ""), full_name: String(patient.full_name || "") } : null,
      treatment: treatment ? { id: String(treatment.id || ""), name: String(treatment.name || "") } : null,
    };
  });
}
// حذف موعد
export async function deleteAppointment(id: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("appointments")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting appointment:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/appointments");
  return { success: true };
}

// تحديث حالة الموعد
export async function updateAppointmentStatus(id: string, status: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("appointments")
    .update({ status })
    .eq("id", id);

  if (error) {
    console.error("Error updating appointment status:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/appointments");
  return { success: true };
}

// إضافة موعد
export async function addAppointment(formData: FormData) {
  const supabase = await createClient();

  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) {
    return { error: "Not authenticated" };
  }

  const patientName = (formData.get("patient_name") as string)?.trim();
  if (!patientName) return { error: "Patient name is required" };

  const year = formData.get("year") as string;
  const month = formData.get("month") as string;
  const day = formData.get("day") as string;
  const hourStr = formData.get("hour") as string;
  const ampm = formData.get("ampm") as string;
  const treatmentName = (formData.get("treatment") as string)?.trim();
  const medicalCondition = (formData.get("medical_condition") as string)?.trim() || "";
  const notes = (formData.get("notes") as string)?.trim() || null;

  if (!year || !month || !day) {
    return { error: "Invalid date" };
  }

  const hour = parseInt(hourStr);
  if (isNaN(hour) || hour < 1 || hour > 12) {
    return { error: "Invalid hour" };
  }

  let hour24 = hour;
  if (ampm === "PM" && hour !== 12) hour24 = hour + 12;
  if (ampm === "AM" && hour === 12) hour24 = 0;

  const appointmentTime = `${hour24.toString().padStart(2, "0")}:00:00`;
  const appointmentDate = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;

  // ====== البحث عن المريض أو إنشاؤه ======
  let patientId: string;

  const { data: existingPatient } = await supabase
    .from("patients")
    .select("id")
    .eq("doctor_id", userData.user.id)
    .eq("full_name", patientName)
    .single();

  if (existingPatient) {
    patientId = existingPatient.id;
  } else {
    const { data: newPatient, error: createError } = await supabase
      .from("patients")
      .insert({
        doctor_id: userData.user.id,
        full_name: patientName,
        current_condition: medicalCondition,
      })
      .select("id")
      .single();

    if (createError || !newPatient) {
      return { 
        error: "Failed to create patient: " + (createError?.message || "Unknown error") 
      };
    }
    patientId = newPatient.id;
  }

  // ====== البحث عن treatment_id ======
  let treatmentId: string | null = null;
  if (treatmentName) {
    const { data: treatment } = await supabase
      .from("treatments")
      .select("id")
      .eq("name", treatmentName)
      .single();
    treatmentId = treatment?.id || null;
  }

  // ====== إضافة الموعد ======
  const { error: insertError } = await supabase.from("appointments").insert({
    doctor_id: userData.user.id,
    patient_id: patientId,
    treatment_id: treatmentId,
    appointment_date: appointmentDate,
    appointment_time: appointmentTime,
    status: "scheduled",
    notes,
  });

  if (insertError) {
    console.error("Insert error:", insertError);
    return { error: insertError.message };
  }

  revalidatePath("/appointments");
  return { success: true };
}