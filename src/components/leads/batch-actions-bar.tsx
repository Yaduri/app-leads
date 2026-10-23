"use client";

import { useState, useTransition } from "react";
import { CheckSquare, Trash2, X, Loader2, CalendarCheck, Clock } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { LEAD_STATUSES } from "@/lib/constants";
import { getQuickDate } from "@/lib/follow-up";
import type { LeadStatus } from "@/lib/types";
import {
  bulkUpdateLeadStatus,
  bulkUpdateNextContact,
  bulkUpdateContactDate,
  bulkDeleteLeads,
} from "@/lib/actions/leads";

interface BatchActionsBarProps {
  selectedIds: string[];
  onClearSelection: () => void;
  onBulkStatusUpdated?: (ids: string[], status: LeadStatus) => void;
  onBulkFollowUpUpdated?: (ids: string[], date: string | null) => void;
  onBulkContactDateUpdated?: (ids: string[], date: string) => void;
  onBulkDeleted?: (ids: string[]) => void;
}

export function BatchActionsBar({
  selectedIds,
  onClearSelection,
  onBulkStatusUpdated,
  onBulkFollowUpUpdated,
  onBulkContactDateUpdated,
  onBulkDeleted,
}: BatchActionsBarProps) {
  const [isPending, startTransition] = useTransition();
  const [deleteAlertOpen, setDeleteAlertOpen] = useState(false);

  if (selectedIds.length === 0) return null;

  const handleStatusChange = (status: LeadStatus) => {
    const ids = [...selectedIds];
    onBulkStatusUpdated?.(ids, status);
    onClearSelection();

    startTransition(async () => {
      const res = await bulkUpdateLeadStatus(ids, status);
      if (res.ok) {
        toast.success(`${ids.length} lead(s) atualizado(s) para "${status}"`);
      } else {
        toast.error(res.error || "Erro ao atualizar leads");
      }
    });
  };

  const handleFollowUpChange = (val: string) => {
    const ids = [...selectedIds];
    const nextDate =
      val === "clear"
        ? null
        : val === "today"
          ? getQuickDate(0)
          : val === "tomorrow"
            ? getQuickDate(1)
            : val === "3days"
              ? getQuickDate(3)
              : getQuickDate(7);

    onBulkFollowUpUpdated?.(ids, nextDate);
    onClearSelection();

    startTransition(async () => {
      const res = await bulkUpdateNextContact(ids, nextDate);
      if (res.ok) {
        toast.success(
          nextDate
            ? `Follow-up agendado para ${ids.length} lead(s)!`
            : `Follow-up desmarcado em ${ids.length} lead(s)`,
        );
      } else {
        toast.error(res.error || "Erro ao agendar follow-up em massa");
      }
    });
  };

  const handleMarkContactToday = () => {
    const ids = [...selectedIds];
    const today = getQuickDate(0);
    onBulkContactDateUpdated?.(ids, today);
    onClearSelection();

    startTransition(async () => {
      const res = await bulkUpdateContactDate(ids, today);
      if (res.ok) {
        toast.success(`Último contato atualizado para hoje em ${ids.length} lead(s)!`);
      } else {
        toast.error(res.error || "Erro ao atualizar último contato em massa");
      }
    });
  };

  const handleDelete = () => {
    const ids = [...selectedIds];
    onBulkDeleted?.(ids);
    setDeleteAlertOpen(false);
    onClearSelection();

    startTransition(async () => {
      const res = await bulkDeleteLeads(ids);
      if (res.ok) {
        toast.success(`${ids.length} lead(s) excluído(s) com sucesso`);
      } else {
        toast.error(res.error || "Erro ao excluir leads");
      }
    });
  };

  return (
    <>
      <div className="fixed bottom-20 md:bottom-8 left-1/2 -translate-x-1/2 z-40 max-w-3xl w-[94vw] sm:w-auto animate-in fade-in slide-in-from-bottom-4 duration-200">
        <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center justify-between gap-2.5 px-3.5 py-2.5 sm:px-4 rounded-2xl bg-card/95 backdrop-blur-xl border border-primary/25 shadow-2xl shadow-primary/10 text-foreground">
          <div className="flex items-center justify-between sm:justify-start gap-2 pr-1">
            <div className="flex items-center gap-2">
              <div className="flex size-7 items-center justify-center rounded-lg bg-primary/20 text-primary">
                <CheckSquare className="size-4" />
              </div>
              <span className="text-xs sm:text-sm font-semibold whitespace-nowrap">
                {selectedIds.length} {selectedIds.length === 1 ? "selecionado" : "selecionados"}
              </span>
            </div>

            {/* Botões de ação rápida visíveis na linha superior no mobile */}
            <div className="flex items-center gap-1 sm:hidden">
              <Button
                variant="outline"
                size="sm"
                className="h-8 px-2 text-xs font-medium gap-1 bg-background/60 border-border/70 hover:text-primary"
                onClick={handleMarkContactToday}
                disabled={isPending}
                title="Atualizar último contato de todos os selecionados para hoje"
              >
                <CalendarCheck className="size-3.5 text-primary" />
                <span>Hoje</span>
              </Button>
              <Button
                variant="destructive"
                size="sm"
                className="h-8 px-2 text-xs font-medium gap-1"
                onClick={() => setDeleteAlertOpen(true)}
                disabled={isPending}
              >
                {isPending ? <Loader2 className="size-3.5 animate-spin" /> : <Trash2 className="size-3.5" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="size-8 text-muted-foreground hover:text-foreground"
                onClick={onClearSelection}
                title="Cancelar seleção"
              >
                <X className="size-4" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2">
            {/* Mudar Status em Massa */}
            <Select onValueChange={(val) => handleStatusChange(val as LeadStatus)} disabled={isPending}>
              <SelectTrigger className="h-8 w-full sm:w-auto text-xs sm:min-w-[130px] bg-background/60 border-border/70">
                <SelectValue placeholder="Mudar Status..." />
              </SelectTrigger>
              <SelectContent>
                {LEAD_STATUSES.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Agendar Follow-up em Massa */}
            <Select onValueChange={(val) => handleFollowUpChange(String(val))} disabled={isPending}>
              <SelectTrigger className="h-8 w-full sm:w-auto text-xs sm:min-w-[140px] bg-background/60 border-border/70">
                <Clock className="size-3.5 text-amber-400 mr-1 shrink-0" />
                <SelectValue placeholder="Agendar Retorno..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">⚡ Para Hoje</SelectItem>
                <SelectItem value="tomorrow">☀️ Para Amanhã (+1d)</SelectItem>
                <SelectItem value="3days">📅 Daqui a 3 dias</SelectItem>
                <SelectItem value="7days">🗓️ Daqui a 7 dias</SelectItem>
                <SelectItem value="clear">❌ Limpar Follow-up</SelectItem>
              </SelectContent>
            </Select>

            {/* Atualizar Último Contato para Hoje em Massa (Desktop) */}
            <Button
              variant="outline"
              size="sm"
              className="hidden sm:inline-flex h-8 px-2.5 text-xs font-medium gap-1.5 bg-background/60 border-border/70 hover:text-primary"
              onClick={handleMarkContactToday}
              disabled={isPending}
              title="Atualizar último contato de todos os selecionados para hoje"
            >
              <CalendarCheck className="size-3.5 text-primary" />
              <span>Contato Hoje</span>
            </Button>

            {/* Excluir em Massa (Desktop) */}
            <Button
              variant="destructive"
              size="sm"
              className="hidden sm:inline-flex h-8 px-2.5 text-xs font-medium gap-1.5"
              onClick={() => setDeleteAlertOpen(true)}
              disabled={isPending}
            >
              {isPending ? <Loader2 className="size-3.5 animate-spin" /> : <Trash2 className="size-3.5" />}
              Excluir
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="hidden sm:inline-flex size-8 text-muted-foreground hover:text-foreground"
              onClick={onClearSelection}
              title="Cancelar seleção"
            >
              <X className="size-4" />
            </Button>
          </div>
        </div>
      </div>

      <AlertDialog open={deleteAlertOpen} onOpenChange={setDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir {selectedIds.length} lead(s)?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação é permanente e removerá todos os dados dos leads selecionados. Deseja continuar?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleDelete();
              }}
              disabled={isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isPending ? "Excluindo..." : "Sim, excluir selecionados"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
