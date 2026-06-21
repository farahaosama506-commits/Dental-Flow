"use client";

import React from "react";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
  type?: "danger" | "warning";
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  loading = false,
  type = "danger",
}) => {
  if (!isOpen) return null;

  const colors = {
    danger: {
      icon: "bg-red-50 text-accent-red",
      button: "bg-accent-red hover:bg-red-700",
    },
    warning: {
      icon: "bg-orange-50 text-accent-orange",
      button: "bg-accent-orange hover:bg-orange-600",
    },
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 p-6 animate-in zoom-in-95 duration-200">
        {/* Icon */}
        <div
          className={`w-12 h-12 rounded-full ${colors[type].icon} flex items-center justify-center mx-auto mb-4`}
        >
          <i className="fas fa-exclamation-triangle text-xl"></i>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-navy text-center mb-2">
          {title}
        </h3>

        {/* Message */}
        <p className="text-sm text-gray-secondary text-center mb-6">
          {message}
        </p>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-text font-semibold rounded-button text-sm hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`flex-1 px-4 py-2.5 text-white font-semibold rounded-button text-sm transition-colors disabled:opacity-50 flex items-center justify-center gap-2 ${colors[type].button}`}
          >
            {loading ? (
              <>
                <i className="fas fa-spinner fa-spin"></i>
                Deleting...
              </>
            ) : (
              <>
                <i className="fas fa-trash-alt"></i>
                {confirmText}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;