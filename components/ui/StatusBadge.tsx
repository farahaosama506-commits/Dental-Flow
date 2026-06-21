"use client";

import React from "react";
import { useTranslations } from "next-intl";

type StatusType = "scheduled" | "in-progress" | "waiting" | "confirmed" | "completed" | "cancelled";

interface StatusBadgeProps {
  status: StatusType;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const t = useTranslations("status");

  const statusStyles: Record<StatusType, { bg: string; text: string; label: string; dot: string }> = {
    scheduled: {
      bg: "bg-blue-50",
      text: "text-blue-600",
      label: "Scheduled",
      dot: "bg-blue-500",
    },
    "in-progress": {
      bg: "bg-teal-light",
      text: "text-teal-dark",
      label: "In Progress",
      dot: "bg-teal",
    },
    waiting: {
      bg: "bg-gray-100",
      text: "text-gray-600",
      label: "Waiting",
      dot: "bg-gray-400",
    },
    confirmed: {
      bg: "bg-gray-100",
      text: "text-gray-600",
      label: "Confirmed",
      dot: "bg-gray-400",
    },
    completed: {
      bg: "bg-green-light",
      text: "text-green-soft",
      label: "Completed",
      dot: "bg-green-soft",
    },
    cancelled: {
      bg: "bg-red-50",
      text: "text-accent-red",
      label: "Cancelled",
      dot: "bg-accent-red",
    },
  };

  const style = statusStyles[status] || statusStyles.scheduled;

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${style.bg} ${style.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`}></span>
      {style.label}
    </span>
  );
};

export default StatusBadge;