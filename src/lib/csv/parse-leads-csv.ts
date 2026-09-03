import Papa from "papaparse";

import { LEAD_STATUSES, SALE_STATUSES } from "@/lib/constants";
import type { LeadStatus, ParsedLeadRow, SaleStatus } from "@/lib/types";
import { sanitizePhone } from "@/lib/whatsapp";

export interface CsvParseResult {
  rows: ParsedLeadRow[];
  validCount: number;
  skippedCount: number;
  errors: string[];
}

const normalize = (value: string) =>
  value
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

  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;

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
    "negociacao": "Negociação",
    "negociação": "Negociação",
  };
  if (k in map) return map[k];
  return (SALE_STATUSES as string[]).includes(raw)
    ? (raw as SaleStatus)
    : "Em aberto";
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
 * - Ignora linhas de cabecalho/lixo ate encontrar a linha com "Nicho, Nome".
 * - Colunas suportadas: Nicho, Nome, Link do Perfil, Status de Prospeccao,
 *   Venda Realizada, Observacoes, Data, Msg a mandar, Valor da Venda.
 */
export function parseLeadsCsv(text: string): CsvParseResult {
  const parsed = Papa.parse<string[]>(text, { skipEmptyLines: "greedy" });
  const rows = parsed.data as string[][];
  const errors: string[] = [];

  const headerIndex = rows.findIndex(
    (r) => normalize(r[0] ?? "") === "nicho" && normalize(r[1] ?? "") === "nome",
  );

  if (headerIndex === -1) {
    return {
      rows: [],
      validCount: 0,
      skippedCount: 0,
      errors: [
        "Cabeçalho não encontrado. Verifique se a primeira linha com dados é " +
          '"Nicho, Nome, Link do Perfil, ..."',
      ],
    };
  }

  const header = (rows[headerIndex] ?? []).map((h) => normalize(h ?? ""));
  const col = (name: string) => {
    const index = header.indexOf(name);
    return index === -1 ? -1 : index;
  };

  const cols = {
    nicho: col("nicho"),
    nome: col("nome"),
    link: col("link do perfil"),
    status: col("status de prospeccao"),
    venda: col("venda realizada"),
    obs: col("observacoes"),
    data: col("data"),
    msg: col("msg a mandar"),
    valor: col("valor da venda"),
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

    const { whatsapp, link_perfil } = extractContact(get(cols.link));
    const valor = parseCurrency(get(cols.valor));
    const data_contato = parseDataValue(get(cols.data));

    out.push({
      nicho: get(cols.nicho) || null,
      nome,
      whatsapp,
      link_perfil,
      status_prospeccao: normalizeStatus(get(cols.status)),
      venda_realizada: normalizeSale(get(cols.venda)),
      observacoes: get(cols.obs) || null,
      data_contato,
      msg_a_mandar: get(cols.msg) || null,
      valor_venda: valor,
    });
  }

  return {
    rows: out,
    validCount: out.length,
    skippedCount,
    errors,
  };
}