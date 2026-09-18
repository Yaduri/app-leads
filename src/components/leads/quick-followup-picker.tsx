"use client";

import { useState } from "react";
import { Calendar, Clock, AlertTriangle, Check, X } from "lucide-react";
import { formatSimpleDate, getFollowUpInfo, getQuickDate } from "@/lib/follow-up";
import type { LeadStatus, SaleStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

interface QuickFollowupPickerProps {
  leadId: string;
  dataProximoContato?: string | null;
  dataContato?: string | null;
  statusProspeccao: LeadStatus;
  vendaRealizada?: SaleStatus | null;
  onDateChange: (id: string, nextDate: string | null) => void;
  compact?: boolean;
}

export function QuickFollowupPicker({
  leadId,
  dataProximoContato,
  dataContato,
  statusProspeccao,
  vendaRealizada,
  onDateChange,
  compact = false,
}: QuickFollowupPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [customDate, setCustomDate] = useState(
    dataProximoContato ? dataProximoContato.slice(0, 10) : ""
  );

  const info = getFollowUpInfo({
    data_proximo_contato: dataProximoContato,
    data_contato: dataContato,
    status_prospeccao: statusProspeccao,
    venda_realizada: vendaRealizada,
  });

  const handleApply = (dateStr: string | null) => {
    onDateChange(leadId, dateStr);
    setIsOpen(false);
  };

  const getBadgeStyle = () => {
    switch (info.urgency) {
      case "overdue":
        return "bg-rose-500/15 text-rose-400 border-rose-500/30 hover:bg-rose-500/25";
      case "today":
        return "bg-amber-500/15 text-amber-300 border-amber-500/30 hover:bg-amber-500/25 font-semibold";
      case "tomorrow":
        return "bg-sky-500/15 text-sky-300 border-sky-500/30 hover:bg-sky-500/25";
      case "future":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20";
      default:
        return "bg-muted/40 text-muted-foreground border-border/60 hover:bg-muted hover:text-foreground";
    }
  };

  return (
    <div className="relative inline-block" onClick={(e) => e.stopPropagation()}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-lg border text-xs transition-all cursor-pointer select-none",
          compact ? "px-2 py-0.5 text-[11px]" : "px-2.5 py-1 text-xs",
          getBadgeStyle()
        )}
        title={
          dataProximoContato
            ? `Próximo contato agendado para: ${formatSimpleDate(dataProximoContato)}`
            : "Clique para agendar retorno"
        }
      >
        {info.urgency === "overdue" && <AlertTriangle className="size-3 shrink-0 text-rose-400 animate-pulse" />}
        {info.urgency === "today" && <Clock className="size-3 shrink-0 text-amber-400" />}
        {(info.urgency === "tomorrow" || info.urgency === "future") && (
          <Calendar className="size-3 shrink-0 text-sky-400" />
        )}
        {info.urgency === "none" && <Calendar className="size-3 shrink-0 opacity-60" />}

        <span className="font-medium whitespace-nowrap">
          {dataProximoContato
            ? info.urgency === "today"
              ? "Hoje"
              : info.urgency === "tomorrow"
              ? "Amanhã"
              : formatSimpleDate(dataProximoContato)
            : "Agendar"}
        </span>

        {info.isOverdue && (
          <span className="text-[10px] font-bold text-rose-400 bg-rose-950/60 px-1 rounded">
            {info.label.split(" ")[1] || "Atrasado"}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute left-0 top-full mt-1 z-50 w-56 rounded-xl border border-border/80 bg-card/95 backdrop-blur-xl p-2.5 shadow-xl shadow-black/40 text-foreground animate-in fade-in zoom-in-95 duration-100">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground px-1 pb-1.5 flex items-center justify-between">
              <span>Próximo Contato</span>
              {dataProximoContato && (
                <button
                  type="button"
                  onClick={() => handleApply(null)}
                  className="text-[10px] text-muted-foreground hover:text-rose-400 flex items-center gap-0.5 transition-colors"
                  title="Remover agendamento"
                >
                  <X className="size-3" /> Limpar
                </button>
              )}
            </div>

            {/* Botões Rápidos */}
            <div className="grid grid-cols-2 gap-1 mb-2">
              <button
                type="button"
                onClick={() => handleApply(getQuickDate(0))}
                className="flex items-center justify-center gap-1 py-1.5 px-2 text-[11px] font-medium rounded-lg bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 border border-amber-500/20 transition-all"
              >
                ⚡ Hoje
              </button>
              <button
                type="button"
                onClick={() => handleApply(getQuickDate(1))}
                className="flex items-center justify-center gap-1 py-1.5 px-2 text-[11px] font-medium rounded-lg bg-sky-500/10 text-sky-300 hover:bg-sky-500/20 border border-sky-500/20 transition-all"
              >
                ☀️ Amanhã (+1d)
              </button>
              <button
                type="button"
                onClick={() => handleApply(getQuickDate(3))}
                className="flex items-center justify-center gap-1 py-1.5 px-2 text-[11px] font-medium rounded-lg bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20 transition-all"
              >
                📆 Em 3 dias
              </button>
              <button
                type="button"
                onClick={() => handleApply(getQuickDate(7))}
                className="flex items-center justify-center gap-1 py-1.5 px-2 text-[11px] font-medium rounded-lg bg-muted/60 text-foreground hover:bg-muted border border-border/60 transition-all"
              >
                🗓️ Em 1 semana
              </button>
            </div>

            {/* Input de Data Personalizada */}
            <div className="pt-1.5 border-t border-border/60">
              <label className="text-[10px] text-muted-foreground block mb-1">
                Ou escolha no calendário:
              </label>
              <div className="flex items-center gap-1">
                <input
                  type="date"
                  value={customDate}
                  onChange={(e) => setCustomDate(e.target.value)}
                  className="flex-1 rounded-md border border-border/80 bg-background/80 px-2 py-1 text-xs text-foreground outline-none focus:border-primary"
                />
                <button
                  type="button"
                  disabled={!customDate}
                  onClick={() => handleApply(customDate || null)}
                  className="size-7 flex items-center justify-center rounded-md bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-40 transition-all"
                  title="Salvar data"
                >
                  <Check className="size-3.5" />
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
