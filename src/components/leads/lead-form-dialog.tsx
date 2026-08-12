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
import { LEAD_STATUSES, NICHOS, SALE_STATUSES } from "@/lib/constants";
import type { Lead, LeadInsert, LeadStatus, SaleStatus } from "@/lib/types";

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
  const isEditing = lead !== null;

  const [nome, setNome] = useState("");
  const [nicho, setNicho] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [linkPerfil, setLinkPerfil] = useState("");
  const [status, setStatus] = useState<LeadStatus>("Novo Lead");
  const [venda, setVenda] = useState<SaleStatus>("Em aberto");
  const [dataContato, setDataContato] = useState("");
  const [valor, setValor] = useState("0");
  const [observacoes, setObservacoes] = useState("");
  const [msg, setMsg] = useState("");
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (open) {
      setNome(lead?.nome ?? "");
      setNicho(lead?.nicho ?? "");
      setWhatsapp(lead?.whatsapp ?? "");
      setLinkPerfil(lead?.link_perfil ?? "");
      setStatus(lead?.status_prospeccao ?? "Novo Lead");
      setVenda(lead?.venda_realizada ?? "Em aberto");
      setDataContato(lead?.data_contato ?? "");
      setValor(lead ? String(lead.valor_venda) : "0");
      setObservacoes(lead?.observacoes ?? "");
      setMsg(lead?.msg_a_mandar ?? "");
      setPending(false);
    }
  }, [open, lead]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!nome.trim()) return;

    const parsedValor = parseFloat(valor.trim().replace(",", "."));
    // "R$ 690,00" digitado manualmente
    const numericValor = isNaN(parsedValor)
      ? 0
      : Math.round(
          parseFloat(
            String(parsedValor).replace(",", ".").replace(/\.(?=\d{3,})/g, ""),
          ) * 100,
        ) / 100;

    setPending(true);
    try {
      await onSubmit({
        nome: nome.trim(),
        nicho: nicho.trim() || null,
        whatsapp: whatsapp.trim() || null,
        link_perfil: linkPerfil.trim() || null,
        status_prospeccao: status,
        venda_realizada: venda,
        data_contato: dataContato || null,
        msg_a_mandar: msg.trim() || null,
        observacoes: observacoes.trim() || null,
        valor_venda: numericValor,
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

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="data_contato">Data de contato</Label>
              <Input
                id="data_contato"
                type="date"
                value={dataContato}
                onChange={(e) => setDataContato(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="valor">Valor da venda (R$)</Label>
              <Input
                id="valor"
                value={valor}
                onChange={(e) => setValor(e.target.value)}
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