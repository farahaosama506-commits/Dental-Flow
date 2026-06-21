"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type DoctorProfile = {
  id: string;
  email: string;
  full_name: string;
  specialization: string;
  phone: string | null;
  avatar_url: string | null;
};

export async function getDoctorProfile(): Promise<DoctorProfile | null> {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return null;

  const { data } = await supabase
    .from("doctors")
    .select("*")
    .eq("id", userData.user.id)
    .single();

  if (!data) return null;

  return {
    id: String(data.id || ""),
    email: String(data.email || userData.user.email || ""),
    full_name: String(data.full_name || ""),
    specialization: String(data.specialization || ""),
    phone: data.phone || null,
    avatar_url: data.avatar_url || null,
  };
}

export async function updateDoctorProfile(formData: FormData) {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return { error: "غير مصرح" };

  const full_name = formData.get("full_name") as string;
  const specialization = formData.get("specialization") as string;
  const phone = formData.get("phone") as string;

  const { error } = await supabase
    .from("doctors")
    .update({
      full_name,
      specialization: specialization || "General Dentistry",
      phone: phone || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", userData.user.id);

  if (error) return { error: error.message };

  // تحديث الاسم في auth metadata أيضاً
  await supabase.auth.updateUser({
    data: { full_name, specialization },
  });

  revalidatePath("/profile");
  revalidatePath("/");
  return { success: true, message: "تم تحديث الملف الشخصي بنجاح" };
}