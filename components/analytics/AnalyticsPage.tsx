"use client";

import React from "react";
import { analyticsData } from "@/data/analyticsData";
import PageHeader from "@/components/ui/PageHeader";

const AnalyticsPage: React.FC = () => {
  const maxRevenue = Math.max(
    ...analyticsData.monthlyStats.map((m) => m.revenue)
  );
  const maxAppointments = Math.max(
    ...analyticsData.monthlyStats.map((m) => m.appointments)
  );

  return (
    <div>
      <PageHeader
        title="Analytics"
        subtitle="Clinic performance and insights"
        icon="fa-chart-pie"
      />

      {/* Top Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-card p-4 shadow-card border border-gray-50">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-teal-light rounded-xl flex items-center justify-center">
              <i className="fas fa-users text-teal"></i>
            </div>
          </div>
          <p className="text-sm text-gray-secondary">Total Patients</p>
          <p className="text-2xl font-bold text-navy">
            {analyticsData.totalPatients.toLocaleString()}
          </p>
        </div>
        <div className="bg-white rounded-card p-4 shadow-card border border-gray-50">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-green-light rounded-xl flex items-center justify-center">
              <i className="fas fa-calendar-check text-green-soft"></i>
            </div>
          </div>
          <p className="text-sm text-gray-secondary">Total Appointments</p>
          <p className="text-2xl font-bold text-navy">
            {analyticsData.totalAppointments.toLocaleString()}
          </p>
        </div>
        <div className="bg-white rounded-card p-4 shadow-card border border-gray-50">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-navy/10 rounded-xl flex items-center justify-center">
              <i className="fas fa-dollar-sign text-navy"></i>
            </div>
          </div>
          <p className="text-sm text-gray-secondary">Total Revenue</p>
          <p className="text-2xl font-bold text-navy">
            ${analyticsData.totalRevenue.toLocaleString()}
          </p>
        </div>
        <div className="bg-white rounded-card p-4 shadow-card border border-gray-50">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center">
              <i className="fas fa-star text-accent-orange"></i>
            </div>
          </div>
          <p className="text-sm text-gray-secondary">Average Rating</p>
          <p className="text-2xl font-bold text-navy">
            {analyticsData.averageRating}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Monthly Revenue Chart */}
        <div className="bg-white rounded-card p-5 shadow-card border border-gray-50">
          <h3 className="font-semibold text-navy mb-4">Monthly Revenue</h3>
          <div className="flex items-end gap-3 h-48">
            {analyticsData.monthlyStats.map((month) => (
              <div key={month.month} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-xs font-semibold text-gray-800">
                  ${(month.revenue / 1000).toFixed(1)}k
                </span>
                <div
                  className="w-full bg-teal rounded-t-lg transition-all hover:bg-teal-dark"
                  style={{
                    height: `${(month.revenue / maxRevenue) * 100}%`,
                  }}
                ></div>
                <span className="text-xs text-gray-secondary">{month.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Appointments Chart */}
        <div className="bg-white rounded-card p-5 shadow-card border border-gray-50">
          <h3 className="font-semibold text-navy mb-4">Monthly Appointments</h3>
          <div className="flex items-end gap-3 h-48">
            {analyticsData.monthlyStats.map((month) => (
              <div key={month.month} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-xs font-semibold text-gray-800">
                  {month.appointments}
                </span>
                <div
                  className="w-full bg-green-soft rounded-t-lg transition-all hover:bg-teal"
                  style={{
                    height: `${(month.appointments / maxAppointments) * 100}%`,
                  }}
                ></div>
                <span className="text-xs text-gray-secondary">{month.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Treatment Distribution */}
        <div className="bg-white rounded-card p-5 shadow-card border border-gray-50">
          <h3 className="font-semibold text-navy mb-4">
            Treatment Distribution
          </h3>
          <div className="space-y-3">
            {analyticsData.treatmentDistribution.map((item) => (
              <div key={item.name}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-text">{item.name}</span>
                  <span className="text-navy font-semibold">
                    {item.count} ({item.percentage}%)
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className="bg-teal rounded-full h-2"
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Patient Demographics */}
        <div className="bg-white rounded-card p-5 shadow-card border border-gray-50">
          <h3 className="font-semibold text-navy mb-4">
            Patient Demographics
          </h3>
          <div className="space-y-4">
            {analyticsData.patientDemographics.map((demo) => (
              <div key={demo.ageGroup}>
                <p className="text-sm font-medium text-gray-800 mb-2">
                  {demo.ageGroup} years
                </p>
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <div className="w-full bg-gray-100 rounded-full h-3">
                      <div
                        className="bg-navy rounded-full h-3"
                        style={{
                          width: `${
                            (demo.male / (demo.male + demo.female)) * 100
                          }%`,
                        }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-secondary mt-1">
                      Male: {demo.male}
                    </p>
                  </div>
                  <div className="flex-1">
                    <div className="w-full bg-gray-100 rounded-full h-3">
                      <div
                        className="bg-teal rounded-full h-3"
                        style={{
                          width: `${
                            (demo.female / (demo.male + demo.female)) * 100
                          }%`,
                        }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-secondary mt-1">
                      Female: {demo.female}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;