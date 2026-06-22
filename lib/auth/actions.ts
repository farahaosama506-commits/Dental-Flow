"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function login(formData: FormData): Promise<{ error?: string; success?: boolean }> {
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  });
  if (error) return { error: "بريد إلكتروني أو كلمة مرور غير صحيحة" };
  revalidatePath("/", "layout");
  return { success: true };
}

export async function signup(formData: FormData): Promise<{ error?: string; success?: boolean; message?: string }> {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    options: {
      data: {
        full_name: formData.get("full_name") as string,
        specialization: formData.get("specialization") as string,
      },
    },
  });

  if (error) {
    if (error.message.includes("already registered")) {
      return { error: "هذا البريد مسجل بالفعل. الرجاء تسجيل الدخول." };
    }
    return { error: error.message };
  }

  return { success: true, message: "تم إنشاء الحساب! تحقق من بريدك الإلكتروني." };
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/auth/login");
}