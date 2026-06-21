// ============ أنواع البيانات الأساسية ============

export interface Appointment {
  id: string;
  time: string;
  patientName: string;
  patientNameArabic?: string;
  treatment: string;
  status: "in-progress" | "waiting" | "confirmed" | "completed" | "cancelled";
  avatarUrl?: string;
  date: string;
  doctorName: string;
  notes?: string;
}

export interface StatsData {
  todaysPatients: {
    count: number;
    change: number;
  };
  totalRevenue: {
    amount: number;
    change: number;
  };
  cancellationRate: {
    rate: number;
    change: number;
  };
}

export interface PatientSatisfactionData {
  percentage: number;
  positive: number;
  neutral: number;
  negative: number;
}

export interface TomorrowEvent {
  id: string;
  doctorName?: string;
  type: string;
  time: string;
  patientsCount: number;
}

// ============ بيانات المرضى ============

export interface Patient {
  id: string;
  name: string;
  nameArabic?: string;
  age: number;
  gender: "Male" | "Female";
  phone: string;
  email: string;
  lastVisit: string;
  nextAppointment?: string;
  treatmentPlan: string;
  status: "active" | "inactive" | "new";
  avatarUrl?: string;
}

// ============ بيانات العلاجات ============

export interface Treatment {
  id: string;
  name: string;
  category: string;
  duration: string;
  price: number;
  description: string;
  popular: boolean;
  color: string;
}

// ============ بيانات الموظفين ============

export interface Staff {
  id: string;
  name: string;
  role: string;
  specialization: string;
  email: string;
  phone: string;
  status: "available" | "busy" | "off";
  avatarUrl?: string;
  patientsToday: number;
  rating: number;
}

// ============ بيانات التحليلات ============

export interface AnalyticsData {
  totalPatients: number;
  totalAppointments: number;
  totalRevenue: number;
  averageRating: number;
  monthlyStats: {
    month: string;
    patients: number;
    appointments: number;
    revenue: number;
  }[];
  treatmentDistribution: {
    name: string;
    count: number;
    percentage: number;
  }[];
  patientDemographics: {
    ageGroup: string;
    male: number;
    female: number;
  }[];
}

// ============ بيانات الإعدادات ============

export interface ClinicSettings {
  clinicName: string;
  address: string;
  phone: string;
  email: string;
  workingHours: {
    day: string;
    open: string;
    close: string;
    isOpen: boolean;
  }[];
  languages: string[];
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
}

export interface DashboardData {
  doctorName: string;
  doctorTitle: string;
  stats: StatsData;
  appointments: Appointment[];
  satisfaction: PatientSatisfactionData;
  tomorrowEvents: TomorrowEvent[];
}