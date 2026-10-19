"use client";

import { useEffect, useState } from "react";
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
  Save,
  CreditCard,
} from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
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
import { LEAD_STATUSES, SALE_STATUSES, STATUS_PAGAMENTO_OPTIONS, STATUS_PAGAMENTO_CLASSES } from "@/lib/constants";
import { formatCurrency, formatDateBR } from "@/lib/format";
import { formatSimpleDate, getFollowUpInfo, getQuickDate } from "@/lib/follow-up";
import { cn } from "@/lib/utils";
import type { EtapaEntrega, Lead, LeadStatus, PresencaDigital, SaleStatus, StatusPagamento } from "@/lib/types";

interface LeadDetailSheetProps {
  lead: Lead | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: (lead: Lead) => void;
  onStatusChange: (id: string, status: LeadStatus) => void;
  onSaleChange?: (id: string, sale: SaleStatus) => void;
  onPaymentStatusChange?: (id: string, status: StatusPagamento) => void;
  onDueDayChange?: (id: string, dueDay: number) => void;
  onNextContactChange?: (id: string, nextDate: string | null) => void;
  onContactDateChange?: (id: string, nextDate: string) => void;
  onPresenceChange?: (id: string, presence: PresencaDigital) => void;
  onDeliveryStageChange?: (id: string, stage: EtapaEntrega) => void;
  onApplyProposalValues?: (id: string, setup: number, recurring: number) => void;
  onNotesChange?: (id: string, observacoes: string | null, msg_a_mandar?: string | null) => void;
  onWhatsAppSent?: (lead: Lead) => void;
}

export function LeadDetailSheet({
  lead,
  open,
  onOpenChange,
  onEdit,
  onStatusChange,
  onSaleChange,
  onPaymentStatusChange,
  onDueDayChange,
  onNextContactChange,
  onContactDateChange,
  onPresenceChange,
  onDeliveryStageChange,
  onApplyProposalValues,
  onNotesChange,
  onWhatsAppSent,
}: LeadDetailSheetProps) {
  const [notesDraft, setNotesDraft] = useState("");
  const [msgDraft, setMsgDraft] = useState("");

  useEffect(() => {
    if (lead) {
      setNotesDraft(lead.observacoes ?? "");
      setMsgDraft(lead.msg_a_mandar ?? "");
    }
  }, [lead?.id, lead?.observacoes, lead?.msg_a_mandar]);

  if (!lead) return null;

  const isNotesDirty =
    notesDraft.trim() !== (lead.observacoes ?? "").trim() ||
    msgDraft.trim() !== (lead.msg_a_mandar ?? "").trim();

  const handleSaveNotes = () => {
    if (!onNotesChange) return;
    onNotesChange(lead.id, notesDraft.trim() || null, msgDraft.trim() || null);
  };

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
              valor={lead.valor_recorrente || lead.valor_venda}
              dia={lead.dia_vencimento}
              defaultMessage={lead.msg_a_mandar}
              label="Conversar"
              compact={false}
              onContactSent={() => onWhatsAppSent?.(lead)}
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

          {/* Controle de Pagamento & MRR */}
          <div className="pt-3 border-t border-border/50 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <CreditCard className="size-3.5 text-emerald-400" />
                Controle de Pagamentos & MRR
              </span>
              {lead.status_pagamento && (
                <span
                  className={cn(
                    "text-[10px] font-semibold px-2 py-0.5 rounded-full border",
                    STATUS_PAGAMENTO_CLASSES[lead.status_pagamento] || "bg-muted text-muted-foreground border-border",
                  )}
                >
                  {lead.status_pagamento}
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-[11px] text-muted-foreground">Status do Pagamento</label>
                <Select
                  value={lead.status_pagamento || "Em Aberto"}
                  onValueChange={(val) => onPaymentStatusChange && onPaymentStatusChange(lead.id, val as StatusPagamento)}
                >
                  <SelectTrigger className="h-8 text-xs bg-background/50 border-border/70">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_PAGAMENTO_OPTIONS.map((st) => (
                      <SelectItem key={st} value={st}>
                        {st}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] text-muted-foreground">Dia de Vencimento</label>
                <input
                  type="number"
                  min={1}
                  max={31}
                  value={lead.dia_vencimento || 10}
                  onChange={(e) => {
                    const d = parseInt(e.target.value, 10);
                    if (!isNaN(d) && d >= 1 && d <= 31 && onDueDayChange) {
                      onDueDayChange(lead.id, d);
                    }
                  }}
                  className="h-8 w-full rounded-md border border-border/70 bg-background/50 px-3 text-xs font-mono focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                />
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

        {/* Anotações Rápidas & Mensagem Customizada (Edição Direta) */}
        <div className="rounded-2xl border border-border/70 bg-card/60 p-4 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Pencil className="size-3.5 text-primary" />
              Anotações & Mensagem Rápida
            </span>
            {isNotesDirty && onNotesChange && (
              <Button
                size="sm"
                onClick={handleSaveNotes}
                className="h-7 px-2.5 text-xs gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90 animate-in fade-in duration-150"
              >
                <Save className="size-3.5" />
                Salvar notas
              </Button>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">
              Observações do Lead (diagnóstico, objeções, histórico)
            </label>
            <Textarea
              rows={3}
              value={notesDraft}
              onChange={(e) => setNotesDraft(e.target.value)}
              onKeyDown={(e) => {
                if ((e.ctrlKey || e.metaKey) && e.key === "Enter" && isNotesDirty) {
                  e.preventDefault();
                  handleSaveNotes();
                }
              }}
              placeholder="Digite anotações sobre o site do cliente, conversa ou próximos passos..."
              className="text-xs bg-background/50 border-border/70 resize-y"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
              <MessageCircle className="size-3 text-emerald-400" />
              Mensagem Personalizada de Abordagem
            </label>
            <Textarea
              rows={2}
              value={msgDraft}
              onChange={(e) => setMsgDraft(e.target.value)}
              onKeyDown={(e) => {
                if ((e.ctrlKey || e.metaKey) && e.key === "Enter" && isNotesDirty) {
                  e.preventDefault();
                  handleSaveNotes();
                }
              }}
              placeholder="Mensagem específica para enviar no WhatsApp deste lead..."
              className="text-xs bg-background/50 border-border/70 resize-y"
            />
          </div>

          {isNotesDirty && (
            <p className="text-[11px] text-muted-foreground">
              Dica: Pressione <kbd className="px-1 py-0.5 rounded bg-muted font-mono text-[10px]">Ctrl + Enter</kbd> ou clique em <strong>Salvar notas</strong>.
            </p>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
