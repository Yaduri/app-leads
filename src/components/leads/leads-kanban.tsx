"use client";

import { useState } from "react";
import { GripVertical, Pencil } from "lucide-react";

import { SaleBadge } from "@/components/leads/status-badge";
import { WhatsAppButton } from "@/components/leads/whatsapp-button";
import { Button } from "@/components/ui/button";
import { LEAD_STATUSES } from "@/lib/constants";
import { formatCurrency } from "@/lib/format";
import type { Lead, LeadStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

const DOT_COLORS: Record<LeadStatus, string> = {
  "Novo Lead": "bg-sky-500",
  "Em Andamento": "bg-amber-500",
  "Em Negociação": "bg-violet-500",
  Concluído: "bg-emerald-500",
};

export function LeadsKanban({
  leads,
  onEdit,
  onStatusChange,
}: {
  leads: Lead[];
  onEdit: (lead: Lead) => void;
  onStatusChange: (id: string, status: LeadStatus) => void;
}) {
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [overColumn, setOverColumn] = useState<LeadStatus | null>(null);

  function handleDrop(status: LeadStatus) {
    setOverColumn(null);
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      {LEAD_STATUSES.map((status) => {
        const items = leads.filter(
          (lead) => lead.status_prospeccao === status,
        );

        return (
          <div
            key={status}
            className="flex flex-col rounded-xl border bg-muted/20"
            onDragOver={(e) => {
              e.preventDefault();
              e.dataTransfer.dropEffect = "move";
              if (overColumn !== status) setOverColumn(status);
            }}
            onDragLeave={() => {
              if (overColumn === status) setOverColumn(null);
            }}
            onDrop={(e) => {
              e.preventDefault();
              const id = e.dataTransfer.getData("text/lead-id");
              handleDrop(status);
              if (id) onStatusChange(id, status);
            }}
          >
            <div
              className={cn(
                "flex items-center gap-2 border-b px-4 py-3 transition-colors",
                overColumn === status ? "bg-muted" : "",
              )}
            >
              <span className={cn("size-2.5 rounded-full", DOT_COLORS[status])} />
              <span className="text-sm font-semibold">{status}</span>
              <span className="ml-auto rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                {items.length}
              </span>
            </div>

            <div className="flex flex-1 flex-col gap-3 p-3 min-h-40">
              {items.length === 0 && (
                <div className="flex h-full flex-col items-center justify-center rounded-lg border border-dashed py-8 text-center text-xs text-muted-foreground">
                  Arraste cards para cá
                </div>
              )}
              {items.map((lead) => (
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
                    "group cursor-grab rounded-lg border bg-card p-3 shadow-sm transition-opacity active:cursor-grabbing",
                    draggingId === lead.id && "opacity-40",
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="line-clamp-2 text-sm font-semibold">
                        {lead.nome}
                      </p>
                      {lead.nicho ? (
                        <p className="mt-1 text-xs text-muted-foreground">
                          {lead.nicho}
                        </p>
                      ) : null}
                    </div>
                    <GripVertical className="size-4 shrink-0 text-muted-foreground/60" />
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <SaleBadge sale={lead.venda_realizada} />
                    {lead.valor_venda > 0 ? (
                      <span className="text-sm font-semibold">
                        {formatCurrency(lead.valor_venda)}
                      </span>
                    ) : null}
                  </div>

                  {lead.msg_a_mandar ? (
                    <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">
                      {lead.msg_a_mandar}
                    </p>
                  ) : null}

                  <div className="mt-3 flex items-center gap-2">
                    <WhatsAppButton
                      phone={lead.whatsapp}
                      message={lead.msg_a_mandar}
                      label="WhatsApp"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="ml-auto h-8 w-8"
                      title="Editar"
                      onClick={() => onEdit(lead)}
                    >
                      <Pencil className="size-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}