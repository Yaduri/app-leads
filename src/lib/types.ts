export type LeadStatus =
  | "Novo Lead"
  | "Em Andamento"
  | "Em Negociação"
  | "Concluído";

export type SaleStatus = "Sim" | "Não" | "Negociação" | "Em aberto";

export type ActionResult = { ok: boolean; error?: string };

export interface Lead {
  id: string;
  user_id: string;
  nicho: string | null;
  nome: string;
  whatsapp: string | null;
  link_perfil: string | null;
  status_prospeccao: LeadStatus;
  venda_realizada: SaleStatus;
  observacoes: string | null;
  data_contato: string | null;
  msg_a_mandar: string | null;
  valor_venda: number;
  created_at: string;
  updated_at: string;
}

export interface LeadInsert {
  user_id: string;
  nicho?: string | null;
  nome: string;
  whatsapp?: string | null;
  link_perfil?: string | null;
  status_prospeccao?: LeadStatus;
  venda_realizada?: SaleStatus;
  observacoes?: string | null;
  data_contato?: string | null;
  msg_a_mandar?: string | null;
  valor_venda?: number;
}

export interface ParsedLeadRow {
  nicho: string | null;
  nome: string;
  whatsapp: string | null;
  link_perfil: string | null;
  status_prospeccao: LeadStatus;
  venda_realizada: SaleStatus;
  observacoes: string | null;
  data_contato: string | null;
  msg_a_mandar: string | null;
  valor_venda: number;
}