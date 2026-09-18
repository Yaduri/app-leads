import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { MetricCards } from "@/components/dashboard/metric-cards";
import { NichoDistribution } from "@/components/dashboard/nicho-distribution";
import { getCurrentUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Dashboard | CRM de Leads",
};

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const supabase = await createClient();

  const { data: leads } = await supabase
    .from("leads")
    .select("nicho, status_prospeccao, venda_realizada, valor_venda, valor_recorrente, etapa_entrega");

  const allLeads = leads ?? [];
  const total = allLeads.length;

  let vendasTotal = 0;
  let mrrTotal = 0;
  let producaoCount = 0;
  let negociacaoCount = 0;
  let followUpCount = 0;

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

    if (lead.venda_realizada === "Negociação") {
      followUpCount += 1;
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

      <NichoDistribution counts={nichoCounts} />
    </div>
  );
}