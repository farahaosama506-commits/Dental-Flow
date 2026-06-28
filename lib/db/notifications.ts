"use server";

import { createClient } from "@/lib/supabase/server";

export type Notification = {
  id: string;
  type: "today" | "upcoming" | "overdue";
  title: string;
  message: string;
  time: string;
  read: boolean;
};

export async function getNotifications(): Promise<Notification[]> {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return [];

  const doctorId = userData.user.id;
  const today = new Date().toISOString().split("T")[0];
  const now = new Date();
  const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

  const notifications: Notification[] = [];

  // 1. مواعيد اليوم القادمة
  const { data: todayAppts } = await supabase
    .from("appointments")
    .select("id, appointment_time, patient:patients(full_name), treatment:treatments(name)")
    .eq("doctor_id", doctorId)
    .eq("appointment_date", today)
    .eq("status", "scheduled")
    .gte("appointment_time", currentTime)
    .order("appointment_time")
    .limit(5);

  (todayAppts || []).forEach((apt: any) => {
    notifications.push({
      id: `today-${apt.id}`,
      type: "today",
      title: "موعد اليوم",
      message: `${apt.patient?.full_name || "مريض"} - ${apt.treatment?.name || "علاج"} الساعة ${apt.appointment_time?.substring(0, 5)}`,
      time: `اليوم ${apt.appointment_time?.substring(0, 5)}`,
      read: false,
    });
  });

  // 2. مواعيد الغد
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split("T")[0];

  const { count: tomorrowCount } = await supabase
    .from("appointments")
    .select("*", { count: "exact", head: true })
    .eq("doctor_id", doctorId)
    .eq("appointment_date", tomorrowStr);

  if (tomorrowCount && tomorrowCount > 0) {
    notifications.push({
      id: "tomorrow-summary",
      type: "upcoming",
      title: "مواعيد الغد",
      message: `لديك ${tomorrowCount} مواعيد غداً`,
      time: "غداً",
      read: false,
    });
  }

  // 3. مواعيد مكتملة اليوم
  const { count: completedCount } = await supabase
    .from("appointments")
    .select("*", { count: "exact", head: true })
    .eq("doctor_id", doctorId)
    .eq("appointment_date", today)
    .eq("status", "completed");

  if (completedCount && completedCount > 0) {
    notifications.unshift({
      id: "completed-summary",
      type: "today",
      title: "تم اليوم",
      message: `تم إكمال ${completedCount} مواعيد اليوم`,
      time: "الآن",
      read: true,
    });
  }

  return notifications;
}