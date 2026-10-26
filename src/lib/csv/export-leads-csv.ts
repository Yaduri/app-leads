import Papa from "papaparse";
import type { Lead } from "@/lib/types";

export interface ExportLeadRow {
  Nicho: string;
  Nome: string;
  WhatsApp: string;
  "Link do Perfil": string;
  "Site Atual": string;
  "Presença Digital": string;
  "Status de Prospecção": string;
  "Venda Realizada": string;
  "Etapa de Entrega": string;
  "Status do Pagamento": string;
  "Dia de Vencimento": string;
  Observações: string;
  Data: string;
  "Próximo Contato": string;
  "Msg a mandar": string;
  "Valor da Venda": string;
  "Valor Recorrente": string;
}

export function formatLeadsForCsv(leads: Lead[]): ExportLeadRow[] {
  return leads.map((l) => ({
    Nicho: l.nicho ?? "",
    Nome: l.nome ?? "",
    WhatsApp: l.whatsapp ?? "",
    "Link do Perfil": l.link_perfil || l.whatsapp || "",
    "Site Atual": l.site_atual ?? "",
    "Presença Digital": l.presenca_digital ?? "Sem Site",
    "Status de Prospecção": l.status_prospeccao ?? "Novo Lead",
    "Venda Realizada": l.venda_realizada ?? "Em aberto",
    "Etapa de Entrega": l.etapa_entrega ?? "Briefing & Conteúdo",
    "Status do Pagamento": l.status_pagamento ?? "Em Aberto",
    "Dia de Vencimento": l.dia_vencimento ? String(l.dia_vencimento) : "",
    Observações: l.observacoes ?? "",
    Data: l.data_contato ?? "",
    "Próximo Contato": l.data_proximo_contato ?? "",
    "Msg a mandar": l.msg_a_mandar ?? "",
    "Valor da Venda": l.valor_venda
      ? `R$ ${Number(l.valor_venda).toFixed(2).replace(".", ",")}`
      : "R$ 0,00",
    "Valor Recorrente": l.valor_recorrente
      ? `R$ ${Number(l.valor_recorrente).toFixed(2).replace(".", ",")}`
      : "R$ 0,00",
  }));
}

export function downloadLeadsCsv(leads: Lead[], filename?: string) {
  const csvData = formatLeadsForCsv(leads);
  const csv = Papa.unparse(csvData);
  // Adiciona BOM (\uFEFF) para garantir renderização perfeita de acentuação no Excel Windows/Mac
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const defaultFilename = `leads-export-${new Date().toISOString().slice(0, 10)}.csv`;
  link.setAttribute("href", url);
  link.setAttribute("download", filename || defaultFilename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
