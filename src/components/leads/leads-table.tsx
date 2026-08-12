"use client";

import { FileSearch, Pencil, Trash2 } from "lucide-react";

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

export function LeadsTable({
  leads,
  onEdit,
  onDelete,
}: {
  leads: Lead[];
  onEdit: (lead: Lead) => void;
  onDelete: (lead: Lead) => void;
}) {
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

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-10" />
            <TableHead>Nome</TableHead>
            <TableHead>Nicho</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Venda</TableHead>
            <TableHead>Data</TableHead>
            <TableHead className="text-right">Valor</TableHead>
            <TableHead>Observações</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leads.map((lead) => (
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