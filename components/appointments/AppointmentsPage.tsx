"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  getAppointments,
  deleteAppointment,
  updateAppointmentStatus,
} from "@/lib/db/appointments";
import AddAppointmentModal from "@/components/appointments/AddAppointmentModal";
import ConfirmModal from "@/components/ui/ConfirmModal";
import StatusBadge from "@/components/ui/StatusBadge";
import PageHeader from "@/components/ui/PageHeader";

type AppointmentRow = {
  id: string;
  appointment_date: string;
  appointment_time: string;
  status: string;
  notes: string | null;
  patient: { id: string; full_name: string } | null;
  treatment: { id: string; name: string } | null;
};

const AppointmentsPage: React.FC = () => {
  const [appointments, setAppointments] = useState<AppointmentRow[]>([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Confirm Dialog
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const load = useCallback(async () => {
    const data = await getAppointments();
    setAppointments(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filtered =
    filter === "all"
      ? appointments
      : appointments.filter((a) => a.status === filter);

  const openDeleteConfirm = (id: string) => {
    setDeleteTarget(id);
    setConfirmOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setActionLoading(deleteTarget);
    await deleteAppointment(deleteTarget);
    setConfirmOpen(false);
    setDeleteTarget(null);
    setActionLoading(null);
    await load();
  };

  const handleStatus = async (id: string, status: string) => {
    setActionLoading(id);
    await updateAppointmentStatus(id, status);
    setActionLoading(null);
    await load();
  };

  const formatTime = (t: string) => {
    const [h] = t.split(":");
    const hour = parseInt(h);
    const ampm = hour >= 12 ? "PM" : "AM";
    const h12 = hour % 12 || 12;
    return `${h12}:00 ${ampm}`;
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  const getInitials = (n: string) =>
    n
      .split(" ")
      .map((w) => w[0])
      .join("")
      .toUpperCase();

  const filters = [
    { v: "all", l: "All" },
    { v: "scheduled", l: "Scheduled" },
    { v: "in-progress", l: "In Progress" },
    { v: "completed", l: "Completed" },
    { v: "cancelled", l: "Cancelled" },
  ];

  return (
    <div>
      <PageHeader
        title="Appointments"
        subtitle="Manage all patient appointments"
        icon="fa-calendar-check"
        action={
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-5 py-2.5 bg-green-soft hover:bg-teal text-white font-semibold rounded-button text-sm flex items-center gap-2"
          >
            <i className="fas fa-plus-circle"></i>New Appointment
          </button>
        }
      />

      {/* Filters */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {filters.map((f) => (
          <button
            key={f.v}
            onClick={() => setFilter(f.v)}
            className={`px-4 py-2 rounded-button text-sm font-semibold transition-colors ${
              filter === f.v
                ? "bg-navy text-white"
                : "bg-gray-card text-gray-text hover:bg-gray-100"
            }`}
          >
            {f.l}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className="text-center py-16">
          <i className="fas fa-spinner fa-spin text-2xl text-teal"></i>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-card shadow-card">
          <i className="fas fa-calendar-check text-4xl text-gray-300 mb-3 block"></i>
          <p className="text-gray-secondary">No appointments found</p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="mt-3 px-5 py-2 bg-teal text-white rounded-button text-sm font-semibold"
          >
            + Add Appointment
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-card shadow-card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-card border-b border-gray-100">
                <th className="text-start p-4 text-sm font-semibold text-gray-secondary">Patient</th>
                <th className="text-start p-4 text-sm font-semibold text-gray-secondary">Date</th>
                <th className="text-start p-4 text-sm font-semibold text-gray-secondary">Time</th>
                <th className="text-start p-4 text-sm font-semibold text-gray-secondary">Treatment</th>
                <th className="text-start p-4 text-sm font-semibold text-gray-secondary">Status</th>
                <th className="text-start p-4 text-sm font-semibold text-gray-secondary">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((apt) => (
                <tr key={apt.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-teal-light flex items-center justify-center">
                        <span className="text-xs font-bold text-teal">
                          {getInitials(apt.patient?.full_name || "?")}
                        </span>
                      </div>
                      <span className="font-semibold text-sm">
                        {apt.patient?.full_name || "Unknown"}
                      </span>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-gray-text">
                    {formatDate(apt.appointment_date)}
                  </td>
                  <td className="p-4 text-sm font-semibold text-navy">
                    {formatTime(apt.appointment_time)}
                  </td>
                  <td className="p-4 text-sm text-gray-text">
                    {apt.treatment?.name || "-"}
                  </td>
                  <td className="p-4">
                    <StatusBadge status={apt.status as any} />
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <select
                        value={apt.status}
                        onChange={(e) => handleStatus(apt.id, e.target.value)}
                        disabled={actionLoading === apt.id}
                        className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:border-teal disabled:opacity-50"
                      >
                        <option value="scheduled">Scheduled</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>

                      <button
                        onClick={() => openDeleteConfirm(apt.id)}
                        disabled={actionLoading === apt.id}
                        className="p-1.5 text-gray-400 hover:text-accent-red transition-colors disabled:opacity-50"
                        title="Delete"
                      >
                        {actionLoading === apt.id ? (
                          <i className="fas fa-spinner fa-spin text-xs"></i>
                        ) : (
                          <i className="fas fa-trash-alt"></i>
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Appointment Modal */}
      <AddAppointmentModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          load();
        }}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmOpen}
        onClose={() => {
          setConfirmOpen(false);
          setDeleteTarget(null);
        }}
        onConfirm={handleDelete}
        title="Delete Appointment"
        message="Are you sure you want to delete this appointment? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
        loading={!!deleteTarget && actionLoading === deleteTarget}
      />
    </div>
  );
};

export default AppointmentsPage;