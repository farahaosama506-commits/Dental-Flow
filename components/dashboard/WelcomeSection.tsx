"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import AddPatientModal from "@/components/patients/AddPatientModal";
import AddAppointmentModal from "@/components/appointments/AddAppointmentModal";

interface WelcomeSectionProps {
  doctorName: string;
}

const WelcomeSection: React.FC<WelcomeSectionProps> = ({ doctorName }) => {
  const t = useTranslations();
  const [isPatientModalOpen, setIsPatientModalOpen] = useState(false);
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-navy leading-tight">
            {t("dashboard.welcomeBack", { name: doctorName })}
          </h1>
          <p className="text-sm text-gray-secondary mt-1">
            أهلاً بك مجدداً، د. {doctorName}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsPatientModalOpen(true)}
            className="px-5 py-2.5 border-2 border-teal text-teal bg-white hover:bg-teal-light font-semibold rounded-button text-sm transition-colors"
          >
            {t("common.addPatient")}
          </button>
          <button
            onClick={() => setIsAppointmentModalOpen(true)}
            className="px-5 py-2.5 bg-green-soft hover:bg-teal text-white font-semibold rounded-button text-sm transition-colors shadow-sm flex items-center gap-2"
          >
            <i className="fas fa-plus-circle text-xs"></i>
            {t("common.newAppointment")}
          </button>
        </div>
      </div>

      <AddPatientModal isOpen={isPatientModalOpen} onClose={() => setIsPatientModalOpen(false)} />
      <AddAppointmentModal isOpen={isAppointmentModalOpen} onClose={() => setIsAppointmentModalOpen(false)} />
    </>
  );
};

export default WelcomeSection;