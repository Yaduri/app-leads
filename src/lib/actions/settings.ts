"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/lib/actions/leads";
import type { Lead } from "@/lib/types";

export async function getLeadsForExport(): Promise<
  { ok: true; leads: Lead[] } | { ok: false; error: string }
> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, error: "Sessão expirada. Faça login novamente." };
  }

  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return {
      ok: false,
      error: error.message ?? "Não foi possível carregar os leads para exportação.",
    };
  }

  return { ok: true, leads: (data as Lead[]) ?? [] };
}

export async function deleteAllLeads(): Promise<ActionResult> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, error: "Sessão expirada. Faça login novamente." };
  }

  const { error } = await supabase
    .from("leads")
    .delete()
    .eq("user_id", user.id);

  if (error) {
    console.error("Error deleting all leads:", error);
    return {
      ok: false,
      error: error.message ?? "Não foi possível apagar os leads.",
    };
  }

  revalidatePath("/leads");
  revalidatePath("/dashboard");
  revalidatePath("/configuracoes");

  return { ok: true };
}

export async function updateUsername(name: string): Promise<ActionResult> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, error: "Sessão expirada. Faça login novamente." };
  }

  const { error } = await supabase.auth.updateUser({
    data: { user_name: name.trim() },
  });

  if (error) {
    console.error("Error updating username:", error);
    return {
      ok: false,
      error: error.message ?? "Não foi possível atualizar o nome de usuário.",
    };
  }

  revalidatePath("/");
  return { ok: true };
}
