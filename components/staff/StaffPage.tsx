"use client";

import React from "react";
import { staffList } from "@/data/staffData";
import PageHeader from "@/components/ui/PageHeader";

const StaffPage: React.FC = () => {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const statusColors = {
    available: "bg-green-light text-green-soft",
    busy: "bg-orange-50 text-accent-orange",
    off: "bg-gray-100 text-gray-500",
  };

  const statusLabels = {
    available: "Available",
    busy: "Busy",
    off: "Off Duty",
  };

  return (
    <div>
      <PageHeader
        title="Staff"
        subtitle="Manage clinic staff and schedules"
        icon="fa-user-tie"
        action={
          <button className="px-5 py-2.5 bg-green-soft hover:bg-teal text-white font-semibold rounded-button text-sm transition-colors shadow-sm flex items-center gap-2">
            <i className="fas fa-plus-circle"></i>
            Add Staff
          </button>
        }
      />

      {/* Staff Grid */}
      <div className="grid grid-cols-3 gap-5">
        {staffList.map((staff) => (
          <div
            key={staff.id}
            className="bg-white rounded-card shadow-card border border-gray-50 p-5 hover:shadow-hover transition-all"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-full bg-teal-light flex items-center justify-center">
                <span className="text-lg font-bold text-teal">
                  {getInitials(staff.name)}
                </span>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800">{staff.name}</h3>
                <p className="text-sm text-teal font-medium">{staff.role}</p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[staff.status]}`}
              >
                {statusLabels[staff.status]}
              </span>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-secondary">Specialization:</span>
                <span className="text-gray-800 font-medium">
                  {staff.specialization}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-secondary">Email:</span>
                <span className="text-gray-800 font-medium">{staff.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-secondary">Phone:</span>
                <span className="text-gray-800 font-medium">{staff.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-secondary">Patients Today:</span>
                <span className="text-navy font-bold">
                  {staff.patientsToday}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-secondary">Rating:</span>
                <span className="text-accent-orange font-semibold">
                  <i className="fas fa-star text-xs mr-1"></i>
                  {staff.rating}
                </span>
              </div>
            </div>

            <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
              <button className="flex-1 py-2 text-sm font-semibold text-teal border border-teal rounded-button hover:bg-teal-light transition-colors">
                View Schedule
              </button>
              <button className="flex-1 py-2 text-sm font-semibold text-gray-text bg-gray-card rounded-button hover:bg-gray-100 transition-colors">
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StaffPage;