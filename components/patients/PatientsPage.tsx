"use client";

import React, { useState, useEffect } from "react";
import { getPatients, deletePatient } from "@/lib/db/patients";
import AddPatientModal from "@/components/patients/AddPatientModal";
import PageHeader from "@/components/ui/PageHeader";
import type { Patient } from "@/types/database";

const PatientsPage: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadPatients = async () => {
    const data = await getPatients();
    setPatients(data);
    setLoading(false);
  };

  useEffect(() => {
    loadPatients();
  }, []);

  const filteredPatients = patients.filter(
    (p) =>
      p.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.email && p.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleDelete = async (id: string) => {
    if (confirm("Delete this patient?")) {
      await deletePatient(id);
      loadPatients();
    }
  };

  const getInitials = (name: string) => name.split(" ").map(n => n[0]).join("").toUpperCase();

  return (
    <div>
      <PageHeader
        title="Patients"
        subtitle="Manage patient records"
        icon="fa-user-group"
        action={
          <button onClick={() => setIsModalOpen(true)} className="px-5 py-2.5 bg-green-soft hover:bg-teal text-white font-semibold rounded-button text-sm">
            <i className="fas fa-plus-circle me-2"></i>Add Patient
          </button>
        }
      />

      <div className="relative mb-6">
        <i className="fas fa-search absolute start-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
        <input
          type="text" placeholder="Search patients..." value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full ps-11 pe-4 py-3 bg-white border border-gray-200 rounded-xl text-sm"
        />
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-secondary"><i className="fas fa-spinner fa-spin me-2"></i>Loading...</div>
      ) : (
        <div className="patients-grid">
          {filteredPatients.map((patient) => (
            <div key={patient.id} className="bg-white rounded-card shadow-card border border-gray-50 p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full bg-teal-light flex items-center justify-center">
                  <span className="font-bold text-teal">{getInitials(patient.full_name)}</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-800">{patient.full_name}</p>
                  <p className="text-xs text-gray-secondary">{patient.age} years • {patient.gender}</p>
                </div>
                <span className={`ms-auto px-2 py-1 rounded-full text-xs ${patient.health_status === 'good' ? 'bg-green-light text-green-soft' : 'bg-orange-50 text-accent-orange'}`}>
                  {patient.health_status}
                </span>
              </div>
              <div className="text-sm space-y-1 text-gray-text">
                <p><span className="text-gray-secondary">Phone:</span> {patient.phone || '-'}</p>
                <p><span className="text-gray-secondary">Insurance:</span> {patient.insurance_number || '-'}</p>
                <p><span className="text-gray-secondary">Condition:</span> {patient.current_condition || '-'}</p>
                <p><span className="text-gray-secondary">Cost:</span> ${patient.estimated_cost}</p>
              </div>
              <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
                <button className="flex-1 py-2 text-sm font-semibold text-teal border border-teal rounded-button hover:bg-teal-light">View</button>
                <button onClick={() => handleDelete(patient.id)} className="flex-1 py-2 text-sm font-semibold text-accent-red border border-accent-red/20 rounded-button hover:bg-red-50">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <AddPatientModal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); loadPatients(); }} />
    </div>
  );
};

export default PatientsPage;