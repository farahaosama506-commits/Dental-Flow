import MainLayout from "@/components/layout/MainLayout";
import WelcomeSection from "@/components/dashboard/WelcomeSection";
import StatsCards from "@/components/dashboard/StatsCards";
import TodaysAppointments from "@/components/dashboard/TodaysAppointments";
import TomorrowPreview from "@/components/dashboard/TomorrowPreview";
import { getDashboardStats } from "@/lib/db/analytics";
import { createClient } from "@/lib/supabase/server";
import type { TomorrowEvent } from "@/types";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "لوحة التحكم",
  description: "لوحة تحكم DentalFlow - إحصائيات، مواعيد اليوم، والمرضى.",
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  const doctorName = userData.user?.user_metadata?.full_name || "دكتور";

  let stats = {
    todaysPatients: { count: 0, change: 0 },
    totalRevenue: { amount: 0, change: 0 },
    cancellationRate: { rate: 0, change: 0 },
  };
  let dashboardAppointments: any[] = [];
  let tomorrowEvents: TomorrowEvent[] = [];

  try {
    const data = await getDashboardStats();

    stats = {
      // بطاقة 1: مرضى اليوم
      todaysPatients: {
        count: data.todayPatients,
        change: data.patientsChangePercent,
      },
      // بطاقة 2: إجمالي الإيرادات
      totalRevenue: {
        amount: data.todayRevenue,
        change: data.todayPatients,
      },
      // بطاقة 3: نسبة الإلغاء
      cancellationRate: {
        rate: data.completionRate,
        change: data.yesterdayPatients,
      },
    };

    dashboardAppointments = data.todayAppointments;
    tomorrowEvents = data.tomorrowEvents;
  } catch (error) {
    console.error("Dashboard error:", error);
  }

  return (
    <MainLayout>
      <WelcomeSection doctorName={doctorName} />
      <div className="mb-6">
        <StatsCards stats={stats} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TodaysAppointments appointments={dashboardAppointments} />
        </div>
        <div className="space-y-6">
          <TomorrowPreview events={tomorrowEvents} />
        </div>
      </div>
    </MainLayout>
  );
}