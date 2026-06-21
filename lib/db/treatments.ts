"use server";

import { createClient } from "@/lib/supabase/server";
import type { Treatment } from "@/types/database";

export async function getTreatments(): Promise<Treatment[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("treatments")
    .select("*")
    .order("name");

  if (error) return [];
  return data || [];
}