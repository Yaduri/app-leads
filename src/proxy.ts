import type { NextRequest } from "next/server";

import { updateSession } from "@/lib/supabase/middleware";

/**
 * Next.js 16: o arquivo middleware.ts foi renomeado para proxy.ts.
 * Responsavel por proteger as rotas /dashboard, /leads e /importar
 * e manter a sessao do Supabase atualizada.
 */
export async function proxy(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Roda em todas as rotas, exceto:
     * - _next/static (arquivos estaticos)
     * - _next/image (otimizacao de imagem)
     * - favicon e imagens
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};