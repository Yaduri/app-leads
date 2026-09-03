import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/schema";

/**
 * Cliente Supabase com privilégios administrativos (bypassa RLS quando service_role é configurada).
 * Usado exclusivamente em rotas de API/Webhooks externas autenticadas com chave de API.
 */
export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    throw new Error("Supabase URL e Chave de API precisam estar configuradas no ambiente.");
  }

  return createClient<Database>(supabaseUrl, serviceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
