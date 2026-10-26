import Papa from "papaparse";

import { LEAD_STATUSES, SALE_STATUSES } from "@/lib/constants";
import type {
  EtapaEntrega,
  LeadStatus,
  ParsedLeadRow,
  PresencaDigital,
  SaleStatus,
  StatusPagamento,
} from "@/lib/types";
import { sanitizePhone } from "@/lib/whatsapp";

export interface CsvParseResult {
  rows: ParsedLeadRow[];
  validCount: number;
  skippedCount: number;
  errors: string[];
}

const normalize = (value: string) =>
  value
    .replace(/^\uFEFF/, "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();

const isUrl = (value: string) =>
  /^(https?:\/\/)?[\w-]+(\.[\w-]+)+(\/\S*)?$/i.test(value) &&
  /[^\d]/.test(value);

export function parseCurrency(value: string): number {
  if (!value.trim()) return 0;
  const cleaned = value
    .replace(/R\$\s*/i, "")
    .replace(/\./g, "")
    .replace(/,/g, ".")
    .replace(/[^\d.\-]/g, "")
    .trim();
  const num = parseFloat(cleaned);
  if (isNaN(num)) return 0;
  return Math.round(num * 100) / 100;
}

/**
 * Aceita "DD/MM", "DD/MM/AAAA", "DD/MM/AA" ou ISO "AAAA-MM-DD".
 * Quando nao ha ano informado, assume o ano corrente.
 */
export function parseDataValue(raw: string): string | null {
  const s = raw.trim();
  if (!s) return null;

  if (/^\d{4}-\d{2}-\d{2}/.test(s)) return s.slice(0, 10);

  const m = s.match(/^(\d{1,2})\/(\d{1,2})(?:\/(\d{2,4}))?$/);
  if (!m) return null;

  const day = Number(m[1]);
  const month = Number(m[2]);
  let year = m[3] ? Number(m[3]) : new Date().getFullYear();
  if (year < 100) year += 2000;

  const date = new Date(year, month - 1, day);
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export function normalizeStatus(raw: string): LeadStatus {
  const k = normalize(raw);
  const map: Record<string, LeadStatus> = {
    "": "Novo Lead",
    "novo lead": "Novo Lead",
    "em andamento": "Em Andamento",
    "em negociacao": "Em Negociação",
    concluido: "Concluído",
    "sem interesse": "Sem interesse",
    desistiu: "Sem interesse",
    perdido: "Sem interesse",
    "nao tem interesse": "Sem interesse",
  };
  if (k in map) return map[k];
  return (LEAD_STATUSES as string[]).includes(raw) ? (raw as LeadStatus) : "Novo Lead";
}

export function normalizeSale(raw: string): SaleStatus {
  const k = normalize(raw);
  const map: Record<string, SaleStatus> = {
    "": "Em aberto",
    sim: "Sim",
    nao: "Não",
    "follow up": "Negociação",
    "em aberto": "Em aberto",
    "em negociacao": "Negociação",
    negociacao: "Negociação",
    "negociação": "Negociação",
  };
  if (k in map) return map[k];
  return (SALE_STATUSES as string[]).includes(raw)
    ? (raw as SaleStatus)
    : "Em aberto";
}

export function normalizePresenca(raw: string, siteAtual?: string | null): PresencaDigital {
  const k = normalize(raw);
  if (k.includes("sem site")) return "Sem Site";
  if (k.includes("lento") || k.includes("antigo")) return "Site Lento/Antigo";
  if (k.includes("instagram") || k.includes("insta")) return "Apenas Instagram";
  if (k.includes("moderno") || k.includes("bom")) return "Site Moderno";
  return siteAtual ? "Site Lento/Antigo" : "Sem Site";
}

export function normalizeEtapa(raw: string): EtapaEntrega {
  const k = normalize(raw);
  if (!k) return "Briefing & Conteúdo";
  if (k.includes("briefing") || k.includes("conteudo")) return "Briefing & Conteúdo";
  if (k.includes("design") || k.includes("layout")) return "Design & Layout";
  if (k.includes("desenvolvimento") || k.includes("dev")) return "Desenvolvimento";
  if (k.includes("revisao") || k.includes("cliente")) return "Revisão com Cliente";
  if (k.includes("no ar") || k.includes("publicado") || k.includes("finalizado")) return "Site no Ar";
  return "Briefing & Conteúdo";
}

export function normalizeStatusPagamento(raw: string): StatusPagamento {
  const k = normalize(raw);
  if (!k) return "Em Aberto";
  if (k.includes("aguardando") || k.includes("entrada")) return "Aguardando Entrada (50%)";
  if (k.includes("50%") || k.includes("producao")) return "50% Pago (Em Produção)";
  if (k.includes("100%") || k.includes("quitado")) return "100% Quitado";
  if (k.includes("pendente") || k.includes("atrasad")) return "Mensalidade Pendente";
  if (k.includes("dia")) return "Mensalidade em Dia";
  if (k.includes("pago")) return "100% Quitado";
  return "Em Aberto";
}

export function parseDueDay(raw: string): number | null {
  if (!raw) return null;
  const cleaned = raw.replace(/\D/g, "");
  if (!cleaned) return null;
  const num = parseInt(cleaned, 10);
  if (isNaN(num) || num < 1 || num > 31) return null;
  return num;
}

function extractContact(value: string): {
  whatsapp: string | null;
  link_perfil: string | null;
} {
  const s = value.trim();
  if (!s) return { whatsapp: null, link_perfil: null };

  if (isUrl(s)) return { whatsapp: null, link_perfil: s };

  const phone = sanitizePhone(s);
  if (phone) return { whatsapp: phone, link_perfil: null };

  return { whatsapp: null, link_perfil: null };
}

/**
 * Faz o parsing de um CSV de leads.
 * - Ignora linhas de cabecalho/lixo ate encontrar a linha com cabeçalhos válidos.
 * - Suporta tanto o modelo clássico do Google Sheets quanto o backup completo com todos os campos do sistema.
 */
export function parseLeadsCsv(text: string): CsvParseResult {
  const parsed = Papa.parse<string[]>(text, { skipEmptyLines: "greedy" });
  const rows = parsed.data as string[][];
  const errors: string[] = [];

  const headerIndex = rows.findIndex(
    (r) =>
      (normalize(r[0] ?? "") === "nicho" && normalize(r[1] ?? "") === "nome") ||
      (r.some((cell) => normalize(cell) === "nome") &&
        r.some(
          (cell) =>
            normalize(cell) === "whatsapp" ||
            normalize(cell) === "link do perfil" ||
            normalize(cell) === "nicho" ||
            normalize(cell) === "status de prospeccao",
        )),
  );

  if (headerIndex === -1) {
    return {
      rows: [],
      validCount: 0,
      skippedCount: 0,
      errors: [
        "Cabeçalho não encontrado. Verifique se o arquivo possui colunas como " +
          '"Nome", "WhatsApp", "Status de Prospecção", etc.',
      ],
    };
  }

  const header = (rows[headerIndex] ?? []).map((h) => normalize(h ?? ""));
  const colFind = (...names: string[]) => {
    for (const name of names) {
      const index = header.indexOf(name);
      if (index !== -1) return index;
    }
    return -1;
  };

  const cols = {
    nicho: colFind("nicho"),
    nome: colFind("nome"),
    whatsapp: colFind("whatsapp", "telefone", "celular", "contato"),
    link: colFind("link do perfil", "link", "perfil", "instagram"),
    siteAtual: colFind("site atual", "site"),
    presenca: colFind("presenca digital", "presenca"),
    status: colFind("status de prospeccao", "status", "status prospeccao"),
    venda: colFind("venda realizada", "venda"),
    etapa: colFind("etapa de entrega", "etapa"),
    statusPagamento: colFind("status do pagamento", "status pagamento", "pagamento"),
    diaVencimento: colFind("dia de vencimento", "dia vencimento", "vencimento"),
    obs: colFind("observacoes", "observacao", "obs"),
    data: colFind("data", "data contato", "data do contato"),
    proximoContato: colFind("proximo contato", "follow up", "followup", "retorno"),
    msg: colFind("msg a mandar", "mensagem", "msg"),
    valor: colFind("valor da venda", "valor", "preco"),
    recorrente: colFind("valor recorrente", "recorrente", "mensalidade", "mrr"),
  };

  if (cols.nome === -1) {
    return {
      rows: [],
      validCount: 0,
      skippedCount: 0,
      errors: ['Coluna "Nome" não encontrada no arquivo.'],
    };
  }

  const out: ParsedLeadRow[] = [];
  let skippedCount = 0;

  for (let i = headerIndex + 1; i < rows.length; i++) {
    const row = rows[i] ?? [];
    const get = (idx: number) => (idx >= 0 ? (row[idx] ?? "").trim() : "");

    const nome = get(cols.nome);
    if (!nome) {
      skippedCount += 1;
      continue;
    }

    const explicitWhatsapp = sanitizePhone(get(cols.whatsapp));
    const extracted = extractContact(get(cols.link));

    const whatsapp = explicitWhatsapp || extracted.whatsapp;
    const link_perfil = extracted.link_perfil;
    const site_atual = get(cols.siteAtual) || null;
    const presenca_digital = normalizePresenca(get(cols.presenca), site_atual);
    const etapa_entrega = normalizeEtapa(get(cols.etapa));
    const status_pagamento = normalizeStatusPagamento(get(cols.statusPagamento));
    const dia_vencimento = parseDueDay(get(cols.diaVencimento));

    const valor = parseCurrency(get(cols.valor));
    const valor_recorrente = parseCurrency(get(cols.recorrente));
    const data_contato = parseDataValue(get(cols.data));
    const data_proximo_contato = parseDataValue(get(cols.proximoContato));

    out.push({
      nicho: get(cols.nicho) || null,
      nome,
      whatsapp,
      link_perfil,
      site_atual,
      presenca_digital,
      status_prospeccao: normalizeStatus(get(cols.status)),
      venda_realizada: normalizeSale(get(cols.venda)),
      etapa_entrega,
      status_pagamento,
      dia_vencimento,
      observacoes: get(cols.obs) || null,
      data_contato,
      data_proximo_contato,
      msg_a_mandar: get(cols.msg) || null,
      valor_venda: valor,
      valor_recorrente,
    });
  }

  return {
    rows: out,
    validCount: out.length,
    skippedCount,
    errors,
  };
}
