import MainLayout from "@/components/layout/MainLayout";
import AppointmentsPage from "@/components/appointments/AppointmentsPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "المواعيد",
  description: "إدارة جميع مواعيد المرضى - إضافة، تعديل، حذف وتغيير حالة المواعيد.",
};
export default function Appointments() {
  return (
    <MainLayout>
      <AppointmentsPage />
    </MainLayout>
  );
}