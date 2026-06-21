"use client";

import React, { useState } from "react";
import Modal from "@/components/ui/Modal";
import { useTranslations } from "next-intl";
import { addPatient } from "@/lib/db/patients";

interface AddPatientModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddPatientModal: React.FC<AddPatientModalProps> = ({ isOpen, onClose }) => {
  const t = useTranslations("patients");
  const commonT = useTranslations("common");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const result = await addPatient(formData);

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
    <Modal isOpen={isOpen} onClose={onClose} title={t("addPatient")} size="lg">
      {isSuccess ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-green-light rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-check-circle text-green-soft text-3xl"></i>
          </div>
          <h3 className="text-lg font-bold text-navy mb-2">Patient Added!</h3>
          <p className="text-gray-secondary text-sm">Saved to database.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 text-accent-red px-4 py-2 rounded-xl text-sm">{error}</div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name *</label>
              <input type="text" name="full_name" required className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-teal focus:ring-2 focus:ring-teal-light" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Age</label>
              <input type="number" name="age" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-teal focus:ring-2 focus:ring-teal-light" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Insurance Number</label>
              <input type="text" name="insurance_number" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-teal focus:ring-2 focus:ring-teal-light" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Gender</label>
              <select name="gender" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-teal focus:ring-2 focus:ring-teal-light">
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Phone</label>
              <input type="tel" name="phone" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-teal focus:ring-2 focus:ring-teal-light" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
              <input type="email" name="email" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-teal focus:ring-2 focus:ring-teal-light" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Health Status *</label>
            <select name="health_status" required className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-teal focus:ring-2 focus:ring-teal-light">
              <option value="good">Good</option>
              <option value="fair">Fair</option>
              <option value="serious">Serious</option>
              <option value="critical">Critical</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Previous Records</label>
            <textarea name="previous_records" rows={2} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-teal focus:ring-2 focus:ring-teal-light resize-none"></textarea>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Current Condition *</label>
            <textarea name="current_condition" required rows={2} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-teal focus:ring-2 focus:ring-teal-light resize-none"></textarea>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Estimated Cost ($)</label>
            <input type="number" name="estimated_cost" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-teal focus:ring-2 focus:ring-teal-light" />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-text font-semibold rounded-button text-sm">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="flex-1 px-4 py-2.5 bg-green-soft hover:bg-teal text-white font-semibold rounded-button text-sm">
              {isSubmitting ? "Saving..." : "Save Patient"}
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
};

export default AddPatientModal;