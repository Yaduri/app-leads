"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { getQuickDate } from "@/lib/follow-up";
import { LEAD_STATUSES, NICHOS, SALE_STATUSES } from "@/lib/constants";
import type { EtapaEntrega, Lead, LeadInsert, LeadStatus, PresencaDigital, SaleStatus } from "@/lib/types";

const PRESENCA_OPTIONS: PresencaDigital[] = [
  "Sem Site",
  "Site Lento/Antigo",
  "Apenas Instagram",
  "Site Moderno",
];

const ETAPA_OPTIONS: EtapaEntrega[] = [
  "Briefing & Conteúdo",
  "Design & Layout",
  "Desenvolvimento",
  "Revisão com Cliente",
  "Site no Ar",
];

export interface LeadFormValues extends Omit<LeadInsert, "user_id"> {
  nome: string;
}

export function LeadFormDialog({
  open,
  onOpenChange,
  lead,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lead: Lead | null;
  onSubmit: (values: LeadFormValues) => Promise<void>;
}) {
  const isEditing = Boolean(lead);

  const [nome, setNome] = useState("");
  const [nicho, setNicho] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [linkPerfil, setLinkPerfil] = useState("");
  const [siteAtual, setSiteAtual] = useState("");
  const [presencaDigital, setPresencaDigital] = useState<PresencaDigital>("Sem Site");
  const [status, setStatus] = useState<LeadStatus>("Novo Lead");
  const [venda, setVenda] = useState<SaleStatus>("Em aberto");
  const [etapaEntrega, setEtapaEntrega] = useState<EtapaEntrega>("Briefing & Conteúdo");
  const [dataContato, setDataContato] = useState("");
  const [dataProximoContato, setDataProximoContato] = useState("");
  const [valor, setValor] = useState("0");
  const [valorRecorrente, setValorRecorrente] = useState("0");
  const [observacoes, setObservacoes] = useState("");
  const [msg, setMsg] = useState("");
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (open) {
      const d = new Date();
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      const todayLocal = `${year}-${month}-${day}`;

      setNome(lead?.nome ?? "");
      setNicho(lead?.nicho ?? "");
      setWhatsapp(lead?.whatsapp ?? "");
      setLinkPerfil(lead?.link_perfil ?? "");
      setSiteAtual(lead?.site_atual ?? "");
      setPresencaDigital(lead?.presenca_digital ?? "Sem Site");
      setStatus(lead?.status_prospeccao ?? "Novo Lead");
      setVenda(lead?.venda_realizada ?? "Em aberto");
      setEtapaEntrega(lead?.etapa_entrega ?? "Briefing & Conteúdo");
      setDataContato(lead?.data_contato ?? todayLocal);
      setDataProximoContato(lead?.data_proximo_contato ? lead.data_proximo_contato.slice(0, 10) : "");
      setValor(lead ? String(lead.valor_venda) : "0");
      setValorRecorrente(lead?.valor_recorrente ? String(lead.valor_recorrente) : "0");
      setObservacoes(lead?.observacoes ?? "");
      setMsg(lead?.msg_a_mandar ?? "");
      setPending(false);
    }
  }, [open, lead]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!nome.trim()) return;

    const parsedValor = parseFloat(valor.trim().replace(",", "."));
    const numericValor = isNaN(parsedValor)
      ? 0
      : Math.round(
          parseFloat(
            String(parsedValor).replace(",", ".").replace(/\.(?=\d{3,})/g, ""),
          ) * 100,
        ) / 100;

    const parsedRecorrente = parseFloat(valorRecorrente.trim().replace(",", "."));
    const numericRecorrente = isNaN(parsedRecorrente)
      ? 0
      : Math.round(
          parseFloat(
            String(parsedRecorrente).replace(",", ".").replace(/\.(?=\d{3,})/g, ""),
          ) * 100,
        ) / 100;

    setPending(true);
    try {
      await onSubmit({
        nome: nome.trim(),
        nicho: nicho.trim() || null,
        whatsapp: whatsapp.trim() || null,
        link_perfil: linkPerfil.trim() || null,
        site_atual: siteAtual.trim() || null,
        presenca_digital: presencaDigital,
        status_prospeccao: status,
        venda_realizada: venda,
        etapa_entrega: etapaEntrega,
        data_contato: dataContato || null,
        data_proximo_contato: dataProximoContato || null,
        msg_a_mandar: msg.trim() || null,
        observacoes: observacoes.trim() || null,
        valor_venda: numericValor,
        valor_recorrente: numericRecorrente,
      });
    } finally {
      setPending(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar lead" : "Novo lead"}</DialogTitle>
          <DialogDescription>
            Preencha os dados. O WhatsApp usa o número e a mensagem abaixo.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="nome">
              Nome <span className="text-destructive">*</span>
            </Label>
            <Input
              id="nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex.: Studio Lindo Estética"
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="nicho">Nicho</Label>
            <Input
              id="nicho"
              value={nicho}
              onChange={(e) => setNicho(e.target.value)}
              list="nicho-options"
              placeholder="Ex.: Estética"
            />
            <datalist id="nicho-options">
              {NICHOS.map((n) => (
                <option key={n} value={n} />
              ))}
            </datalist>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="whatsapp">WhatsApp</Label>
              <Input
                id="whatsapp"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="11998765432"
                inputMode="tel"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="link_perfil">Link do perfil</Label>
              <Input
                id="link_perfil"
                value={linkPerfil}
                onChange={(e) => setLinkPerfil(e.target.value)}
                placeholder="https://instagram.com/..."
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="site_atual">Site atual (se houver)</Label>
              <Input
                id="site_atual"
                value={siteAtual}
                onChange={(e) => setSiteAtual(e.target.value)}
                placeholder="exemplo.com.br"
              />
            </div>
            <div className="grid gap-2">
              <Label>Presença digital</Label>
              <Select
                value={presencaDigital}
                onValueChange={(v) => setPresencaDigital(v as PresencaDigital)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PRESENCA_OPTIONS.map((p) => (
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label>Status de prospecção</Label>
              <Select value={status} onValueChange={(v) => setStatus(v as LeadStatus)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LEAD_STATUSES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Venda realizada</Label>
              <Select value={venda} onValueChange={(v) => setVenda(v as SaleStatus)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SALE_STATUSES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {venda === "Sim" && (
            <div className="grid gap-2 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/25">
              <Label className="text-xs font-semibold text-emerald-400">
                Etapa de Entrega do Site (Produção)
              </Label>
              <Select
                value={etapaEntrega}
                onValueChange={(v) => setEtapaEntrega(v as EtapaEntrega)}
              >
                <SelectTrigger className="bg-background/80">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ETAPA_OPTIONS.map((et) => (
                    <SelectItem key={et} value={et}>
                      {et}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="data_contato">Último contato</Label>
              <Input
                id="data_contato"
                type="date"
                value={dataContato}
                onChange={(e) => setDataContato(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="data_proximo_contato">Próximo follow-up</Label>
                {dataProximoContato && (
                  <button
                    type="button"
                    onClick={() => setDataProximoContato("")}
                    className="text-[10px] text-muted-foreground hover:text-rose-400"
                  >
                    Limpar
                  </button>
                )}
              </div>
              <Input
                id="data_proximo_contato"
                type="date"
                value={dataProximoContato}
                onChange={(e) => setDataProximoContato(e.target.value)}
              />
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setDataProximoContato(getQuickDate(0))}
                  className="text-[10px] bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 border border-amber-500/20 px-1.5 py-0.5 rounded-md transition-colors"
                >
                  Hoje
                </button>
                <button
                  type="button"
                  onClick={() => setDataProximoContato(getQuickDate(1))}
                  className="text-[10px] bg-sky-500/10 text-sky-300 hover:bg-sky-500/20 border border-sky-500/20 px-1.5 py-0.5 rounded-md transition-colors"
                >
                  +1d
                </button>
                <button
                  type="button"
                  onClick={() => setDataProximoContato(getQuickDate(3))}
                  className="text-[10px] bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20 px-1.5 py-0.5 rounded-md transition-colors"
                >
                  +3d
                </button>
                <button
                  type="button"
                  onClick={() => setDataProximoContato(getQuickDate(7))}
                  className="text-[10px] bg-muted/60 text-muted-foreground hover:bg-muted border border-border/60 px-1.5 py-0.5 rounded-md transition-colors"
                >
                  +7d
                </button>
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="valor">Valor de criação (R$)</Label>
              <Input
                id="valor"
                value={valor}
                onChange={(e) => setValor(e.target.value)}
                placeholder="0.00"
                inputMode="decimal"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="valor_recorrente">Mensalidade / Hospedagem (R$/mês)</Label>
              <Input
                id="valor_recorrente"
                value={valorRecorrente}
                onChange={(e) => setValorRecorrente(e.target.value)}
                placeholder="0.00"
                inputMode="decimal"
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="msg_a_mandar">Msg a mandar</Label>
            <Textarea
              id="msg_a_mandar"
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              placeholder="Mensagem que será preenchida ao clicar no botão do WhatsApp"
              rows={3}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="observacoes">Observações</Label>
            <Textarea
              id="observacoes"
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              placeholder="Notas, follow ups, histórico..."
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={pending}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={pending}>
              {pending && <Loader2 className="size-4 animate-spin" />}
              {isEditing ? "Salvar" : "Criar lead"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}