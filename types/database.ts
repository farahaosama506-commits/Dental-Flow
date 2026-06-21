export interface Doctor {
  id: string;
  email: string;
  full_name: string;
  specialization: string;
  phone: string;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Patient {
  id: string;
  doctor_id: string;
  full_name: string;
  email: string;
  phone: string;
  age: number;
  gender: "male" | "female";
  insurance_number: string | null;
  health_status: "good" | "fair" | "serious" | "critical";
  previous_records: string | null;
  current_condition: string;
  estimated_cost: number;
  created_at: string;
  updated_at: string;
}

export interface Appointment {
  id: string;
  doctor_id: string;
  patient_id: string;
  treatment_id: string;
  appointment_date: string;
  appointment_time: string;
  status: "scheduled" | "in-progress" | "completed" | "cancelled";
  notes: string | null;
  created_at: string;
  updated_at: string;
  // Relations
  patient?: Patient;
  treatment?: Treatment;
}

export interface Treatment {
  id: string;
  name: string;
  category: string;
  duration_minutes: number;
  price: number;
  description: string;
  created_at: string;
}

export interface DashboardStats {
  totalPatients: number;
  todayAppointments: number;
  monthlyRevenue: number;
  appointmentsByStatus: {
    scheduled: number;
    "in-progress": number;
    completed: number;
    cancelled: number;
  };
}