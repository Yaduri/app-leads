"use server";

import { createClient } from "@/lib/supabase/server";

export type DashboardMetrics = {
  totalLeads: number;
  totalSales: number;
  leadsInNegotiation: number;
  leadsByNiche: { nicho: string; count: number }[];
};

export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  const supabase = await createClient();

  const { data: user } = await supabase.auth.getUser();
  if (!user.user) {
    return {
      totalLeads: 0,
      totalSales: 0,
      leadsInNegotiation: 0,
      leadsByNiche: [],
    };
  }

  const { data: leads, error } = await supabase
    .from("leads")
    .select("nicho, status_prospeccao, venda_realizada, valor_venda");

  if (error || !leads) {
    console.error("Error fetching leads for dashboard:", error);
    return {
      totalLeads: 0,
      totalSales: 0,
      leadsInNegotiation: 0,
      leadsByNiche: [],
    };
  }

  let totalLeads = 0;
  let totalSales = 0;
  let leadsInNegotiation = 0;
  const nicheCounts: Record<string, number> = {};

  for (const lead of leads) {
    totalLeads++;

    if (lead.venda_realizada === "Sim") {
      totalSales += Number(lead.valor_venda) || 0;
    }

    if (
      lead.status_prospeccao === "Em Negociação" ||
      lead.venda_realizada === "Negociação"
    ) {
      leadsInNegotiation++;
    }

    const nicho = lead.nicho || "Outros";
    nicheCounts[nicho] = (nicheCounts[nicho] || 0) + 1;
  }

  const leadsByNiche = Object.entries(nicheCounts)
    .map(([nicho, count]) => ({ nicho, count }))
    .sort((a, b) => b.count - a.count); // sort by count descending

  return {
    totalLeads,
    totalSales,
    leadsInNegotiation,
    leadsByNiche,
  };
}
