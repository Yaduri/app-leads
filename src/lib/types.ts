export type LeadStatus =
  | "Novo Lead"
  | "Em Andamento"
  | "Em Negociação"
  | "Concluído"
  | "Sem interesse";

export type SaleStatus = "Sim" | "Não" | "Negociação" | "Em aberto";

export type PresencaDigital =
  | "Sem Site"
  | "Site Lento/Antigo"
  | "Apenas Instagram"
  | "Site Moderno";

export type EtapaEntrega =
  | "Briefing & Conteúdo"
  | "Design & Layout"
  | "Desenvolvimento"
  | "Revisão com Cliente"
  | "Site no Ar";

export type ActionResult = { ok: boolean; error?: string };

export interface Lead {
  id: string;
  user_id: string;
  nicho: string | null;
  nome: string;
  whatsapp: string | null;
  link_perfil: string | null;
  site_atual?: string | null;
  presenca_digital?: PresencaDigital | null;
  status_prospeccao: LeadStatus;
  venda_realizada: SaleStatus;
  etapa_entrega?: EtapaEntrega | null;
  observacoes: string | null;
  data_contato: string | null;
  data_proximo_contato?: string | null;
  msg_a_mandar: string | null;
  valor_venda: number;
  valor_recorrente?: number;
  created_at: string;
  updated_at: string;
}

export interface LeadInsert {
  user_id: string;
  nicho?: string | null;
  nome: string;
  whatsapp?: string | null;
  link_perfil?: string | null;
  site_atual?: string | null;
  presenca_digital?: PresencaDigital | null;
  status_prospeccao?: LeadStatus;
  venda_realizada?: SaleStatus;
  etapa_entrega?: EtapaEntrega | null;
  observacoes?: string | null;
  data_contato?: string | null;
  data_proximo_contato?: string | null;
  msg_a_mandar?: string | null;
  valor_venda?: number;
  valor_recorrente?: number;
}

export interface ParsedLeadRow {
  nicho: string | null;
  nome: string;
  whatsapp: string | null;
  link_perfil: string | null;
  site_atual?: string | null;
  presenca_digital?: PresencaDigital | null;
  status_prospeccao: LeadStatus;
  venda_realizada: SaleStatus;
  etapa_entrega?: EtapaEntrega | null;
  observacoes: string | null;
  data_contato: string | null;
  data_proximo_contato?: string | null;
  msg_a_mandar: string | null;
  valor_venda: number;
  valor_recorrente?: number;
}