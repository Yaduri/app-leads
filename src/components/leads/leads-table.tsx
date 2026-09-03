"use client";

import { useState, useMemo } from "react";
import { FileSearch, Pencil, Trash2, ChevronUp, ChevronDown, Phone } from "lucide-react";

import { SaleBadge, StatusBadge } from "@/components/leads/status-badge";
import { WhatsAppTemplateMenu } from "@/components/leads/whatsapp-template-menu";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency, formatDateBR } from "@/lib/format";
import type { Lead } from "@/lib/types";
import { cn } from "@/lib/utils";

interface LeadsTableProps {
  leads: Lead[];
  onEdit: (lead: Lead) => void;
  onDelete: (lead: Lead) => void;
  selectedIds?: string[];
  onToggleSelect?: (id: string) => void;
  onSelectAll?: () => void;
}

export function LeadsTable({
  leads,
  onEdit,
  onDelete,
  selectedIds = [],
  onToggleSelect,
  onSelectAll,
}: LeadsTableProps) {
  const [sortField, setSortField] = useState<keyof Lead | null>("created_at");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  function handleSort(field: keyof Lead) {
    if (sortField === field) {
      setSortDirection((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  }

  const sortedLeads = useMemo(() => {
    if (!sortField) return leads;

    return [...leads].sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];

      if (aVal === null || aVal === undefined) return 1;
      if (bVal === null || bVal === undefined) return -1;

      let comparison = 0;
      if (typeof aVal === "number" && typeof bVal === "number") {
        comparison = aVal - bVal;
      } else {
        comparison = String(aVal).localeCompare(String(bVal), "pt-BR", {
          numeric: true,
          sensitivity: "base",
        });
      }

      return sortDirection === "asc" ? comparison : -comparison;
    });
  }, [leads, sortField, sortDirection]);

  const allSelected =
    sortedLeads.length > 0 && selectedIds.length === sortedLeads.length;
  const someSelected =
    selectedIds.length > 0 && selectedIds.length < sortedLeads.length;

  if (leads.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-16 text-center border border-dashed rounded-2xl bg-card/40">
        <div className="flex size-12 items-center justify-center rounded-2xl bg-muted/60 text-muted-foreground">
          <FileSearch className="size-6" />
        </div>
        <p className="text-sm font-medium text-muted-foreground">
          Nenhum lead encontrado com os filtros atuais.
        </p>
      </div>
    );
  }

  function SortableHeader({
    field,
    label,
    className,
  }: {
    field: keyof Lead;
    label: string;
    className?: string;
  }) {
    const active = sortField === field;
    return (
      <TableHead
        onClick={() => handleSort(field)}
        className={cn(
          "cursor-pointer select-none hover:text-foreground transition-colors group/header",
          className
        )}
      >
        <div className={cn("flex items-center gap-1.5", className?.includes("text-right") && "justify-end")}>
          {label}
          <span className="text-muted-foreground group-hover/header:text-foreground">
            {active ? (
              sortDirection === "asc" ? (
                <ChevronUp className="size-3.5 text-primary" />
              ) : (
                <ChevronDown className="size-3.5 text-primary" />
              )
            ) : (
              <ChevronDown className="size-3.5 opacity-0 group-hover/header:opacity-40 transition-opacity" />
            )}
          </span>
        </div>
      </TableHead>
    );
  }

  return (
    <div className="space-y-4">
      {/* Mobile Cards View (< md) */}
      <div className="grid grid-cols-1 gap-3 md:hidden">
        {sortedLeads.map((lead) => {
          const isSelected = selectedIds.includes(lead.id);
          return (
            <div
              key={lead.id}
              className={cn(
                "flex flex-col gap-3 rounded-2xl border bg-card/60 backdrop-blur-xl p-4 transition-all shadow-sm",
                isSelected
                  ? "border-primary bg-primary/5 ring-1 ring-primary/30"
                  : "border-border/70 hover:border-border",
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0">
                  {onToggleSelect && (
                    <div className="pt-0.5">
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => onToggleSelect(lead.id)}
                      />
                    </div>
                  )}
                  <div className="min-w-0">
                    <h4 className="font-semibold text-foreground text-sm truncate">{lead.nome}</h4>
                    {lead.nicho && (
                      <p className="text-xs text-muted-foreground mt-0.5">{lead.nicho}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8"
                    onClick={() => onEdit(lead)}
                  >
                    <Pencil className="size-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8 text-destructive hover:text-destructive"
                    onClick={() => onDelete(lead)}
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge status={lead.status_prospeccao} />
                <SaleBadge sale={lead.venda_realizada} />
                {lead.valor_venda > 0 && (
                  <span className="ml-auto font-mono text-xs font-bold text-foreground">
                    {formatCurrency(lead.valor_venda)}
                  </span>
                )}
              </div>

              {lead.msg_a_mandar && (
                <p className="text-xs text-muted-foreground/80 line-clamp-2 bg-muted/30 p-2 rounded-lg border border-border/40">
                  {lead.msg_a_mandar}
                </p>
              )}

              <div className="flex items-center justify-between pt-1 border-t border-border/40">
                <span className="text-[11px] text-muted-foreground font-mono">
                  {formatDateBR(lead.data_contato)}
                </span>
                <WhatsAppTemplateMenu
                  phone={lead.whatsapp}
                  name={lead.nome}
                  nicho={lead.nicho}
                  defaultMessage={lead.msg_a_mandar}
                  label="WhatsApp"
                  compact={false}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop Table View (>= md) */}
      <div className="hidden md:block overflow-hidden rounded-2xl border border-border/70 bg-card/40 backdrop-blur-xl shadow-md">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow className="hover:bg-transparent border-border/70">
                {onSelectAll && (
                  <TableHead className="w-10 pl-4">
                    <Checkbox
                      checked={allSelected}
                      onCheckedChange={onSelectAll}
                    />
                  </TableHead>
                )}
                <TableHead className="w-20">Ação</TableHead>
                <SortableHeader field="nome" label="Nome do Lead" />
                <SortableHeader field="nicho" label="Nicho" />
                <SortableHeader field="status_prospeccao" label="Status" />
                <SortableHeader field="venda_realizada" label="Venda" />
                <SortableHeader field="data_contato" label="Contato" />
                <SortableHeader field="valor_venda" label="Valor" className="text-right" />
                <TableHead className="max-w-[200px]">Observações</TableHead>
                <TableHead className="text-right pr-4">Opções</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedLeads.map((lead) => {
                const isSelected = selectedIds.includes(lead.id);
                return (
                  <TableRow
                    key={lead.id}
                    className={cn(
                      "transition-colors border-border/50",
                      isSelected ? "bg-primary/5 hover:bg-primary/10" : "hover:bg-muted/40",
                    )}
                  >
                    {onToggleSelect && (
                      <TableCell className="pl-4">
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => onToggleSelect(lead.id)}
                        />
                      </TableCell>
                    )}
                    <TableCell className="p-2">
                      <WhatsAppTemplateMenu
                        phone={lead.whatsapp}
                        name={lead.nome}
                        nicho={lead.nicho}
                        defaultMessage={lead.msg_a_mandar}
                        compact
                      />
                    </TableCell>
                    <TableCell className="max-w-[220px]">
                      <div className="font-semibold text-foreground truncate">{lead.nome}</div>
                      {lead.whatsapp && (
                        <div className="font-mono text-xs text-muted-foreground truncate">
                          ({lead.whatsapp.slice(0, 2)}) {lead.whatsapp.slice(2)}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      {lead.nicho ? (
                        <span className="text-xs font-medium text-muted-foreground bg-muted/60 px-2 py-0.5 rounded-md">
                          {lead.nicho}
                        </span>
                      ) : (
                        <span className="text-muted-foreground/40 text-xs">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={lead.status_prospeccao} />
                    </TableCell>
                    <TableCell>
                      <SaleBadge sale={lead.venda_realizada} />
                    </TableCell>
                    <TableCell className="whitespace-nowrap font-mono text-xs text-muted-foreground">
                      {formatDateBR(lead.data_contato)}
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm font-semibold text-foreground">
                      {formatCurrency(lead.valor_venda)}
                    </TableCell>
                    <TableCell className="max-w-[200px]">
                      <span
                        className="line-clamp-1 text-xs text-muted-foreground"
                        title={lead.observacoes ?? ""}
                      >
                        {lead.observacoes || "—"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right pr-4">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-8 text-muted-foreground hover:text-foreground"
                          title="Editar lead"
                          onClick={() => onEdit(lead)}
                        >
                          <Pencil className="size-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                          title="Excluir lead"
                          onClick={() => onDelete(lead)}
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}