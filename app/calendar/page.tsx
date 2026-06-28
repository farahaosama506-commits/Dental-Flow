import MainLayout from "@/components/layout/MainLayout";
import CalendarPage from "@/components/calendar/CalendarPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "التقويم",
  description: "التقويم الشهري للمواعيد - عرض وتنقل بين الأشهر.",
};

export default function Calendar() {
  return (
    <MainLayout>
      <CalendarPage />
    </MainLayout>
  );
}