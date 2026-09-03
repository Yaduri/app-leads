import { cache } from "react";
import { createClient } from "@/lib/supabase/server";

/**
 * Retorna o usuário autenticado da sessão atual com cache por requisição (React.cache).
 * Se o Layout e a Page chamarem esta função na mesma renderização,
 * apenas 1 chamada de rede é feita ao Supabase, eliminando latência repetida.
 */
export const getCurrentUser = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
});
