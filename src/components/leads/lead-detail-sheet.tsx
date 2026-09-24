"use client";

import {
  Calendar,
  ExternalLink,
  MessageCircle,
  Pencil,
  Phone,
  Tag,
  DollarSign,
  Clock,
  Building,
  CheckCircle2,
  AlertCircle,
  Globe,
  CalendarCheck,
} from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { SaleBadge, StatusBadge } from "@/components/leads/status-badge";
import { WhatsAppTemplateMenu } from "@/components/leads/whatsapp-template-menu";
import { DigitalPresenceBadge } from "@/components/leads/digital-presence-badge";
import { DeliveryStepper } from "@/components/leads/delivery-stepper";
import { SiteProposalGenerator } from "@/components/leads/site-proposal-generator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LEAD_STATUSES, SALE_STATUSES } from "@/lib/constants";
import { formatCurrency, formatDateBR } from "@/lib/format";
import { formatSimpleDate, getFollowUpInfo, getQuickDate } from "@/lib/follow-up";
import type { EtapaEntrega, Lead, LeadStatus, PresencaDigital, SaleStatus } from "@/lib/types";

interface LeadDetailSheetProps {
  lead: Lead | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: (lead: Lead) => void;
  onStatusChange: (id: string, status: LeadStatus) => void;
  onSaleChange?: (id: string, sale: SaleStatus) => void;
  onNextContactChange?: (id: string, nextDate: string | null) => void;
  onContactDateChange?: (id: string, nextDate: string) => void;
  onPresenceChange?: (id: string, presence: PresencaDigital) => void;
  onDeliveryStageChange?: (id: string, stage: EtapaEntrega) => void;
  onApplyProposalValues?: (id: string, setup: number, recurring: number) => void;
}

export function LeadDetailSheet({
  lead,
  open,
  onOpenChange,
  onEdit,
  onStatusChange,
  onSaleChange,
  onNextContactChange,
  onContactDateChange,
  onPresenceChange,
  onDeliveryStageChange,
  onApplyProposalValues,
}: LeadDetailSheetProps) {
  if (!lead) return null;

  const followUpInfo = getFollowUpInfo({
    data_proximo_contato: lead.data_proximo_contato,
    data_contato: lead.data_contato,
    status_prospeccao: lead.status_prospeccao,
    venda_realizada: lead.venda_realizada,
  });

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto w-full sm:max-w-lg p-6 space-y-6">
        {/* Header com Avatar e Nome */}
        <SheetHeader className="pb-4 border-b border-border/70">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-primary/20 to-primary/10 text-primary font-bold text-lg border border-primary/20 shrink-0 shadow-sm">
                {lead.nome.slice(0, 2).toUpperCase()}
              </div>
              <div className="min-w-0">
                <SheetTitle className="text-xl font-extrabold text-foreground truncate">
                  {lead.nome}
                </SheetTitle>
                <div className="flex items-center gap-2 mt-1">
                  {lead.nicho && (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground bg-muted/60 px-2 py-0.5 rounded-md">
                      <Tag className="size-3" />
                      {lead.nicho}
                    </span>
                  )}
                  <span className="text-xs font-mono text-muted-foreground">
                    ID #{lead.id.slice(0, 6)}
                  </span>
                </div>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                onOpenChange(false);
                onEdit(lead);
              }}
              className="gap-1.5 text-xs shrink-0"
            >
              <Pencil className="size-3.5" />
              Editar
            </Button>
          </div>
        </SheetHeader>

        {/* Alerta de Follow-up Atrasado (se houver) */}
        {followUpInfo.isOverdue && (
          <div className="flex items-center gap-2.5 p-3 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-300 text-xs font-medium animate-pulse">
            <AlertCircle className="size-4 shrink-0 text-amber-400" />
            <span>
              Follow-up atrasado ({followUpInfo.label}). É recomendável entrar em contato hoje.
            </span>
          </div>
        )}

        {/* Seção de Contato Rápido & WhatsApp */}
        <div className="rounded-2xl border border-border/70 bg-muted/20 p-4 space-y-3">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Canais de Contato
          </span>
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-2.5">
              <div className="flex size-9 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/25">
                <Phone className="size-4" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">WhatsApp</p>
                <p className="font-mono text-sm font-semibold text-foreground">
                  {lead.whatsapp
                    ? `(${lead.whatsapp.slice(0, 2)}) ${lead.whatsapp.slice(2)}`
                    : "Não informado"}
                </p>
              </div>
            </div>

            <WhatsAppTemplateMenu
              phone={lead.whatsapp}
              name={lead.nome}
              nicho={lead.nicho}
              defaultMessage={lead.msg_a_mandar}
              label="Conversar"
              compact={false}
            />
          </div>

          {lead.link_perfil && (
            <div className="pt-2 border-t border-border/50 flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Perfil Social</span>
              <a
                href={lead.link_perfil}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-primary hover:underline font-medium"
              >
                Abrir link externo <ExternalLink className="size-3" />
              </a>
            </div>
          )}

          {/* Presença Digital & Diagnóstico do Site */}
          <div className="pt-2 border-t border-border/50 flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs text-muted-foreground">Presença Digital</span>
            <DigitalPresenceBadge
              presence={lead.presenca_digital}
              siteUrl={lead.site_atual}
              onPresenceChange={(p) => onPresenceChange && onPresenceChange(lead.id, p)}
            />
          </div>
        </div>

        {/* Funil de Entrega do Site (Pós-Venda) */}
        {lead.venda_realizada === "Sim" && (
          <DeliveryStepper
            currentStage={lead.etapa_entrega}
            onStageChange={(st) => onDeliveryStageChange && onDeliveryStageChange(lead.id, st)}
          />
        )}

        {/* Pipeline & Controles de Status */}
        <div className="rounded-2xl border border-border/70 bg-card/60 p-4 space-y-4">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Pipeline de Vendas
          </span>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Status de Prospecção</label>
              <Select
                value={lead.status_prospeccao}
                onValueChange={(val) => onStatusChange(lead.id, val as LeadStatus)}
              >
                <SelectTrigger className="h-9 text-xs bg-background/50 border-border/70">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LEAD_STATUSES.map((st) => (
                    <SelectItem key={st} value={st}>
                      {st}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Venda Realizada</label>
              <Select
                value={lead.venda_realizada}
                onValueChange={(val) => onSaleChange && onSaleChange(lead.id, val as SaleStatus)}
              >
                <SelectTrigger className="h-9 text-xs bg-background/50 border-border/70">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SALE_STATUSES.map((sale) => (
                    <SelectItem key={sale} value={sale}>
                      {sale}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2.5 pt-2 border-t border-border/50">
            <div className="space-y-1">
              <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                <DollarSign className="size-3.5 text-emerald-400" />
                Criação (Setup)
              </span>
              <p className="font-mono text-sm font-bold text-foreground">
                {formatCurrency(lead.valor_venda)}
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                <Globe className="size-3.5 text-sky-400" />
                Hospedagem
              </span>
              <p className="font-mono text-xs font-semibold text-foreground mt-0.5">
                {lead.valor_recorrente && lead.valor_recorrente > 0
                  ? `${formatCurrency(lead.valor_recorrente)}/mês`
                  : "R$ 0,00"}
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                <Calendar className="size-3.5 text-amber-400" />
                Último Contato
              </span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <p className="font-mono text-xs text-foreground">
                  {formatDateBR(lead.data_contato)}
                </p>
                {onContactDateChange && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-5 text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                    title="Atualizar último contato para hoje"
                    onClick={() => onContactDateChange(lead.id, getQuickDate(0))}
                  >
                    <CalendarCheck className="size-3" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Gerador Rápido de Proposta Comercial */}
        <SiteProposalGenerator
          clientName={lead.nome}
          nicho={lead.nicho}
          phone={lead.whatsapp}
          currentValue={lead.valor_venda}
          currentRecurring={lead.valor_recorrente}
          onApplyValues={(setup, rec) => onApplyProposalValues && onApplyProposalValues(lead.id, setup, rec)}
        />

        {/* Agendamento de Retorno (Follow-up) */}
        <div className="rounded-2xl border border-border/70 bg-card/60 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Clock className="size-3.5 text-amber-400" />
              Próximo Follow-up
            </span>
            {followUpInfo.urgency === "overdue" && (
              <span className="text-[11px] font-bold text-rose-400 bg-rose-500/15 border border-rose-500/30 px-2 py-0.5 rounded-full animate-pulse">
                {followUpInfo.label}
              </span>
            )}
            {followUpInfo.urgency === "today" && (
              <span className="text-[11px] font-bold text-amber-300 bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 rounded-full">
                ⚡ Retornar Hoje!
              </span>
            )}
            {followUpInfo.urgency === "tomorrow" && (
              <span className="text-[11px] font-medium text-sky-300 bg-sky-500/15 border border-sky-500/30 px-2 py-0.5 rounded-full">
                ☀️ Retornar Amanhã
              </span>
            )}
            {followUpInfo.urgency === "future" && (
              <span className="text-[11px] font-medium text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                {followUpInfo.label} ({formatSimpleDate(lead.data_proximo_contato)})
              </span>
            )}
          </div>

          {/* Atalhos Rápidos de 1 Clique */}
          {onNextContactChange && (
            <div className="grid grid-cols-4 gap-1.5 pt-1">
              <button
                type="button"
                onClick={() => onNextContactChange(lead.id, getQuickDate(0))}
                className="py-1.5 px-2 text-[11px] font-medium rounded-xl bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 border border-amber-500/20 transition-all text-center"
                title="Agendar retorno para hoje"
              >
                Hoje
              </button>
              <button
                type="button"
                onClick={() => onNextContactChange(lead.id, getQuickDate(1))}
                className="py-1.5 px-2 text-[11px] font-medium rounded-xl bg-sky-500/10 text-sky-300 hover:bg-sky-500/20 border border-sky-500/20 transition-all text-center"
                title="Agendar retorno para amanhã"
              >
                +1 dia
              </button>
              <button
                type="button"
                onClick={() => onNextContactChange(lead.id, getQuickDate(3))}
                className="py-1.5 px-2 text-[11px] font-medium rounded-xl bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20 transition-all text-center"
                title="Agendar retorno em 3 dias"
              >
                +3 dias
              </button>
              <button
                type="button"
                onClick={() => onNextContactChange(lead.id, getQuickDate(7))}
                className="py-1.5 px-2 text-[11px] font-medium rounded-xl bg-muted/60 text-foreground hover:bg-muted border border-border/60 transition-all text-center"
                title="Agendar retorno em 1 semana"
              >
                +7 dias
              </button>
            </div>
          )}

          {/* Campo de Data Customizada */}
          <div className="flex items-center justify-between pt-2 border-t border-border/50 text-xs">
            <span className="text-muted-foreground">Data Agendada:</span>
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={lead.data_proximo_contato ? lead.data_proximo_contato.slice(0, 10) : ""}
                onChange={(e) =>
                  onNextContactChange && onNextContactChange(lead.id, e.target.value || null)
                }
                className="rounded-lg border border-border/70 bg-background/60 px-2 py-1 text-xs text-foreground outline-none focus:border-primary"
              />
              {lead.data_proximo_contato && onNextContactChange && (
                <button
                  type="button"
                  onClick={() => onNextContactChange(lead.id, null)}
                  className="text-muted-foreground hover:text-rose-400 text-xs transition-colors"
                  title="Limpar agendamento"
                >
                  Limpar
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Mensagem Padrão Cadastrada */}
        {lead.msg_a_mandar && (
          <div className="rounded-2xl border border-border/70 bg-card/60 p-4 space-y-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <MessageCircle className="size-3.5 text-primary" />
              Mensagem Pré-configurada
            </span>
            <p className="text-xs text-foreground/90 leading-relaxed bg-muted/40 p-3 rounded-xl border border-border/50">
              {lead.msg_a_mandar}
            </p>
          </div>
        )}

        {/* Observações e Histórico */}
        <div className="rounded-2xl border border-border/70 bg-card/60 p-4 space-y-2">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Anotações & Observações
          </span>
          <p className="text-xs text-foreground/80 leading-relaxed bg-muted/30 p-3 rounded-xl border border-border/40 whitespace-pre-wrap">
            {lead.observacoes || "Nenhuma anotação registrada para este lead."}
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
}
