"use client";

import React from "react";
import { PatientSatisfactionData } from "@/types";
import CircularGauge from "@/components/ui/CircularGauge";
import { useTranslations } from "next-intl";

interface PatientSatisfactionProps {
  data: PatientSatisfactionData;
}

const PatientSatisfaction: React.FC<PatientSatisfactionProps> = ({ data }) => {
  const t = useTranslations("dashboard");

  return (
    <div className="bg-white rounded-card p-5 shadow-card border border-gray-50">
      <h3 className="text-lg font-bold text-navy mb-4">
        {t("patientSatisfaction")}
      </h3>
      <div className="flex justify-center mb-4">
        <CircularGauge percentage={data.percentage} label={t("excellent")} />
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-secondary flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-teal inline-block"></span>
            {t("positive")}
          </span>
          <span className="font-semibold text-gray-800">{data.positive}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-secondary flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-gray-300 inline-block"></span>
            {t("neutral")}
          </span>
          <span className="font-semibold text-gray-800">{data.neutral}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-secondary flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-accent-red inline-block"></span>
            {t("negative")}
          </span>
          <span className="font-semibold text-accent-red">{data.negative}</span>
        </div>
      </div>
    </div>
  );
};

export default PatientSatisfaction;