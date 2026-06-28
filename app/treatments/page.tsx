import MainLayout from "@/components/layout/MainLayout";
import TreatmentsPage from "@/components/treatments/TreatmentsPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "العلاجات",
  description: "العلاجات السنية المتاحة - الأسعار، الفئات، والمدة.",
};

export default function Treatments() {
  return (
    <MainLayout>
      <TreatmentsPage />
    </MainLayout>
  );
}