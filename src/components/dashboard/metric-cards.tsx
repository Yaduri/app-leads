import Link from "next/link";
import {
  ArrowUpRight,
  Banknote,
  BellRing,
  CheckCircle2,
  Handshake,
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
  negociacaoCount: number;
  followUpCount: number;
}

export function MetricCards({ metrics }: { metrics: Metrics }) {
  const conversionRate =
    metrics.total > 0
      ? Math.round(((metrics.total - metrics.negociacaoCount - metrics.followUpCount) / metrics.total) * 100)
      : 0;

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Bento Hero Card: Faturamento & Conversão (Ocupa 2 colunas no desktop) */}
      <Card className="relative overflow-hidden border-border/70 bg-gradient-to-br from-card to-card/60 backdrop-blur-xl lg:col-span-2 shadow-lg shadow-emerald-950/5">
        <div className="absolute -right-6 -top-6 size-32 rounded-full bg-emerald-500/10 blur-2xl pointer-events-none" />
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="space-y-1">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-xs font-semibold text-emerald-400 border border-emerald-500/20">
              <TrendingUp className="size-3" />
              Receita Confirmada
            </span>
            <CardTitle className="text-xl font-bold tracking-tight text-foreground">
              Vendas Realizadas
            </CardTitle>
          </div>
          <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
            <Banknote className="size-5" />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-baseline gap-3">
            <span className="font-mono text-3xl font-extrabold tracking-tight text-foreground md:text-4xl">
              {formatCurrency(metrics.vendasTotal)}
            </span>
            <span className="text-xs text-muted-foreground">
              em negócios fechados
            </span>
          </div>

          <div className="pt-2 border-t border-border/50 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <CheckCircle2 className="size-4 text-emerald-400" />
              <span>Pipeline de conversão ativo</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs gap-1 text-primary hover:text-primary/80 px-2"
              render={<Link href="/leads" />}
            >
              Ver leads <ArrowUpRight className="size-3.5" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Card 2: Em Negociação (Pipeline Aquecido) */}
      <Card className="relative overflow-hidden border-border/70 bg-card/60 backdrop-blur-xl shadow-md">
        <div className="absolute -right-4 -top-4 size-24 rounded-full bg-violet-500/10 blur-xl pointer-events-none" />
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Em Negociação
          </CardTitle>
          <div className="flex size-8 items-center justify-center rounded-lg bg-violet-500/15 text-violet-400 border border-violet-500/25">
            <Handshake className="size-4" />
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="font-mono text-3xl font-bold tracking-tight text-foreground">
            {metrics.negociacaoCount}
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Status "Em Negociação" aguardando fechamento
          </p>
        </CardContent>
      </Card>

      {/* Card 3: Pendentes de Follow-Up */}
      <Card className="relative overflow-hidden border-border/70 bg-card/60 backdrop-blur-xl shadow-md">
        <div className="absolute -right-4 -top-4 size-24 rounded-full bg-amber-500/10 blur-xl pointer-events-none" />
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Follow-ups Ativos
          </CardTitle>
          <div className="flex size-8 items-center justify-center rounded-lg bg-amber-500/15 text-amber-400 border border-amber-500/25">
            <BellRing className="size-4" />
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="font-mono text-3xl font-bold tracking-tight text-foreground">
            {metrics.followUpCount}
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Contatos que necessitam de acompanhamento
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