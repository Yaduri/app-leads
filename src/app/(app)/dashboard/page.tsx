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

  const [{ count: total }, { data: vendasRows }, { count: negociacaoCount }, { count: followUpCount }, { data: nichoRows }] =
    await Promise.all([
      supabase.from("leads").select("*", { count: "exact", head: true }),
      supabase
        .from("leads")
        .select("valor_venda")
        .eq("venda_realizada", "Sim"),
      supabase
        .from("leads")
        .select("*", { count: "exact", head: true })
        .eq("status_prospeccao", "Em Negociação"),
      supabase
        .from("leads")
        .select("*", { count: "exact", head: true })
        .eq("venda_realizada", "Negociação"),
      supabase.from("leads").select("nicho"),
    ]);

  const vendasTotal =
    (vendasRows ?? []).reduce(
      (acc, row) => acc + Number(row.valor_venda ?? 0),
      0,
    ) ?? 0;

  const byNicho = new Map<string, number>();
  (nichoRows ?? []).forEach((row) => {
    const key = row.nicho || "Sem nicho";
    byNicho.set(key, (byNicho.get(key) ?? 0) + 1);
  });
  const nichoCounts = Array.from(byNicho.entries())
    .map(([nicho, count]) => ({ nicho, count }))
    .sort((a, b) => b.count - a.count);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Resumo da sua prospecção de leads.
        </p>
      </div>

      <MetricCards
        metrics={{
          total: total ?? 0,
          vendasTotal,
          negociacaoCount: negociacaoCount ?? 0,
          followUpCount: followUpCount ?? 0,
        }}
      />

      <NichoDistribution counts={nichoCounts} />
    </div>
  );
}