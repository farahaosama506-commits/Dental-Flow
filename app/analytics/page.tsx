import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import MainLayout from "@/components/layout/MainLayout";
import AnalyticsClient from "@/components/analytics/AnalyticsClient";
import LoadingSkeleton from "@/components/analytics/LoadingSkeleton";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "التحليلات",
  description: "تحليلات وإحصائيات العيادة - الإيرادات، المواعيد، والعلاجات الأكثر شيوعاً.",
};

export default function AnalyticsPage() {
  return (
    <MainLayout>
      <Suspense fallback={<LoadingSkeleton />}>
        <AnalyticsContent />
      </Suspense>
    </MainLayout>
  );
}

async function AnalyticsContent() {
  const { getAnalytics } = await import("@/lib/db/analytics");
  const data = await getAnalytics();

  return <AnalyticsClient data={data} />;
}