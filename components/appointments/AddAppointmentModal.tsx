"use client";

import React, { useState, useEffect } from "react";
import Modal from "@/components/ui/Modal";
import { useTranslations } from "next-intl";
import { addAppointment } from "@/lib/db/appointments";
import { getTreatments } from "@/lib/db/treatments";
import type { Treatment } from "@/types/database";

interface AddAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddAppointmentModal: React.FC<AddAppointmentModalProps> = ({ isOpen, onClose }) => {
  const t = useTranslations("appointments");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");
  const [treatments, setTreatments] = useState<Treatment[]>([]);

  useEffect(() => {
    if (isOpen) {
      getTreatments().then(setTreatments);
    }
  }, [isOpen]);

  const now = new Date();
  const hours = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, "0"));
  const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString().padStart(2, "0"));
  const months = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
  const years = Array.from({ length: 3 }, (_, i) => (now.getFullYear() + i).toString());

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const result = await addAppointment(formData);

    if (result.error) {
      setError(result.error);
      setIsSubmitting(false);
    } else {
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        (e.target as HTMLFormElement).reset();
        onClose();
      }, 1500);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="New Appointment" size="lg">
      {isSuccess ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-green-light rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-check-circle text-green-soft text-3xl"></i>
          </div>
          <h3 className="text-lg font-bold text-navy mb-2">Appointment Scheduled!</h3>
          <p className="text-gray-secondary text-sm">Saved to database.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 text-accent-red px-4 py-2 rounded-xl text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Patient Name *
            </label>
            <input
              type="text"
              name="patient_name"
              required
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-teal focus:ring-2 focus:ring-teal-light"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Medical Condition
            </label>
            <textarea
              name="medical_condition"
              rows={2}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-teal focus:ring-2 focus:ring-teal-light resize-none"
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Date & Time *
            </label>
            <div className="grid grid-cols-5 gap-2">
              <div>
                <label className="text-xs text-gray-secondary">Year</label>
                <select
                  name="year"
                  defaultValue={now.getFullYear().toString()}
                  className="w-full px-2 py-2 border border-gray-200 rounded-xl text-sm"
                >
                  {years.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-secondary">Month</label>
                <select
                  name="month"
                  defaultValue={(now.getMonth() + 1).toString().padStart(2, "0")}
                  className="w-full px-2 py-2 border border-gray-200 rounded-xl text-sm"
                >
                  {months.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-secondary">Day</label>
                <select
                  name="day"
                  defaultValue={now.getDate().toString().padStart(2, "0")}
                  className="w-full px-2 py-2 border border-gray-200 rounded-xl text-sm"
                >
                  {days.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-secondary">Hour</label>
                <select
                  name="hour"
                  defaultValue="09"
                  className="w-full px-2 py-2 border border-gray-200 rounded-xl text-sm"
                >
                  {hours.map((h) => (
                    <option key={h} value={h}>
                      {h}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-secondary">AM/PM</label>
                <select
                  name="ampm"
                  className="w-full px-2 py-2 border border-gray-200 rounded-xl text-sm"
                >
                  <option value="AM">AM</option>
                  <option value="PM">PM</option>
                </select>
              </div>
            </div>
            <input type="hidden" name="minute" value="00" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Treatment
            </label>
            <select
              name="treatment"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm"
            >
              <option value="">Select treatment</option>
              {treatments.map((treat) => (
                <option key={treat.id} value={treat.name}>
                  {treat.name} (${treat.price})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              name="notes"
              rows={2}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm resize-none"
            ></textarea>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-text font-semibold rounded-button text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2.5 bg-green-soft hover:bg-teal text-white font-semibold rounded-button text-sm"
            >
              {isSubmitting ? "Scheduling..." : "Schedule Appointment"}
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
};

export default AddAppointmentModal;