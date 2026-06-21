"use server";

import { createClient } from "@/lib/supabase/server";

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

  // الإيرادات
  const totalRevenue = (revenueData || []).reduce((sum, p) => sum + (p.estimated_cost || 0), 0);
  const completionRate = totalAppointments ? Math.round(((completedCount || 0) / totalAppointments) * 100) : 0;

  // توزيع الحالات
  const statusMap = new Map<string, number>();
  (statusData || []).forEach((s) => {
    statusMap.set(s.status, (statusMap.get(s.status) || 0) + 1);
  });
  const statusDistribution = Array.from(statusMap.entries()).map(([status, count]) => ({ status, count }));

  // إحصائيات شهرية - معالجة آمنة لـ patient
  const monthMap = new Map<string, { count: number; revenue: number }>();
  (monthlyData || []).forEach((appt: any) => {
    const month = appt.appointment_date?.substring(0, 7) || "";
    if (!month) return;
    
    const existing = monthMap.get(month) || { count: 0, revenue: 0 };
    
    // التعامل مع patient الذي قد يكون array أو object
    const patient = Array.isArray(appt.patient) ? appt.patient[0] : appt.patient;
    const cost = patient?.estimated_cost || 0;
    
    monthMap.set(month, {
      count: existing.count + 1,
      revenue: existing.revenue + cost,
    });
  });
  
  const monthlyStats = Array.from(monthMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, data]) => ({ month, ...data }));

  // العلاجات الأكثر شيوعاً - معالجة آمنة لـ treatment
  const treatmentMap = new Map<string, { count: number; revenue: number }>();
  (treatmentData || []).forEach((appt: any) => {
    const treatment = Array.isArray(appt.treatment) ? appt.treatment[0] : appt.treatment;
    const name = treatment?.name || "غير معروف";
    const price = treatment?.price || 0;
    
    const existing = treatmentMap.get(name) || { count: 0, revenue: 0 };
    treatmentMap.set(name, {
      count: existing.count + 1,
      revenue: existing.revenue + price,
    });
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