"use client";

import { useState, useRef } from "react";
import { GripVertical, Pencil, AlertCircle } from "lucide-react";

import { SaleBadge } from "@/components/leads/status-badge";
import { WhatsAppTemplateMenu } from "@/components/leads/whatsapp-template-menu";
import { Button } from "@/components/ui/button";
import { LEAD_STATUSES } from "@/lib/constants";
import { formatCurrency } from "@/lib/format";
import type { Lead, LeadStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

const DOT_COLORS: Record<LeadStatus, string> = {
  "Novo Lead": "bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.6)]",
  "Em Andamento": "bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6)]",
  "Em Negociação": "bg-violet-400 shadow-[0_0_8px_rgba(167,139,250,0.6)]",
  Concluído: "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]",
  "Sem interesse": "bg-rose-400 shadow-[0_0_8px_rgba(244,63,94,0.6)]",
};

export function LeadsKanban({
  leads,
  onEdit,
  onStatusChange,
  onSelectLead,
}: {
  leads: Lead[];
  onEdit: (lead: Lead) => void;
  onStatusChange: (id: string, status: LeadStatus) => void;
  onSelectLead?: (lead: Lead) => void;
}) {
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [overColumn, setOverColumn] = useState<LeadStatus | null>(null);
  const dragCounter = useRef<Record<string, number>>({});

  const handleDragEnter = (e: React.DragEvent, status: LeadStatus) => {
    e.preventDefault();
    if (!dragCounter.current[status]) {
      dragCounter.current[status] = 0;
    }
    dragCounter.current[status]++;
    if (overColumn !== status) {
      setOverColumn(status);
    }
  };

  const handleDragLeave = (e: React.DragEvent, status: LeadStatus) => {
    e.preventDefault();
    if (dragCounter.current[status]) {
      dragCounter.current[status]--;
    }
    if (dragCounter.current[status] === 0) {
      setOverColumn(null);
    }
  };

  const handleDrop = (e: React.DragEvent, status: LeadStatus) => {
    e.preventDefault();
    dragCounter.current[status] = 0;
    setOverColumn(null);
    const id = e.dataTransfer.getData("text/lead-id");
    if (id) {
      onStatusChange(id, status);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      {LEAD_STATUSES.map((status) => {
        const items = leads.filter(
          (lead) => lead.status_prospeccao === status,
        );
        const columnTotalValue = items.reduce((sum, item) => sum + (item.valor_venda || 0), 0);
        const isOver = overColumn === status;

        return (
          <div
            key={status}
            className={cn(
              "flex flex-col rounded-2xl border transition-all duration-200 shadow-sm",
              isOver
                ? "border-primary bg-primary/[0.04] ring-2 ring-primary/20 scale-[1.01]"
                : "border-border/70 bg-card/40 backdrop-blur-xl"
            )}
            onDragOver={(e) => {
              e.preventDefault();
              e.dataTransfer.dropEffect = "move";
            }}
            onDragEnter={(e) => handleDragEnter(e, status)}
            onDragLeave={(e) => handleDragLeave(e, status)}
            onDrop={(e) => handleDrop(e, status)}
          >
            {/* Header da Coluna */}
            <div
              className={cn(
                "flex items-center justify-between border-b border-border/70 px-4 py-3 transition-colors duration-200",
                isOver ? "bg-primary/10 border-primary/20" : "bg-muted/20",
              )}
            >
              <div className="flex items-center gap-2">
                <span className={cn("size-2 rounded-full", DOT_COLORS[status])} />
                <span className="text-sm font-semibold tracking-tight text-foreground">{status}</span>
              </div>
              <div className="flex items-center gap-2">
                {columnTotalValue > 0 && (
                  <span className="text-[11px] font-mono font-medium text-emerald-400">
                    {formatCurrency(columnTotalValue)}
                  </span>
                )}
                <span className="rounded-full bg-muted/80 px-2 py-0.5 text-xs font-mono font-medium text-muted-foreground">
                  {items.length}
                </span>
              </div>
            </div>

            {/* Lista de Cards da Coluna */}
            <div className="flex flex-1 flex-col gap-3 p-3 min-h-[420px]">
              {items.length === 0 && (
                <div className="flex h-full flex-col items-center justify-center rounded-xl border border-dashed border-border/60 py-12 text-center text-xs text-muted-foreground/60">
                  Arraste cards para cá
                </div>
              )}
              {items.map((lead) => {
                const isDraggingThis = draggingId === lead.id;
                return (
                  <div
                    key={lead.id}
                    draggable
                    onDragStart={(e) => {
                      setDraggingId(lead.id);
                      e.dataTransfer.setData("text/lead-id", lead.id);
                      e.dataTransfer.effectAllowed = "move";
                    }}
                    onDragEnd={() => setDraggingId(null)}
                    className={cn(
                      "group cursor-grab rounded-xl border bg-card/70 backdrop-blur-md p-3.5 shadow-sm transition-all duration-200 active:cursor-grabbing",
                      isDraggingThis
                        ? "opacity-30 border-dashed border-primary bg-primary/10 scale-95 rotate-1 shadow-2xl"
                        : "border-border/70 hover:shadow-md hover:border-primary/40 hover:-translate-y-0.5"
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div
                        className="min-w-0 cursor-pointer"
                        onClick={() => onSelectLead && onSelectLead(lead)}
                        title="Ver detalhes na gaveta"
                      >
                        <p className="line-clamp-2 text-sm font-semibold text-foreground hover:text-primary transition-colors">
                          {lead.nome}
                        </p>
                        {lead.nicho ? (
                          <p className="mt-0.5 text-xs text-muted-foreground">
                            {lead.nicho}
                          </p>
                        ) : null}
                      </div>
                      <GripVertical className="size-4 shrink-0 text-muted-foreground/40 group-hover:text-muted-foreground transition-colors" />
                    </div>

                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <SaleBadge sale={lead.venda_realizada} />
                      {lead.valor_venda > 0 ? (
                        <span className="font-mono text-xs font-bold text-foreground">
                          {formatCurrency(lead.valor_venda)}
                        </span>
                      ) : null}
                    </div>

                    {lead.data_contato && lead.status_prospeccao !== "Concluído" && lead.status_prospeccao !== "Sem interesse" && new Date(lead.data_contato + "T00:00:00") < new Date(new Date().setHours(0,0,0,0)) && (
                      <div className="mt-2 flex items-center gap-1.5 text-[10px] font-medium text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                        <AlertCircle className="size-3 shrink-0" />
                        <span>Follow-up atrasado</span>
                      </div>
                    )}

                    {lead.msg_a_mandar ? (
                      <p className="mt-2 line-clamp-2 text-xs text-muted-foreground/80 bg-muted/30 p-2 rounded-lg border border-border/40">
                        {lead.msg_a_mandar}
                      </p>
                    ) : null}

                    <div className="mt-3 flex items-center justify-between gap-2 pt-2 border-t border-border/40">
                      <WhatsAppTemplateMenu
                        phone={lead.whatsapp}
                        name={lead.nome}
                        nicho={lead.nicho}
                        defaultMessage={lead.msg_a_mandar}
                        label="WhatsApp"
                        compact={false}
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-8 text-muted-foreground hover:text-foreground"
                        title="Editar lead"
                        onClick={() => onEdit(lead)}
                      >
                        <Pencil className="size-3.5" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}