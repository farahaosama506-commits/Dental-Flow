import MainLayout from "@/components/layout/MainLayout";
import WelcomeSection from "@/components/dashboard/WelcomeSection";
import StatsCards from "@/components/dashboard/StatsCards";
import TodaysAppointments from "@/components/dashboard/TodaysAppointments";
import TomorrowPreview from "@/components/dashboard/TomorrowPreview";
import { createClient } from "@/lib/supabase/server";

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
  let tomorrowEvents: any[] = [];

  try {
    if (userData.user) {
      const today = new Date();
      const todayStr = today.toISOString().split("T")[0];

      // حساب تاريخ الغد
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowStr = tomorrow.toISOString().split("T")[0];

      // إحصائيات اليوم
      const { count: todayPatients } = await supabase
        .from("appointments")
        .select("*", { count: "exact", head: true })
        .eq("doctor_id", userData.user.id)
        .eq("appointment_date", todayStr);

      const { count: totalPatients } = await supabase
        .from("patients")
        .select("*", { count: "exact", head: true })
        .eq("doctor_id", userData.user.id);

      const { data: revenueData } = await supabase
        .from("patients")
        .select("estimated_cost")
        .eq("doctor_id", userData.user.id);

      const totalRevenue = revenueData?.reduce((sum, p) => sum + (p.estimated_cost || 0), 0) || 0;

      stats = {
        todaysPatients: { count: todayPatients || 0, change: 12 },
        totalRevenue: { amount: totalRevenue, change: 8 },
        cancellationRate: { rate: totalPatients || 0, change: 1.5 },
      };

      // مواعيد اليوم
      const { data: todayAppts } = await supabase
        .from("appointments")
        .select(`*, patient:patients(*), treatment:treatments(*)`)
        .eq("doctor_id", userData.user.id)
        .eq("appointment_date", todayStr)
        .order("appointment_time")
        .limit(3);

      dashboardAppointments = (todayAppts || []).map((apt: any) => ({
        id: apt.id,
        time: apt.appointment_time?.substring(0, 5) || "",
        patientName: apt.patient?.full_name || "غير معروف",
        treatment: apt.treatment?.name || "غير محدد",
        status: apt.status,
      }));

      // ====== مواعيد الغد ======
      const { data: tomorrowAppts } = await supabase
        .from("appointments")
        .select(`id, appointment_time, appointment_date, patient:patients(full_name), treatment:treatments(name)`)
        .eq("doctor_id", userData.user.id)
        .eq("appointment_date", tomorrowStr)
        .order("appointment_time");

      if (tomorrowAppts && tomorrowAppts.length > 0) {
        // تجميع حسب الساعة
        const morningAppts = tomorrowAppts.filter((apt: any) => {
          const hour = parseInt(apt.appointment_time?.split(":")[0] || "0");
          return hour < 12;
        });
        const afternoonAppts = tomorrowAppts.filter((apt: any) => {
          const hour = parseInt(apt.appointment_time?.split(":")[0] || "0");
          return hour >= 12;
        });

        tomorrowEvents = [];
        
        if (morningAppts.length > 0) {
          tomorrowEvents.push({
            id: "tomorrow-morning",
            type: "الفترة الصباحية",
            time: `${morningAppts[0].appointment_time?.substring(0, 5)} - ${morningAppts[morningAppts.length - 1].appointment_time?.substring(0, 5)}`,
            patientsCount: morningAppts.length,
            doctorName: doctorName,
          });
        }
        
        if (afternoonAppts.length > 0) {
          tomorrowEvents.push({
            id: "tomorrow-afternoon",
            type: "الفترة المسائية",
            time: `${afternoonAppts[0].appointment_time?.substring(0, 5)} - ${afternoonAppts[afternoonAppts.length - 1].appointment_time?.substring(0, 5)}`,
            patientsCount: afternoonAppts.length,
            doctorName: doctorName,
          });
        }
      }
    }
  } catch (error) {
    console.error("Dashboard error:", error);
  }

  return (
    <MainLayout>
      <WelcomeSection doctorName={doctorName} />
      <div className="mb-6">
        <StatsCards stats={stats} />
      </div>
      <div className="dashboard-grid">
        <div className="dashboard-main">
          <TodaysAppointments appointments={dashboardAppointments} />
        </div>
        <div className="dashboard-side">
          <TomorrowPreview events={tomorrowEvents} />
        </div>
      </div>
    </MainLayout>
  );
}