import MainLayout from "@/components/layout/MainLayout";
import PatientsPage from "@/components/patients/PatientsPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "المرضى",
  description: "إدارة سجلات المرضى - إضافة مريض جديد، عرض التاريخ الطبي، والتكاليف.",
};

export default function Patients() {
  return (
    <MainLayout>
      <PatientsPage />
    </MainLayout>
  );
}