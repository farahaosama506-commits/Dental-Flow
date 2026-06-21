"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { Patient } from "@/types/database";

// جلب جميع المرضى
export async function getPatients(): Promise<Patient[]> {
  const supabase = await createClient();
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) return [];

  const { data, error } = await supabase
    .from("patients")
    .select("*")
    .eq("doctor_id", user.user.id)
    .order("created_at", { ascending: false });

  if (error) return [];
  return data || [];
}

// إضافة مريض
export async function addPatient(formData: FormData) {
  const supabase = await createClient();
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) return { error: "Not authenticated" };

  const { error } = await supabase.from("patients").insert({
    doctor_id: user.user.id,
    full_name: formData.get("full_name") as string,
    email: formData.get("email") as string || null,
    phone: formData.get("phone") as string || null,
    age: parseInt(formData.get("age") as string) || null,
    gender: formData.get("gender") as string || null,
    insurance_number: formData.get("insurance_number") as string || null,
    health_status: formData.get("health_status") as string || "good",
    previous_records: formData.get("previous_records") as string || null,
    current_condition: formData.get("current_condition") as string || "",
    estimated_cost: parseFloat(formData.get("estimated_cost") as string) || 0,
  });

  if (error) return { error: error.message };

  revalidatePath("/patients");
  return { success: true };
}

// حذف مريض
export async function deletePatient(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("patients").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/patients");
  return { success: true };
}