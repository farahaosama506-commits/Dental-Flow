"use server";

import { createClient } from "@/lib/supabase/server";
import type { TomorrowEvent } from "@/types";

export type AnalyticsResult = {
  totalPatients: number;
  totalAppointments: number;
  totalRevenue: number;
  completionRate: number;
  todayAppointments: number;
  monthlyStats: { month: string; count: number; revenue: number }[];
  statusDistribution: { status: string; count: number }[];
  topTreatments: { name: string; count: number; revenue: number }[];
};

export type DashboardStats = {
  todayPatients: number;
  yesterdayPatients: number;
  patientsChangePercent: number;
  todayRevenue: number;
  yesterdayRevenue: number;
  revenueChangePercent: number;
  totalPatients: number;
  completionRate: number;
  todayAppointments: { time: string; patientName: string; treatment: string; status: string }[];
  tomorrowEvents: TomorrowEvent[];
};

export async function getAnalytics(): Promise<AnalyticsResult> {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) throw new Error("Not authenticated");

  const doctorId = userData.user.id;

  const [
    { count: totalPatients },
    { count: totalAppointments },
    { data: revenueData },
    { count: completedCount },
    { count: todayCount },
    { data: statusData },
    { data: monthlyData },
    { data: treatmentData },
  ] = await Promise.all([
    supabase.from("patients").select("*", { count: "exact", head: true }).eq("doctor_id", doctorId),
    supabase.from("appointments").select("*", { count: "exact", head: true }).eq("doctor_id", doctorId),
    supabase.from("patients").select("estimated_cost").eq("doctor_id", doctorId),
    supabase.from("appointments").select("*", { count: "exact", head: true }).eq("doctor_id", doctorId).eq("status", "completed"),
    supabase.from("appointments").select("*", { count: "exact", head: true }).eq("doctor_id", doctorId).eq("appointment_date", new Date().toISOString().split("T")[0]),
    supabase.from("appointments").select("status").eq("doctor_id", doctorId),
    supabase.from("appointments").select("appointment_date, patient:patients(estimated_cost)").eq("doctor_id", doctorId).gte("appointment_date", new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]),
    supabase.from("appointments").select("treatment:treatments(name, price)").eq("doctor_id", doctorId).not("treatment_id", "is", null),
  ]);

  const totalRevenue = (revenueData || []).reduce((sum, p) => sum + (p.estimated_cost || 0), 0);
  const completionRate = totalAppointments ? Math.round(((completedCount || 0) / totalAppointments) * 100) : 0;

  const statusMap = new Map<string, number>();
  (statusData || []).forEach((s) => {
    statusMap.set(s.status, (statusMap.get(s.status) || 0) + 1);
  });
  const statusDistribution = Array.from(statusMap.entries()).map(([status, count]) => ({ status, count }));

  const monthMap = new Map<string, { count: number; revenue: number }>();
  (monthlyData || []).forEach((item: any) => {
    const month = item.appointment_date?.substring(0, 7) || "";
    if (!month) return;
    const patient = Array.isArray(item.patient) ? item.patient[0] : item.patient;
    const cost = patient?.estimated_cost || 0;
    const existing = monthMap.get(month) || { count: 0, revenue: 0 };
    monthMap.set(month, { count: existing.count + 1, revenue: existing.revenue + cost });
  });
  const monthlyStats = Array.from(monthMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, data]) => ({ month, ...data }));

  const treatmentMap = new Map<string, { count: number; revenue: number }>();
  (treatmentData || []).forEach((item: any) => {
    const treatment = Array.isArray(item.treatment) ? item.treatment[0] : item.treatment;
    const name = treatment?.name || "غير معروف";
    const price = treatment?.price || 0;
    const existing = treatmentMap.get(name) || { count: 0, revenue: 0 };
    treatmentMap.set(name, { count: existing.count + 1, revenue: existing.revenue + price });
  });
  const topTreatments = Array.from(treatmentMap.entries())
    .sort(([, a], [, b]) => b.count - a.count)
    .slice(0, 5)
    .map(([name, data]) => ({ name, ...data }));

  return {
    totalPatients: totalPatients || 0,
    totalAppointments: totalAppointments || 0,
    totalRevenue,
    completionRate,
    todayAppointments: todayCount || 0,
    monthlyStats,
    statusDistribution,
    topTreatments,
  };
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) throw new Error("Not authenticated");

  const doctorId = userData.user.id;
  const doctorName = userData.user.user_metadata?.full_name || "طبيب";

  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];
  
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split("T")[0];
  
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split("T")[0];

  const [
    { count: todayPatientsCount },
    { count: yesterdayPatientsCount },
    { data: todayRevenueData },
    { data: yesterdayRevenueData },
    { count: totalPatients },
    { count: completedAppointments },
    { count: totalAppointments },
    { data: todayAppointmentsData },
    { data: tomorrowAppointmentsData },
  ] = await Promise.all([
    supabase.from("appointments").select("*", { count: "exact", head: true }).eq("doctor_id", doctorId).eq("appointment_date", todayStr),
    supabase.from("appointments").select("*", { count: "exact", head: true }).eq("doctor_id", doctorId).eq("appointment_date", yesterdayStr),
    supabase.from("patients").select("estimated_cost").eq("doctor_id", doctorId).gte("created_at", `${todayStr}T00:00:00`).lte("created_at", `${todayStr}T23:59:59`),
    supabase.from("patients").select("estimated_cost").eq("doctor_id", doctorId).gte("created_at", `${yesterdayStr}T00:00:00`).lte("created_at", `${yesterdayStr}T23:59:59`),
    supabase.from("patients").select("*", { count: "exact", head: true }).eq("doctor_id", doctorId),
    supabase.from("appointments").select("*", { count: "exact", head: true }).eq("doctor_id", doctorId).eq("status", "completed"),
    supabase.from("appointments").select("*", { count: "exact", head: true }).eq("doctor_id", doctorId),
    supabase.from("appointments").select("appointment_time, patient:patients(full_name), treatment:treatments(name), status").eq("doctor_id", doctorId).eq("appointment_date", todayStr).order("appointment_time"),
    supabase.from("appointments").select("appointment_time").eq("doctor_id", doctorId).eq("appointment_date", tomorrowStr).order("appointment_time"),
  ]);

  const todayRevenue = (todayRevenueData || []).reduce((sum, p) => sum + (p.estimated_cost || 0), 0);
  const yesterdayRevenue = (yesterdayRevenueData || []).reduce((sum, p) => sum + (p.estimated_cost || 0), 0);

  const patientsChangePercent = yesterdayPatientsCount
    ? Math.round(((todayPatientsCount! - yesterdayPatientsCount!) / yesterdayPatientsCount!) * 100)
    : 0;
  
  const revenueChangePercent = yesterdayRevenue
    ? Math.round(((todayRevenue - yesterdayRevenue) / yesterdayRevenue) * 100)
    : 0;

  const completionRate = totalAppointments
    ? Math.round(((completedAppointments || 0) / totalAppointments) * 100)
    : 0;

  const todayAppointments = (todayAppointmentsData || []).map((apt: any) => ({
    time: apt.appointment_time?.substring(0, 5) || "",
    patientName: apt.patient?.full_name || "غير معروف",
    treatment: apt.treatment?.name || "غير محدد",
    status: apt.status || "scheduled",
  }));

  const tomorrowAppts = tomorrowAppointmentsData || [];
  const morningAppts = tomorrowAppts.filter((apt: any) => {
    const hour = parseInt(apt.appointment_time?.split(":")[0] || "0");
    return hour < 12;
  });
  const afternoonAppts = tomorrowAppts.filter((apt: any) => {
    const hour = parseInt(apt.appointment_time?.split(":")[0] || "0");
    return hour >= 12;
  });

  const tomorrowEvents: TomorrowEvent[] = [];
  if (morningAppts.length > 0) {
    tomorrowEvents.push({
      type: "الفترة الصباحية",
      time: `${morningAppts[0].appointment_time?.substring(0, 5)} - ${morningAppts[morningAppts.length - 1].appointment_time?.substring(0, 5)}`,
      patientsCount: morningAppts.length,
      doctorName,
    });
  }
  if (afternoonAppts.length > 0) {
    tomorrowEvents.push({
      type: "الفترة المسائية",
      time: `${afternoonAppts[0].appointment_time?.substring(0, 5)} - ${afternoonAppts[afternoonAppts.length - 1].appointment_time?.substring(0, 5)}`,
      patientsCount: afternoonAppts.length,
      doctorName,
    });
  }

  return {
    todayPatients: todayPatientsCount || 0,
    yesterdayPatients: yesterdayPatientsCount || 0,
    patientsChangePercent,
    todayRevenue,
    yesterdayRevenue,
    revenueChangePercent,
    totalPatients: totalPatients || 0,
    completionRate,
    todayAppointments,
    tomorrowEvents,
  };
}