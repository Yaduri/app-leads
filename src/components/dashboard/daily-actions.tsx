"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  ArrowUpRight,
  Calendar,
  CalendarCheck,
  CheckCircle2,
  Flame,
  Pencil,
  Target,
} from "lucide-react";
import { toast } from "sonner";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { WhatsAppTemplateMenu } from "@/components/leads/whatsapp-template-menu";
import { updateLeadContactDate, updateLeadStatus } from "@/lib/actions/leads";
import { formatCurrency } from "@/lib/format";
import { getQuickDate, type FollowUpUrgency } from "@/lib/follow-up";
import type { LeadStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

export interface UrgentLeadItem {
  id: string;
  nome: string;
  nicho: string | null;
  whatsapp: string | null;
  status_prospeccao: LeadStatus;
  msg_a_mandar: string | null;
  urgency: FollowUpUrgency;
  label: string;
  valor_venda?: number;
  valor_recorrente?: number;
  dia_vencimento?: number | null;
}

export function DailyActions({
  urgentLeads: initialUrgent,
  vendasTotal,
}: {
  urgentLeads: UrgentLeadItem[];
  vendasTotal: number;
}) {
  const [items, setItems] = useState<UrgentLeadItem[]>(initialUrgent);
  const [goal, setGoal] = useState<number>(10000);
  const [editingGoal, setEditingGoal] = useState(false);
  const [goalDraft, setGoalDraft] = useState("10000");

  useEffect(() => {
    setItems(initialUrgent);
  }, [initialUrgent]);

  useEffect(() => {
    const saved = localStorage.getItem("crm_monthly_goal");
    if (saved) {
      const parsed = Number(saved);
      if (!isNaN(parsed) && parsed > 0) {
        setGoal(parsed);
        setGoalDraft(String(parsed));
      }
    }
  }, []);

  const handleSaveGoal = () => {
    const num = Number(goalDraft.replace(/\D/g, ""));
    if (!num || num <= 0) {
      toast.error("Informe uma meta válida.");
      return;
    }
    setGoal(num);
    localStorage.setItem("crm_monthly_goal", String(num));
    setEditingGoal(false);
    toast.success("Meta de faturamento atualizada!");
  };

  const handleContactDone = async (lead: UrgentLeadItem) => {
    const today = getQuickDate(0);
    setItems((prev) => prev.filter((x) => x.id !== lead.id));

    const shouldAdvance = lead.status_prospeccao === "Novo Lead";
    await Promise.all([
      updateLeadContactDate(lead.id, today),
      ...(shouldAdvance ? [updateLeadStatus(lead.id, "Em Andamento")] : []),
    ]);

    toast.success(`Contato com ${lead.nome} registrado para hoje!`);
  };

  const progressPct = Math.min(100, Math.round((vendasTotal / goal) * 100));

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {/* Painel de Ações do Dia (2 colunas) */}
      <Card className="border-border/70 bg-card/60 backdrop-blur-xl shadow-md lg:col-span-2">
        <CardHeader className="pb-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Flame className="size-4 text-amber-400" />
                Ações Prioritárias de Hoje
              </CardTitle>
              <CardDescription className="text-xs mt-0.5">
                Leads com retorno agendado para hoje ou em atraso que precisam do seu contato
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs gap-1.5"
              render={<Link href="/leads" />}
            >
              Ver todos os leads
              <ArrowUpRight className="size-3.5" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 py-8 text-center rounded-xl border border-dashed border-border/60 bg-muted/20">
              <div className="flex size-10 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400">
                <CheckCircle2 className="size-5" />
              </div>
              <p className="text-sm font-semibold text-foreground">
                Tudo em dia por aqui!
              </p>
              <p className="text-xs text-muted-foreground max-w-sm">
                Você não possui follow-ups atrasados nem pendentes para hoje.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5 max-h-[320px] overflow-y-auto pr-1">
              {items.slice(0, 8).map((lead) => {
                const isOverdue = lead.urgency === "overdue";
                return (
                  <div
                    key={lead.id}
                    className="flex items-center justify-between gap-3 rounded-xl border border-border/60 bg-background/40 px-3.5 py-2.5 hover:border-border transition-colors"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-semibold text-foreground truncate">
                          {lead.nome}
                        </span>
                        <span
                          className={cn(
                            "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold border",
                            isOverdue
                              ? "bg-rose-500/15 text-rose-400 border-rose-500/30"
                              : "bg-amber-500/15 text-amber-300 border-amber-500/30",
                          )}
                        >
                          {isOverdue ? (
                            <AlertCircle className="size-2.5" />
                          ) : (
                            <Calendar className="size-2.5" />
                          )}
                          {lead.label}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground truncate mt-0.5">
                        {lead.nicho || "Sem nicho"} · {lead.status_prospeccao}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-9 sm:size-8 text-muted-foreground hover:text-primary hover:bg-primary/10 touch-manipulation active:scale-95"
                        title="Marcar último contato como feito hoje"
                        onClick={() => handleContactDone(lead)}
                      >
                        <CalendarCheck className="size-4" />
                      </Button>
                      <WhatsAppTemplateMenu
                        phone={lead.whatsapp}
                        name={lead.nome}
                        nicho={lead.nicho}
                        valor={lead.valor_recorrente || lead.valor_venda}
                        dia={lead.dia_vencimento}
                        defaultMessage={lead.msg_a_mandar}
                        compact
                        onContactSent={() => handleContactDone(lead)}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Card de Meta de Faturamento (1 coluna) */}
      <Card className="border-border/70 bg-card/60 backdrop-blur-xl shadow-md flex flex-col justify-between">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Target className="size-4 text-emerald-400" />
              Meta de Faturamento
            </CardTitle>
            <Button
              variant="ghost"
              size="icon"
              className="size-8 sm:size-7 text-muted-foreground hover:text-foreground touch-manipulation active:scale-95"
              onClick={() => setEditingGoal((v) => !v)}
              title="Alterar valor da meta"
            >
              <Pencil className="size-3.5" />
            </Button>
          </div>
          <CardDescription className="text-xs">
            Acompanhe seu progresso rumo à meta de vendas de sites
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {editingGoal ? (
            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={goalDraft}
                onChange={(e) => setGoalDraft(e.target.value)}
                className="h-8 text-xs font-mono"
                placeholder="Ex: 10000"
              />
              <Button size="sm" onClick={handleSaveGoal} className="h-8 text-xs">
                Salvar
              </Button>
            </div>
          ) : (
            <div className="space-y-1">
              <div className="flex items-baseline justify-between">
                <span className="font-mono text-2xl font-extrabold text-emerald-400">
                  {formatCurrency(vendasTotal)}
                </span>
                <span className="font-mono text-xs text-muted-foreground">
                  de {formatCurrency(goal)}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Progresso alcançado</span>
                <span className="font-mono font-bold text-foreground">{progressPct}%</span>
              </div>
            </div>
          )}

          <div className="h-3 w-full rounded-full bg-muted/70 overflow-hidden p-0.5 border border-border/50">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>

          <div className="rounded-xl bg-muted/30 border border-border/50 p-3 text-xs text-muted-foreground space-y-1">
            {vendasTotal >= goal ? (
              <p className="text-emerald-400 font-semibold">
                🎉 Parabéns! Você bateu sua meta estipulada!
              </p>
            ) : (
              <p>
                Faltam{" "}
                <strong className="font-mono text-foreground">
                  {formatCurrency(Math.max(0, goal - vendasTotal))}
                </strong>{" "}
                em projetos fechados para atingir 100% da meta.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
