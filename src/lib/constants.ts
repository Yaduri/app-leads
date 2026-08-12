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
  "Novo Lead": "bg-sky-100 text-sky-800 hover:bg-sky-100",
  "Em Andamento": "bg-amber-100 text-amber-800 hover:bg-amber-100",
  "Em Negociação": "bg-violet-100 text-violet-800 hover:bg-violet-100",
  Concluído: "bg-emerald-100 text-emerald-800 hover:bg-emerald-100",
};

export const SALE_STATUS_CLASSES: Record<SaleStatus, string> = {
  Sim: "bg-emerald-600 text-white hover:bg-emerald-600",
  "Não": "bg-slate-200 text-slate-700 hover:bg-slate-200",
  "Negociação": "bg-orange-100 text-orange-800 hover:bg-orange-100",
  "Em aberto": "bg-slate-100 text-slate-600 hover:bg-slate-100",
};