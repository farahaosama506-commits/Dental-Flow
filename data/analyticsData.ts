import { AnalyticsData } from "@/types";

export const analyticsData: AnalyticsData = {
  totalPatients: 1248,
  totalAppointments: 3562,
  totalRevenue: 285400,
  averageRating: 4.8,
  monthlyStats: [
    { month: "Jan", patients: 180, appointments: 520, revenue: 42000 },
    { month: "Feb", patients: 165, appointments: 480, revenue: 38500 },
    { month: "Mar", patients: 195, appointments: 550, revenue: 44500 },
    { month: "Apr", patients: 210, appointments: 590, revenue: 47800 },
    { month: "May", patients: 228, appointments: 620, revenue: 50200 },
    { month: "Jun", patients: 270, appointments: 802, revenue: 62400 },
  ],
  treatmentDistribution: [
    { name: "Root Canal", count: 245, percentage: 18 },
    { name: "Cleaning", count: 520, percentage: 38 },
    { name: "Whitening", count: 180, percentage: 13 },
    { name: "Filling", count: 210, percentage: 15 },
    { name: "Extraction", count: 120, percentage: 9 },
    { name: "Other", count: 95, percentage: 7 },
  ],
  patientDemographics: [
    { ageGroup: "18-25", male: 120, female: 150 },
    { ageGroup: "26-35", male: 200, female: 230 },
    { ageGroup: "36-45", male: 180, female: 195 },
    { ageGroup: "46-55", male: 140, female: 160 },
    { ageGroup: "56+", male: 90, female: 110 },
  ],
};