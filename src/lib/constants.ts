import type { LeadStatus, SaleStatus } from "@/lib/types";

export const LEAD_STATUSES: LeadStatus[] = [
  "Novo Lead",
  "Em Andamento",
  "Em Negociação",
  "Concluído",
];

export const SALE_STATUSES: SaleStatus[] = ["Sim", "Não", "Negociação", "Em aberto"];

export const NICHOS = [
  "Estética",
  "Dentista",
  "Psicóloga",
  "Arquitetura",
  "Decoração",
  "Fotografia",
  "Beleza",
  "Outro",
];

export const LEAD_STATUS_CLASSES: Record<LeadStatus, string> = {
  "Novo Lead": "bg-sky-500/10 text-sky-400 border-sky-500/25 dark:bg-sky-500/15 dark:text-sky-300 dark:border-sky-500/30",
  "Em Andamento": "bg-amber-500/10 text-amber-400 border-amber-500/25 dark:bg-amber-500/15 dark:text-amber-300 dark:border-amber-500/30",
  "Em Negociação": "bg-violet-500/10 text-violet-400 border-violet-500/25 dark:bg-violet-500/15 dark:text-violet-300 dark:border-violet-500/30",
  Concluído: "bg-emerald-500/10 text-emerald-400 border-emerald-500/25 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/30",
};

export const SALE_STATUS_CLASSES: Record<SaleStatus, string> = {
  Sim: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  "Não": "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
  "Negociação": "bg-orange-500/15 text-orange-400 border-orange-500/30",
  "Em aberto": "bg-slate-500/10 text-slate-400 border-slate-500/20",
};