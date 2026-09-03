import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { normalizeStatus } from "@/lib/csv/parse-leads-csv";
import { sanitizePhone } from "@/lib/whatsapp";
import type { LeadInsert } from "@/lib/types";

// Função para validar a chave de autenticação
function isAuthorized(req: NextRequest): boolean {
  const secret = process.env.CRM_API_KEY;
  // Se não foi configurado segredo no ambiente, permite requisições em modo de desenvolvimento
  if (!secret) return true;

  const authHeader = req.headers.get("authorization") || "";
  const token = authHeader.replace(/^Bearer\s+/i, "").trim();
  const apiKeyHeader = req.headers.get("x-api-key")?.trim() || "";

  return token === secret || apiKeyHeader === secret;
}

// Health check para testar conexão no crm_sync.py
export async function GET(req: NextRequest) {
  const authorized = isAuthorized(req);
  if (!authorized) {
    return NextResponse.json(
      { error: "Não autorizado. Token de API inválido ou ausente." },
      { status: 401 },
    );
  }

  return NextResponse.json({
    status: "online",
    message: "Endpoint do CRM de Leads está ativo e pronto para sincronizar!",
    timestamp: new Date().toISOString(),
  });
}

export async function POST(req: NextRequest) {
  try {
    if (!isAuthorized(req)) {
      return NextResponse.json(
        { error: "Não autorizado. Envie o token no Header Authorization: Bearer <TOKEN> ou x-api-key: <TOKEN>." },
        { status: 401 },
      );
    }

    const body = await req.json();

    // Suporta tanto objeto único quanto array em body ou body.leads
    const rawList: any[] = Array.isArray(body)
      ? body
      : Array.isArray(body.leads)
        ? body.leads
        : [body];

    if (rawList.length === 0) {
      return NextResponse.json(
        { error: "Nenhum lead fornecido no payload da requisição." },
        { status: 400 },
      );
    }

    const supabase = createAdminClient();

    // Determina o user_id de destino (via env, query param, header ou body)
    let targetUserId =
      process.env.CRM_USER_ID ||
      req.nextUrl.searchParams.get("user_id") ||
      req.headers.get("x-user-id") ||
      body?.user_id ||
      rawList[0]?.user_id;

    if (!targetUserId) {
      // Busca o user_id do primeiro lead cadastrado ou do usuário ativo
      const { data: existingLead } = await supabase
        .from("leads")
        .select("user_id")
        .limit(1)
        .maybeSingle();

      if (existingLead?.user_id) {
        targetUserId = existingLead.user_id;
      } else {
        // Busca na tabela de usuários do Supabase
        try {
          const { data: usersData } = await supabase.auth.admin.listUsers({ page: 1, perPage: 1 });
          if (usersData?.users?.[0]?.id) {
            targetUserId = usersData.users[0].id;
          }
        } catch {
          // ignora se anon key não puder listar
        }
      }
    }

    if (!targetUserId) {
      return NextResponse.json(
        {
          error:
            "Nenhum usuário informado para associar os leads. Copie a URL completa com ?user_id=... na aba Configurações do seu CRM ou configure a variável CRM_USER_ID na Vercel.",
        },
        { status: 400 },
      );
    }

    const todayStr = new Date().toISOString().split("T")[0];

    const leadsToInsert: LeadInsert[] = rawList.map((item) => {
      const nome =
        item.nome || item.name || item.razao_social || item.title || "Lead sem nome";
      const rawPhone = item.whatsapp || item.telefone || item.phone || item.celular || "";
      const cleanPhone = sanitizePhone(String(rawPhone));

      const nicho = item.nicho || item.category || item.categoria || item.segmento || null;
      const link_perfil = item.link_perfil || item.website || item.site || item.instagram || item.url || null;
      const status_prospeccao = item.status_prospeccao ? normalizeStatus(item.status_prospeccao) : "Novo Lead";
      const venda_realizada = item.venda_realizada || "Em aberto";
      const valor_venda = Number(item.valor_venda || item.valor || 0);
      const data_contato = item.data_contato || todayStr;
      const msg_a_mandar = item.msg_a_mandar || item.pitch || item.pitch_comercial || item.mensagem || null;

      // Monta as observações agregando Score, Diagnóstico e Notas se existirem
      const obsParts: string[] = [];
      if (item.score !== undefined && item.score !== null) {
        obsParts.push(`⭐ Score: ${item.score}/100`);
      }
      if (item.diagnostico) {
        obsParts.push(`🔍 Diagnóstico: ${item.diagnostico}`);
      }
      if (item.observacoes || item.notes) {
        obsParts.push(item.observacoes || item.notes);
      }
      const observacoes = obsParts.length > 0 ? obsParts.join("\n\n") : null;

      return {
        user_id: targetUserId,
        nome: String(nome).trim(),
        nicho: nicho ? String(nicho).trim() : null,
        whatsapp: cleanPhone,
        link_perfil: link_perfil ? String(link_perfil).trim() : null,
        status_prospeccao,
        venda_realizada,
        valor_venda: isNaN(valor_venda) ? 0 : Math.max(0, Math.round(valor_venda * 100) / 100),
        data_contato,
        msg_a_mandar: msg_a_mandar ? String(msg_a_mandar).trim() : null,
        observacoes,
      };
    });

    const { error: insertError } = await supabase
      .from("leads")
      .insert(leadsToInsert);

    if (insertError) {
      console.error("[CRM API /api/leads] Erro ao inserir leads:", insertError);
      return NextResponse.json(
        { error: "Erro ao gravar leads no banco: " + insertError.message },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: `${leadsToInsert.length} ${leadsToInsert.length === 1 ? "lead sincronizado" : "leads sincronizados"} com sucesso no CRM!`,
      count: leadsToInsert.length,
    });
  } catch (err: any) {
    console.error("[CRM API /api/leads] Erro inesperado:", err);
    return NextResponse.json(
      { error: "Erro interno no servidor ao processar requisição: " + (err?.message || String(err)) },
      { status: 500 },
    );
  }
}
