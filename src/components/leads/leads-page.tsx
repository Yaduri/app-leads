"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Columns3,
  Flame,
  ListFilter,
  Plus,
  Search,
  Table2,
  Trash2,
  Upload,
  Calendar,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

import { LeadFormDialog, type LeadFormValues } from "@/components/leads/lead-form-dialog";
import { LeadsKanban } from "@/components/leads/leads-kanban";
import { LeadsTable } from "@/components/leads/leads-table";
import { BatchActionsBar } from "@/components/leads/batch-actions-bar";
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
} from "@/lib/actions/leads";
import { LEAD_STATUSES, NICHOS, SALE_STATUSES } from "@/lib/constants";
import type { ActionResult, Lead, LeadStatus, SaleStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

type ViewMode = "table" | "kanban";
type SelectValueOpt = string;
type QuickFilterType = "all" | "negociacao" | "vendas" | "hoje";

export function LeadsPage({ leads: initialLeads }: { leads: Lead[] }) {
  const router = useRouter();
  const [localLeads, setLocalLeads] = useState<Lead[]>(initialLeads);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [quickFilter, setQuickFilter] = useState<QuickFilterType>("all");

  useEffect(() => {
    setLocalLeads(initialLeads);
  }, [initialLeads]);

  const [view, setView] = useState<ViewMode>("table");
  const [search, setSearch] = useState("");
  const [nicho, setNicho] = useState<SelectValueOpt>("all");
  const [status, setStatus] = useState<SelectValueOpt>("all");
  const [venda, setVenda] = useState<SelectValueOpt>("all");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [deletingLead, setDeletingLead] = useState<Lead | null>(null);

  const todayStr = useMemo(() => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }, []);

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
      // Quick filter chips
      if (quickFilter === "negociacao" && lead.status_prospeccao !== "Em Negociação") {
        return false;
      }
      if (quickFilter === "vendas" && lead.venda_realizada !== "Sim") {
        return false;
      }
      if (quickFilter === "hoje" && lead.data_contato !== todayStr) {
        return false;
      }

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
  }, [localLeads, search, nicho, status, venda, quickFilter, todayStr]);

  const handleToggleSelect = useCallback((id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }, []);

  const handleSelectAll = useCallback(() => {
    if (selectedIds.length === filtered.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filtered.map((l) => l.id));
    }
  }, [filtered, selectedIds]);

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
    venda !== "all" ||
    quickFilter !== "all";

  function clearFilters() {
    setSearch("");
    setNicho("all");
    setStatus("all");
    setVenda("all");
    setQuickFilter("all");
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Leads</h1>
            <span className="font-mono text-xs bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded-full font-semibold">
              {filtered.length} {filtered.length === 1 ? "lead" : "leads"}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            {localLeads.length} cadastrados na sua conta
          </p>
        </div>
        <div className="flex w-full items-center gap-2 sm:w-auto">
          <Button
            variant="outline"
            render={<Link href="/importar" />}
            className="flex-1 sm:flex-initial text-xs h-9 gap-1.5"
          >
            <Upload className="size-3.5" />
            Importar CSV
          </Button>
          <Button
            onClick={openNew}
            className="flex-1 sm:flex-initial text-xs h-9 gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90 shadow-md shadow-primary/10"
          >
            <Plus className="size-3.5" />
            Novo lead
          </Button>
        </div>
      </div>

      {/* Quick Filter Chips (1-Clique) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setQuickFilter("all")}
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all shrink-0 border",
            quickFilter === "all"
              ? "bg-primary text-primary-foreground border-primary shadow-sm"
              : "bg-card/50 text-muted-foreground border-border/70 hover:text-foreground hover:bg-card",
          )}
        >
          <Sparkles className="size-3.5" />
          Todos
        </button>
        <button
          onClick={() => setQuickFilter("negociacao")}
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all shrink-0 border",
            quickFilter === "negociacao"
              ? "bg-violet-500 text-white border-violet-600 shadow-sm"
              : "bg-card/50 text-muted-foreground border-border/70 hover:text-violet-400 hover:bg-card",
          )}
        >
          <Flame className="size-3.5 text-violet-400" />
          Em Negociação
        </button>
        <button
          onClick={() => setQuickFilter("vendas")}
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all shrink-0 border",
            quickFilter === "vendas"
              ? "bg-emerald-600 text-white border-emerald-700 shadow-sm"
              : "bg-card/50 text-muted-foreground border-border/70 hover:text-emerald-400 hover:bg-card",
          )}
        >
          <CheckCircle2 className="size-3.5 text-emerald-400" />
          Vendas Fechadas
        </button>
        <button
          onClick={() => setQuickFilter("hoje")}
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all shrink-0 border",
            quickFilter === "hoje"
              ? "bg-sky-500 text-white border-sky-600 shadow-sm"
              : "bg-card/50 text-muted-foreground border-border/70 hover:text-sky-400 hover:bg-card",
          )}
        >
          <Calendar className="size-3.5 text-sky-400" />
          Contato Hoje
        </button>
      </div>

      {/* Filter Bar & View Mode Switcher */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nome ou WhatsApp..."
            className="pl-9 h-9 text-xs bg-card/40 border-border/70"
          />
        </div>
        <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center">
          <Select value={nicho} onValueChange={(v) => setNicho(v as SelectValueOpt)}>
            <SelectTrigger className="h-9 min-w-36 text-xs bg-card/40 border-border/70">
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
            <SelectTrigger className="h-9 min-w-36 text-xs bg-card/40 border-border/70">
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
            <SelectTrigger className="h-9 min-w-36 text-xs bg-card/40 border-border/70">
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
            <TabsList className="grid h-9 w-24 grid-cols-2 bg-muted/60 p-0.5 rounded-lg border border-border/70">
              <TabsTrigger value="table" title="Visão em Tabela" className="h-8">
                <Table2 className="size-4" />
              </TabsTrigger>
              <TabsTrigger value="kanban" title="Visão em Quadros" className="h-8">
                <Columns3 className="size-4" />
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {hasFilters && (
        <div className="flex items-center justify-between">
          <button
            onClick={clearFilters}
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <ListFilter className="size-3.5" />
            Limpar todos os filtros
          </button>
        </div>
      )}

      {/* Renderização Tabela ou Kanban */}
      {view === "table" ? (
        <LeadsTable
          leads={filtered}
          onEdit={openEdit}
          onDelete={setDeletingLead}
          selectedIds={selectedIds}
          onToggleSelect={handleToggleSelect}
          onSelectAll={handleSelectAll}
        />
      ) : (
        <LeadsKanban
          leads={filtered}
          onEdit={openEdit}
          onStatusChange={handleStatusChange}
        />
      )}

      {/* Barra Flutuante de Ações em Massa */}
      <BatchActionsBar
        selectedIds={selectedIds}
        onClearSelection={() => setSelectedIds([])}
        onSuccess={() => {
          setSelectedIds([]);
          router.refresh();
        }}
      />

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
              <span className="font-semibold text-foreground">{deletingLead?.nome}</span>. Essa
              ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
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