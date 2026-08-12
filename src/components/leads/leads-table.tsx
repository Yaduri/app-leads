"use client";

import { useState, useMemo } from "react";
import { FileSearch, Pencil, Trash2, ChevronUp, ChevronDown } from "lucide-react";

import { SaleBadge, StatusBadge } from "@/components/leads/status-badge";
import { WhatsAppButton } from "@/components/leads/whatsapp-button";
import { Button } from "@/components/ui/button";
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

export function LeadsTable({
  leads,
  onEdit,
  onDelete,
}: {
  leads: Lead[];
  onEdit: (lead: Lead) => void;
  onDelete: (lead: Lead) => void;
}) {
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

  if (leads.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
        <FileSearch className="size-10 text-muted-foreground/50" />
        <p className="text-sm text-muted-foreground">
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
        <div className={cn("flex items-center gap-1", className?.includes("text-right") && "justify-end")}>
          {label}
          <span className="text-muted-foreground group-hover/header:text-foreground">
            {active ? (
              sortDirection === "asc" ? (
                <ChevronUp className="size-3.5" />
              ) : (
                <ChevronDown className="size-3.5" />
              )
            ) : (
              <ChevronDown className="size-3.5 opacity-0 group-hover/header:opacity-50 transition-opacity" />
            )}
          </span>
        </div>
      </TableHead>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-10" />
            <SortableHeader field="nome" label="Nome" />
            <SortableHeader field="nicho" label="Nicho" />
            <SortableHeader field="status_prospeccao" label="Status" />
            <SortableHeader field="venda_realizada" label="Venda" />
            <SortableHeader field="data_contato" label="Data" />
            <SortableHeader field="valor_venda" label="Valor" className="text-right" />
            <TableHead>Observações</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedLeads.map((lead) => (
            <TableRow key={lead.id}>
              <TableCell className="p-1 pl-3">
                <WhatsAppButton phone={lead.whatsapp} message={lead.msg_a_mandar} />
              </TableCell>
              <TableCell className="max-w-[220px]">
                <div className="truncate font-medium">{lead.nome}</div>
                {lead.whatsapp ? (
                  <div className="truncate text-xs text-muted-foreground">
                    ({lead.whatsapp.slice(0, 2)}) {lead.whatsapp.slice(2)}
                  </div>
                ) : null}
              </TableCell>
              <TableCell>
                {lead.nicho ? (
                  <span className="text-sm text-muted-foreground">{lead.nicho}</span>
                ) : (
                  <span className="text-muted-foreground/50">—</span>
                )}
              </TableCell>
              <TableCell>
                <StatusBadge status={lead.status_prospeccao} />
              </TableCell>
              <TableCell>
                <SaleBadge sale={lead.venda_realizada} />
              </TableCell>
              <TableCell className="whitespace-nowrap text-sm">
                {formatDateBR(lead.data_contato)}
              </TableCell>
              <TableCell className="text-right font-medium">
                {formatCurrency(lead.valor_venda)}
              </TableCell>
              <TableCell className="max-w-[240px]">
                <span
                  className="line-clamp-1 text-sm text-muted-foreground"
                  title={lead.observacoes ?? ""}
                >
                  {lead.observacoes || "—"}
                </span>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    title="Editar"
                    onClick={() => onEdit(lead)}
                  >
                    <Pencil className="size-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    title="Excluir"
                    className="text-destructive hover:text-destructive"
                    onClick={() => onDelete(lead)}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}