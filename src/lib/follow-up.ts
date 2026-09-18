import type { LeadStatus, SaleStatus } from "@/lib/types";

export type FollowUpUrgency = "overdue" | "today" | "tomorrow" | "future" | "none";

export interface FollowUpInfo {
  urgency: FollowUpUrgency;
  label: string;
  diffDays: number;
  dateStr: string | null;
  isOverdue: boolean;
  isToday: boolean;
}

export function getQuickDate(daysToAdd: number): string {
  const d = new Date();
  d.setDate(d.getDate() + daysToAdd);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function formatSimpleDate(dateStr?: string | null): string {
  if (!dateStr) return "-";
  const [y, m, d] = dateStr.slice(0, 10).split("-");
  if (!y || !m || !d) return dateStr;
  return `${d}/${m}/${y}`;
}

export function getFollowUpInfo(lead: {
  data_proximo_contato?: string | null;
  data_contato?: string | null;
  status_prospeccao: LeadStatus;
  venda_realizada?: SaleStatus | null;
}): FollowUpInfo {
  const isFinished =
    lead.status_prospeccao === "Concluído" ||
    lead.status_prospeccao === "Sem interesse" ||
    lead.venda_realizada === "Sim" ||
    lead.venda_realizada === "Não";

  if (isFinished) {
    return {
      urgency: "none",
      label: "Finalizado",
      diffDays: 0,
      dateStr: lead.data_proximo_contato || lead.data_contato || null,
      isOverdue: false,
      isToday: false,
    };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // 1. Prioridade máxima: data_proximo_contato
  if (lead.data_proximo_contato) {
    const targetDate = new Date(lead.data_proximo_contato.slice(0, 10) + "T00:00:00");
    const diffTime = targetDate.getTime() - today.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      const overdueDays = Math.abs(diffDays);
      return {
        urgency: "overdue",
        label: `Atrasado ${overdueDays}d`,
        diffDays,
        dateStr: lead.data_proximo_contato,
        isOverdue: true,
        isToday: false,
      };
    }

    if (diffDays === 0) {
      return {
        urgency: "today",
        label: "Hoje",
        diffDays: 0,
        dateStr: lead.data_proximo_contato,
        isOverdue: false,
        isToday: true,
      };
    }

    if (diffDays === 1) {
      return {
        urgency: "tomorrow",
        label: "Amanhã",
        diffDays: 1,
        dateStr: lead.data_proximo_contato,
        isOverdue: false,
        isToday: false,
      };
    }

    return {
      urgency: "future",
      label: `Em ${diffDays}d`,
      diffDays,
      dateStr: lead.data_proximo_contato,
      isOverdue: false,
      isToday: false,
    };
  }

  // 2. Fallback: se não tem data_proximo_contato, analisa data_contato
  if (lead.data_contato) {
    const lastContact = new Date(lead.data_contato.slice(0, 10) + "T00:00:00");
    const diffTime = today.getTime() - lastContact.getTime();
    const daysSince = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (daysSince >= 3) {
      return {
        urgency: "overdue",
        label: `Sem contato ${daysSince}d`,
        diffDays: -daysSince,
        dateStr: lead.data_contato,
        isOverdue: true,
        isToday: false,
      };
    }
  }

  return {
    urgency: "none",
    label: "Sem agendamento",
    diffDays: 0,
    dateStr: null,
    isOverdue: false,
    isToday: false,
  };
}
