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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LEAD_STATUSES, SALE_STATUSES } from "@/lib/constants";
import { formatCurrency, formatDateBR } from "@/lib/format";
import type { Lead, LeadStatus, SaleStatus } from "@/lib/types";

interface LeadDetailSheetProps {
  lead: Lead | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: (lead: Lead) => void;
  onStatusChange: (id: string, status: LeadStatus) => void;
  onSaleChange?: (id: string, sale: SaleStatus) => void;
}

export function LeadDetailSheet({
  lead,
  open,
  onOpenChange,
  onEdit,
  onStatusChange,
  onSaleChange,
}: LeadDetailSheetProps) {
  if (!lead) return null;

  const isOverdue = (() => {
    if (!lead.data_contato) return false;
    if (lead.status_prospeccao === "Concluído" || lead.status_prospeccao === "Sem interesse") return false;
    const contactDate = new Date(lead.data_contato + "T00:00:00");
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return contactDate < today;
  })();

  const daysOverdue = (() => {
    if (!lead.data_contato) return 0;
    const contactDate = new Date(lead.data_contato + "T00:00:00");
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diff = Math.floor((today.getTime() - contactDate.getTime()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  })();

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
        {isOverdue && (
          <div className="flex items-center gap-2.5 p-3 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-300 text-xs font-medium animate-pulse">
            <AlertCircle className="size-4 shrink-0 text-amber-400" />
            <span>
              Follow-up atrasado há <strong>{daysOverdue} {daysOverdue === 1 ? "dia" : "dias"}</strong>. É recomendável entrar em contato hoje.
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
        </div>

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

          <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border/50">
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <DollarSign className="size-3.5" />
                Valor da Venda
              </span>
              <p className="font-mono text-base font-bold text-foreground">
                {formatCurrency(lead.valor_venda)}
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Calendar className="size-3.5" />
                Data de Contato
              </span>
              <p className="font-mono text-sm text-foreground">
                {formatDateBR(lead.data_contato)}
              </p>
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
