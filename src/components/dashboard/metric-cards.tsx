import Link from "next/link";
import {
  ArrowUpRight,
  Banknote,
  BellRing,
  CheckCircle2,
  Globe,
  Handshake,
  Rocket,
  TrendingUp,
  Users,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";

export interface Metrics {
  total: number;
  vendasTotal: number;
  mrrTotal?: number;
  producaoCount?: number;
  negociacaoCount: number;
  followUpCount: number;
}

export function MetricCards({ metrics }: { metrics: Metrics }) {
  const mrr = metrics.mrrTotal || 0;
  const producao = metrics.producaoCount || 0;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {/* Card 1: Vendas Realizadas (Setup dos Sites) */}
      <Card className="relative overflow-hidden border-border/70 bg-gradient-to-br from-card to-card/60 backdrop-blur-xl shadow-md shadow-emerald-950/5">
        <div className="absolute -right-6 -top-6 size-28 rounded-full bg-emerald-500/10 blur-2xl pointer-events-none" />
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="space-y-1">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-xs font-semibold text-emerald-400 border border-emerald-500/20">
              <TrendingUp className="size-3" />
              Projetos Fechados
            </span>
            <CardTitle className="text-sm font-bold text-foreground">
              Vendas de Sites
            </CardTitle>
          </div>
          <div className="flex size-9 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
            <Banknote className="size-4" />
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="font-mono text-2xl font-extrabold tracking-tight text-foreground md:text-3xl">
            {formatCurrency(metrics.vendasTotal)}
          </div>
          <p className="text-xs text-muted-foreground">
            Faturamento acumulado em criação de sites
          </p>
        </CardContent>
      </Card>

      {/* Card 2: MRR Recorrente (Hospedagem & Suporte) */}
      <Card className="relative overflow-hidden border-border/70 bg-gradient-to-br from-card to-card/60 backdrop-blur-xl shadow-md shadow-sky-950/5">
        <div className="absolute -right-6 -top-6 size-28 rounded-full bg-sky-500/10 blur-2xl pointer-events-none" />
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="space-y-1">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-500/15 px-2.5 py-0.5 text-xs font-semibold text-sky-400 border border-sky-500/20">
              <Globe className="size-3" />
              Recorrência Mensal
            </span>
            <CardTitle className="text-sm font-bold text-foreground">
              MRR Hospedagem
            </CardTitle>
          </div>
          <div className="flex size-9 items-center justify-center rounded-xl bg-sky-500/15 text-sky-400 border border-sky-500/20">
            <Globe className="size-4" />
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="font-mono text-2xl font-extrabold tracking-tight text-sky-400 md:text-3xl">
            {formatCurrency(mrr)}<span className="text-xs font-normal text-muted-foreground">/mês</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Receita previsível de manutenção e hospedagem
          </p>
        </CardContent>
      </Card>

      {/* Card 3: Sites em Produção (Pós-Venda) */}
      <Card className="relative overflow-hidden border-border/70 bg-card/60 backdrop-blur-xl shadow-md">
        <div className="absolute -right-4 -top-4 size-24 rounded-full bg-amber-500/10 blur-xl pointer-events-none" />
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="space-y-1">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 px-2.5 py-0.5 text-xs font-semibold text-amber-400 border border-amber-500/20">
              <Rocket className="size-3" />
              Fase de Entrega
            </span>
            <CardTitle className="text-sm font-bold text-foreground">
              Em Produção
            </CardTitle>
          </div>
          <div className="flex size-9 items-center justify-center rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/25">
            <Rocket className="size-4" />
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="font-mono text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            {producao} {producao === 1 ? "site" : "sites"}
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Projetos fechados em desenvolvimento ativo
          </p>
        </CardContent>
      </Card>

      {/* Card 4: Em Negociação */}
      <Card className="relative overflow-hidden border-border/70 bg-card/60 backdrop-blur-xl shadow-md">
        <div className="absolute -right-4 -top-4 size-24 rounded-full bg-violet-500/10 blur-xl pointer-events-none" />
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="space-y-1">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-500/15 px-2.5 py-0.5 text-xs font-semibold text-violet-400 border border-violet-500/20">
              <Handshake className="size-3" />
              Funil Aquecido
            </span>
            <CardTitle className="text-sm font-bold text-foreground">
              Em Negociação
            </CardTitle>
          </div>
          <div className="flex size-9 items-center justify-center rounded-lg bg-violet-500/15 text-violet-400 border border-violet-500/25">
            <Handshake className="size-4" />
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="font-mono text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            {metrics.negociacaoCount}
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Propostas de sites enviadas aguardando fechamento
          </p>
        </CardContent>
      </Card>

      {/* Card 4: Base Geral de Leads (Span Total no mobile, 1 col em desktop se necessário) */}
      <Card className="relative overflow-hidden border-border/70 bg-card/60 backdrop-blur-xl shadow-md md:col-span-2 lg:col-span-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between p-6 gap-4">
          <div className="flex items-center gap-4">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-sky-500/15 text-sky-400 border border-sky-500/25 shrink-0">
              <Users className="size-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-foreground">Base Total de Oportunidades</h3>
                <span className="rounded-full bg-sky-500/15 text-sky-300 text-xs px-2.5 py-0.5 border border-sky-500/25 font-mono">
                  {metrics.total} leads
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Total de contatos e prospecções geradas no seu CRM
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              className="text-xs gap-1.5"
              render={<Link href="/importar" />}
            >
              Importar Mais
            </Button>
            <Button
              size="sm"
              className="text-xs gap-1.5"
              render={<Link href="/leads" />}
            >
              Gerenciar no Kanban
              <ArrowUpRight className="size-3.5" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}