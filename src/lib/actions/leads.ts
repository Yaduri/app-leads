"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import type { LeadInsert, LeadStatus } from "@/lib/types";

export type ActionResult =
  | { ok: true }
  | { ok: false; error: string };

async function getUserId(supabase: Awaited<ReturnType<typeof createClient>>) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user?.id ?? null;
}

function validateLeadInput(values: Omit<LeadInsert, "user_id">) {
  if (!values.nome || values.nome.trim().length === 0) {
    return "O campo Nome é obrigatório.";
  }
  return null;
}

function mapError(error: { message?: string } | null): string {
  return (
    error?.message ??
    "Algo deu errado. Verifique sua conexão e tente novamente."
  );
}

export async function createLead(
  values: Omit<LeadInsert, "user_id">,
): Promise<ActionResult> {
  const supabase = await createClient();
  const userId = await getUserId(supabase);
  if (!userId) return { ok: false, error: "Sessão expirada. Entre novamente." };

  const invalid = validateLeadInput(values);
  if (invalid) return { ok: false, error: invalid };

  const { error } = await supabase
    .from("leads")
    .insert({ ...values, user_id: userId });

  if (error) return { ok: false, error: mapError(error) };

  revalidatePath("/leads");
  revalidatePath("/dashboard");
  return { ok: true };
}

export async function updateLead(
  id: string,
  values: Omit<LeadInsert, "user_id">,
): Promise<ActionResult> {
  const supabase = await createClient();
  const userId = await getUserId(supabase);
  if (!userId) return { ok: false, error: "Sessão expirada. Entre novamente." };

  const invalid = validateLeadInput(values);
  if (invalid) return { ok: false, error: invalid };

  const { error } = await supabase
    .from("leads")
    .update(values)
    .eq("id", id)
    .eq("user_id", userId);

  if (error) return { ok: false, error: mapError(error) };

  revalidatePath("/leads");
  revalidatePath("/dashboard");
  return { ok: true };
}

export async function updateLeadStatus(
  id: string,
  status: LeadStatus,
): Promise<ActionResult> {
  const supabase = await createClient();
  const userId = await getUserId(supabase);
  if (!userId) return { ok: false, error: "Sessão expirada. Entre novamente." };

  const { error } = await supabase
    .from("leads")
    .update({ status_prospeccao: status })
    .eq("id", id)
    .eq("user_id", userId);

  if (error) return { ok: false, error: mapError(error) };

  revalidatePath("/leads");
  revalidatePath("/dashboard");
  return { ok: true };
}

export async function deleteLead(id: string): Promise<ActionResult> {
  const supabase = await createClient();
  const userId = await getUserId(supabase);
  if (!userId) return { ok: false, error: "Sessão expirada. Entre novamente." };

  const { error } = await supabase
    .from("leads")
    .delete()
    .eq("id", id)
    .eq("user_id", userId);

  if (error) return { ok: false, error: mapError(error) };

  revalidatePath("/leads");
  revalidatePath("/dashboard");
  return { ok: true };
}

export async function importLeads(
  rows: Omit<LeadInsert, "user_id">[],
): Promise<{ ok: boolean; inserted: number; failed: number; error?: string }> {
  const supabase = await createClient();
  const userId = await getUserId(supabase);
  if (!userId) {
    return { ok: false, inserted: 0, failed: rows.length, error: "Sessão expirada." };
  }

  const CHUNK_SIZE = 100;
  let inserted = 0;
  let failed = 0;

  for (let i = 0; i < rows.length; i += CHUNK_SIZE) {
    const chunk = rows
      .slice(i, i + CHUNK_SIZE)
      .map((row) => ({ ...row, user_id: userId }));

    const { error } = await supabase.from("leads").insert(chunk);
    if (error) failed += chunk.length;
    else inserted += chunk.length;
  }

  revalidatePath("/leads");
  revalidatePath("/dashboard");
  return { ok: failed === 0, inserted, failed };
}

export async function bulkUpdateLeadStatus(
  ids: string[],
  nextStatus: LeadStatus,
): Promise<ActionResult> {
  if (ids.length === 0) return { ok: true };

  const supabase = await createClient();
  const userId = await getUserId(supabase);
  if (!userId) return { ok: false, error: "Sessão expirada. Entre novamente." };

  const { error } = await supabase
    .from("leads")
    .update({ status_prospeccao: nextStatus })
    .in("id", ids)
    .eq("user_id", userId);

  if (error) return { ok: false, error: mapError(error) };

  revalidatePath("/leads");
  revalidatePath("/dashboard");
  return { ok: true };
}

export async function bulkDeleteLeads(
  ids: string[],
): Promise<ActionResult> {
  if (ids.length === 0) return { ok: true };

  const supabase = await createClient();
  const userId = await getUserId(supabase);
  if (!userId) return { ok: false, error: "Sessão expirada. Entre novamente." };

  const { error } = await supabase
    .from("leads")
    .delete()
    .in("id", ids)
    .eq("user_id", userId);

  if (error) return { ok: false, error: mapError(error) };

  revalidatePath("/leads");
  revalidatePath("/dashboard");
  return { ok: true };
}