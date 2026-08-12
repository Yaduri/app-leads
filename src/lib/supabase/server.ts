import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import type { Database } from "@/lib/schema";

/**
 * Cliente Supabase para uso no servidor (Server Components, Server Actions, Route Handlers).
 * Sempre crie um novo cliente por requisição/renderizacao.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // setAll e chamado a partir de um Server Component.
            // Pode ser ignorado, pois o proxy (proxy.ts) mantém a sessao atualizada.
          }
        },
      },
    },
  );
}