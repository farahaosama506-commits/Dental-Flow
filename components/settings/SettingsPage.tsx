"use client";

import React, { useState } from "react";
import PageHeader from "@/components/ui/PageHeader";

const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("general");

  const tabs = [
    { id: "general", label: "General", icon: "fa-gear" },
    { id: "notifications", label: "Notifications", icon: "fa-bell" },
    { id: "working-hours", label: "Working Hours", icon: "fa-clock" },
    { id: "language", label: "Language", icon: "fa-language" },
  ];

  return (
    <div>
      <PageHeader
        title="Settings"
        subtitle="Manage clinic settings and preferences"
        icon="fa-gear"
      />

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-button text-sm font-semibold transition-colors ${
              activeTab === tab.id
                ? "bg-navy text-white"
                : "bg-gray-card text-gray-text hover:bg-gray-100"
            }`}
          >
            <i className={`fas ${tab.icon}`}></i>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="bg-white rounded-card shadow-card border border-gray-50 p-6">
        {activeTab === "general" && (
          <div className="space-y-5">
            <h3 className="text-lg font-semibold text-navy">
              General Settings
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-text mb-1">
                  Clinic Name
                </label>
                <input
                  type="text"
                  defaultValue="DentalFlow Clinic"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-teal focus:ring-2 focus:ring-teal-light"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-text mb-1">
                  Email
                </label>
                <input
                  type="email"
                  defaultValue="info@dentalflow.com"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-teal focus:ring-2 focus:ring-teal-light"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-text mb-1">
                  Phone
                </label>
                <input
                  type="text"
                  defaultValue="+1 (555) 000-0000"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-teal focus:ring-2 focus:ring-teal-light"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-text mb-1">
                  Address
                </label>
                <input
                  type="text"
                  defaultValue="123 Medical Center Dr."
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-teal focus:ring-2 focus:ring-teal-light"
                />
              </div>
            </div>
            <button className="px-6 py-2.5 bg-teal hover:bg-teal-dark text-white font-semibold rounded-button text-sm transition-colors">
              Save Changes
            </button>
          </div>
        )}

        {activeTab === "notifications" && (
          <div className="space-y-5">
            <h3 className="text-lg font-semibold text-navy">
              Notification Preferences
            </h3>
            <div className="space-y-4">
              {[
                {
                  title: "Email Notifications",
                  description: "Receive appointment reminders via email",
                  defaultChecked: true,
                },
                {
                  title: "SMS Notifications",
                  description: "Receive appointment reminders via SMS",
                  defaultChecked: true,
                },
                {
                  title: "Push Notifications",
                  description: "Receive push notifications in browser",
                  defaultChecked: false,
                },
              ].map((notif) => (
                <div
                  key={notif.title}
                  className="flex items-center justify-between p-4 bg-gray-card rounded-xl"
                >
                  <div>
                    <p className="font-semibold text-gray-800">
                      {notif.title}
                    </p>
                    <p className="text-sm text-gray-secondary">
                      {notif.description}
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      defaultChecked={notif.defaultChecked}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-light rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "working-hours" && (
          <div className="space-y-5">
            <h3 className="text-lg font-semibold text-navy">
              Working Hours
            </h3>
            <div className="space-y-3">
              {[
                { day: "Monday", open: "8:00 AM", close: "6:00 PM", isOpen: true },
                { day: "Tuesday", open: "8:00 AM", close: "6:00 PM", isOpen: true },
                { day: "Wednesday", open: "8:00 AM", close: "6:00 PM", isOpen: true },
                { day: "Thursday", open: "8:00 AM", close: "6:00 PM", isOpen: true },
                { day: "Friday", open: "8:00 AM", close: "4:00 PM", isOpen: true },
                { day: "Saturday", open: "9:00 AM", close: "2:00 PM", isOpen: true },
                { day: "Sunday", open: "Closed", close: "Closed", isOpen: false },
              ].map((day) => (
                <div
                  key={day.day}
                  className="flex items-center justify-between p-3 bg-gray-card rounded-xl"
                >
                  <div className="flex items-center gap-4">
                    <span className="font-semibold text-gray-800 w-24">
                      {day.day}
                    </span>
                    {day.isOpen ? (
                      <span className="text-sm text-gray-text">
                        {day.open} - {day.close}
                      </span>
                    ) : (
                      <span className="text-sm text-accent-red font-medium">
                        Closed
                      </span>
                    )}
                  </div>
                  <button className="text-teal hover:text-teal-dark transition-colors">
                    <i className="fas fa-edit"></i>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "language" && (
          <div className="space-y-5">
            <h3 className="text-lg font-semibold text-navy">
              Language Settings
            </h3>
            <div className="space-y-3">
              {[
                { lang: "English", code: "en", active: true },
                { lang: "Arabic (العربية)", code: "ar", active: false },
              ].map((language) => (
                <div
                  key={language.code}
                  className="flex items-center justify-between p-4 bg-gray-card rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">
                      {language.code === "en" ? "🇺🇸" : "🇸🇦"}
                    </span>
                    <span className="font-semibold text-gray-800">
                      {language.lang}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    {language.active && (
                      <span className="text-xs bg-teal-light text-teal px-3 py-1 rounded-full font-semibold">
                        Active
                      </span>
                    )}
                    <button
                      className={`px-4 py-2 rounded-button text-sm font-semibold transition-colors ${
                        language.active
                          ? "bg-gray-200 text-gray-text cursor-not-allowed"
                          : "bg-teal text-white hover:bg-teal-dark"
                      }`}
                      disabled={language.active}
                    >
                      {language.active ? "Current" : "Activate"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsPage;