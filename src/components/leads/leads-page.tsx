"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Columns3,
  ListFilter,
  Plus,
  Search,
  Table2,
  Trash2,
  Upload,
} from "lucide-react";
import { toast } from "sonner";

import { LeadFormDialog, type LeadFormValues } from "@/components/leads/lead-form-dialog";
import { LeadsKanban } from "@/components/leads/leads-kanban";
import { LeadsTable } from "@/components/leads/leads-table";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  createLead,
  deleteLead,
  updateLead,
  updateLeadStatus,
  type ActionResult,
} from "@/lib/actions/leads";
import { LEAD_STATUSES, NICHOS, SALE_STATUSES } from "@/lib/constants";
import type { Lead, LeadStatus, SaleStatus } from "@/lib/types";

type ViewMode = "table" | "kanban";
type SelectValueOpt = string | "all";

export function LeadsPage({ leads }: { leads: Lead[] }) {
  const router = useRouter();
  const [localLeads, setLocalLeads] = useState<Lead[]>(leads);

  useEffect(() => {
    setLocalLeads(leads);
  }, [leads]);

  const [view, setView] = useState<ViewMode>("table");
  const [search, setSearch] = useState("");
  const [nicho, setNicho] = useState<SelectValueOpt>("all");
  const [status, setStatus] = useState<SelectValueOpt>("all");
  const [venda, setVenda] = useState<SelectValueOpt>("all");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [deletingLead, setDeletingLead] = useState<Lead | null>(null);

  const nichoOptions = useMemo(() => {
    const fromData = localLeads
      .map((l) => l.nicho)
      .filter((n): n is string => Boolean(n));
    return Array.from(new Set([...NICHOS, ...fromData]));
  }, [localLeads]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const digits = q.replace(/\D/g, "");
    return localLeads.filter((lead) => {
      const matchSearch =
        !q ||
        lead.nome.toLowerCase().includes(q) ||
        (digits !== "" && (lead.whatsapp ?? "").includes(digits));
      const matchNicho = nicho === "all" || lead.nicho === nicho;
      const matchStatus =
        status === "all" ||
        (status.startsWith("exclude-")
          ? lead.status_prospeccao !== status.replace("exclude-", "")
          : lead.status_prospeccao === status);
      const matchVenda = venda === "all" || lead.venda_realizada === venda;
      return matchSearch && matchNicho && matchStatus && matchVenda;
    });
  }, [localLeads, search, nicho, status, venda]);

  const openNew = useCallback(() => {
    setEditingLead(null);
    setDialogOpen(true);
  }, []);

  const openEdit = useCallback((lead: Lead) => {
    setEditingLead(lead);
    setDialogOpen(true);
  }, []);

  async function handleSave(values: LeadFormValues) {
    let result: ActionResult;
    if (editingLead) {
      result = await updateLead(editingLead.id, values);
    } else {
      result = await createLead(values);
    }

    if (!result.ok) {
      toast.error(result.error);
      return;
    }

    toast.success(editingLead ? "Lead atualizado." : "Lead criado!");
    setDialogOpen(false);
    setEditingLead(null);
    router.refresh();
  }

  async function handleDelete() {
    if (!deletingLead) return;
    const result = await deleteLead(deletingLead.id);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    toast.success("Lead excluído.");
    setDeletingLead(null);
    router.refresh();
  }

  async function handleStatusChange(id: string, nextStatus: LeadStatus) {
    const previous = localLeads.find((l) => l.id === id);
    if (!previous) return;

    setLocalLeads((ls) =>
      ls.map((l) => (l.id === id ? { ...l, status_prospeccao: nextStatus } : l)),
    );

    const result = await updateLeadStatus(id, nextStatus);
    if (!result.ok) {
      setLocalLeads((ls) =>
        ls.map((l) =>
          l.id === id ? { ...l, status_prospeccao: previous.status_prospeccao } : l,
        ),
      );
      toast.error(result.error);
      return;
    }
    router.refresh();
  }

  const hasFilters =
    search.trim() !== "" ||
    nicho !== "all" ||
    status !== "all" ||
    venda !== "all";

  function clearFilters() {
    setSearch("");
    setNicho("all");
    setStatus("all");
    setVenda("all");
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Leads</h1>
          <p className="text-sm text-muted-foreground">
            {localLeads.length} cadastrados · {filtered.length} exibidos
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" render={<Link href="/importar" />}>
            <Upload className="size-4" />
            Importar CSV
          </Button>
          <Button onClick={openNew}>
            <Plus className="size-4" />
            Novo lead
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nome ou telefone..."
            className="pl-9"
          />
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:flex">
          <Select value={nicho} onValueChange={(v) => setNicho(v as SelectValueOpt)}>
            <SelectTrigger className="min-w-36">
              <SelectValue placeholder="Nicho" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os nichos</SelectItem>
              {nichoOptions.map((n) => (
                <SelectItem key={n} value={n}>
                  {n}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={status}
            onValueChange={(v) => setStatus(v as SelectValueOpt)}
          >
            <SelectTrigger className="min-w-36">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os status</SelectItem>
              {LEAD_STATUSES.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
              <SelectSeparator />
              {LEAD_STATUSES.map((s) => (
                <SelectItem key={`exclude-${s}`} value={`exclude-${s}`}>
                  Exceto: {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={venda} onValueChange={(v) => setVenda(v as SelectValueOpt)}>
            <SelectTrigger className="min-w-36">
              <SelectValue placeholder="Venda" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as vendas</SelectItem>
              {SALE_STATUSES.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Tabs
            value={view}
            onValueChange={(v) => setView(v as ViewMode)}
            className="contents"
          >
            <TabsList className="grid h-10 w-28 grid-cols-2">
              <TabsTrigger value="table" title="Tabela">
                <Table2 className="size-4" />
              </TabsTrigger>
              <TabsTrigger value="kanban" title="Quadros">
                <Columns3 className="size-4" />
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {hasFilters && (
        <button
          onClick={clearFilters}
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
        >
          <ListFilter className="size-3.5" />
          Limpar filtros
        </button>
      )}

      {view === "table" ? (
        <div className="rounded-xl border bg-card">
          <LeadsTable
            leads={filtered}
            onEdit={openEdit}
            onDelete={setDeletingLead}
          />
        </div>
      ) : (
        <LeadsKanban
          leads={filtered}
          onEdit={openEdit}
          onStatusChange={handleStatusChange}
        />
      )}

      <LeadFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        lead={editingLead}
        onSubmit={handleSave}
      />

      <AlertDialog
        open={deletingLead !== null}
        onOpenChange={(open) => !open && setDeletingLead(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir lead?</AlertDialogTitle>
            <AlertDialogDescription>
              Essa ação remove permanentemente{" "}
              <span className="font-medium">{deletingLead?.nome}</span>. Essa
              ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              <Trash2 className="size-4" />
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}