"use client";

import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import type { AnalyticsResult } from "@/lib/db/analytics";
import StatsOverview from "./StatsOverview";
import PageHeader from "@/components/ui/PageHeader";

// Lazy Loading للمخططات الثقيلة
const RevenueChart = dynamic(() => import("./RevenueChart"), { ssr: false });
const AppointmentsChart = dynamic(() => import("./AppointmentsChart"), { ssr: false });
const DemographicsChart = dynamic(() => import("./DemographicsChart"), { ssr: false });
const TopTreatments = dynamic(() => import("./TopTreatments"), { ssr: false });

export default function AnalyticsClient({ data }: { data: AnalyticsResult }) {
  const t = useTranslations("analytics");

  return (
    <div>
      <PageHeader
        title={t("title")}
        subtitle={t("subtitle")}
        icon="fa-chart-pie"
      />

      <StatsOverview data={data} />

      <div className="grid grid-cols-2 gap-6 mt-6">
        <RevenueChart data={data.monthlyStats} />
        <AppointmentsChart data={data.monthlyStats} />
        <DemographicsChart data={data.statusDistribution} />
        <TopTreatments data={data.topTreatments} />
      </div>
    </div>
  );
}