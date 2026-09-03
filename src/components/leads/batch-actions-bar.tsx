"use client";

import { useState, useTransition } from "react";
import { CheckSquare, Trash2, X, ArrowRight, Loader2 } from "lucide-react";
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
import type { LeadStatus } from "@/lib/types";
import { bulkUpdateLeadStatus, bulkDeleteLeads } from "@/lib/actions/leads";

interface BatchActionsBarProps {
  selectedIds: string[];
  onClearSelection: () => void;
  onSuccess: () => void;
}

export function BatchActionsBar({
  selectedIds,
  onClearSelection,
  onSuccess,
}: BatchActionsBarProps) {
  const [isPending, startTransition] = useTransition();
  const [deleteAlertOpen, setDeleteAlertOpen] = useState(false);

  if (selectedIds.length === 0) return null;

  const handleStatusChange = (status: LeadStatus) => {
    startTransition(async () => {
      const res = await bulkUpdateLeadStatus(selectedIds, status);
      if (res.ok) {
        toast.success(`${selectedIds.length} lead(s) atualizado(s) para "${status}"`);
        onClearSelection();
        onSuccess();
      } else {
        toast.error(res.error || "Erro ao atualizar leads");
      }
    });
  };

  const handleDelete = () => {
    startTransition(async () => {
      const res = await bulkDeleteLeads(selectedIds);
      if (res.ok) {
        toast.success(`${selectedIds.length} lead(s) excluído(s) com sucesso`);
        setDeleteAlertOpen(false);
        onClearSelection();
        onSuccess();
      } else {
        toast.error(res.error || "Erro ao excluir leads");
      }
    });
  };

  return (
    <>
      <div className="fixed bottom-20 md:bottom-8 left-1/2 -translate-x-1/2 z-40 max-w-xl w-[92vw] sm:w-auto animate-in fade-in slide-in-from-bottom-4 duration-200">
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 rounded-2xl bg-card/90 backdrop-blur-xl border border-primary/20 shadow-2xl shadow-primary/10 text-foreground">
          <div className="flex items-center gap-2">
            <div className="flex size-7 items-center justify-center rounded-lg bg-primary/20 text-primary">
              <CheckSquare className="size-4" />
            </div>
            <span className="text-sm font-semibold whitespace-nowrap">
              {selectedIds.length} {selectedIds.length === 1 ? "lead selecionado" : "leads selecionados"}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Select onValueChange={(val) => handleStatusChange(val as LeadStatus)} disabled={isPending}>
              <SelectTrigger className="h-8 text-xs min-w-[140px] bg-background/50 border-border/70">
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

            <Button
              variant="destructive"
              size="sm"
              className="h-8 px-2.5 text-xs font-medium gap-1.5"
              onClick={() => setDeleteAlertOpen(true)}
              disabled={isPending}
            >
              {isPending ? <Loader2 className="size-3.5 animate-spin" /> : <Trash2 className="size-3.5" />}
              Excluir
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
