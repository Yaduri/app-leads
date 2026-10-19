import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { DailyActions, type UrgentLeadItem } from "@/components/dashboard/daily-actions";
import { MetricCards } from "@/components/dashboard/metric-cards";
import { NichoDistribution } from "@/components/dashboard/nicho-distribution";
import { getCurrentUser } from "@/lib/auth";
import { getFollowUpInfo } from "@/lib/follow-up";
import { createClient } from "@/lib/supabase/server";
import type { LeadStatus, SaleStatus } from "@/lib/types";

export const metadata: Metadata = {
  title: "Dashboard | CRM de Leads",
};

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const supabase = await createClient();

  const { data: leads } = await supabase
    .from("leads")
    .select(
      "id, nome, nicho, whatsapp, status_prospeccao, venda_realizada, valor_venda, valor_recorrente, etapa_entrega, data_contato, data_proximo_contato, msg_a_mandar",
    );

  const allLeads = leads ?? [];
  const total = allLeads.length;

  let vendasTotal = 0;
  let mrrTotal = 0;
  let producaoCount = 0;
  let negociacaoCount = 0;
  let followUpCount = 0;

  const urgentLeads: UrgentLeadItem[] = [];

  const nichoMap = new Map<
    string,
    { count: number; closed: number; revenue: number }
  >();

  allLeads.forEach((lead) => {
    const isClosed = lead.venda_realizada === "Sim";
    const isNegociacao =
      lead.status_prospeccao === "Em Negociação" ||
      lead.venda_realizada === "Negociação";

    if (isClosed) {
      vendasTotal += Number(lead.valor_venda ?? 0);
      mrrTotal += Number(lead.valor_recorrente ?? 0);
      if (lead.etapa_entrega !== "Site no Ar") {
        producaoCount += 1;
      }
    }

    if (isNegociacao) {
      negociacaoCount += 1;
    }

    const followInfo = getFollowUpInfo({
      data_proximo_contato: lead.data_proximo_contato,
      data_contato: lead.data_contato,
      status_prospeccao: (lead.status_prospeccao as LeadStatus) || "Novo Lead",
      venda_realizada: (lead.venda_realizada as SaleStatus) || "Em aberto",
    });

    if (followInfo.isOverdue || followInfo.isToday) {
      followUpCount += 1;
      urgentLeads.push({
        id: lead.id,
        nome: lead.nome,
        nicho: lead.nicho,
        whatsapp: lead.whatsapp,
        status_prospeccao: (lead.status_prospeccao as LeadStatus) || "Novo Lead",
        msg_a_mandar: lead.msg_a_mandar,
        urgency: followInfo.urgency,
        label: followInfo.label,
      });
    }

    const nichoKey = lead.nicho?.trim() || "Sem nicho";
    const curr = nichoMap.get(nichoKey) || { count: 0, closed: 0, revenue: 0 };
    curr.count += 1;
    if (isClosed) {
      curr.closed += 1;
      curr.revenue += Number(lead.valor_venda ?? 0);
    }
    nichoMap.set(nichoKey, curr);
  });

  // Ordenar urgentes: atrasados primeiro, depois hoje
  urgentLeads.sort((a, b) => {
    if (a.urgency === "overdue" && b.urgency !== "overdue") return -1;
    if (a.urgency !== "overdue" && b.urgency === "overdue") return 1;
    return 0;
  });

  const nichoCounts = Array.from(nichoMap.entries())
    .map(([nicho, stats]) => ({
      nicho,
      count: stats.count,
      closed: stats.closed,
      revenue: stats.revenue,
      conversionRate:
        stats.count > 0 ? Math.round((stats.closed / stats.count) * 100) : 0,
    }))
    .sort((a, b) => b.count - a.count);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Resumo financeiro e operacional da sua prospecção e produção de sites.
        </p>
      </div>

      <MetricCards
        metrics={{
          total,
          vendasTotal,
          mrrTotal,
          producaoCount,
          negociacaoCount,
          followUpCount,
        }}
      />

      <DailyActions urgentLeads={urgentLeads} vendasTotal={vendasTotal} />

      <NichoDistribution counts={nichoCounts} />
    </div>
  );
}