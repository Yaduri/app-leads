"use client";

import { useState, useMemo } from "react";
import {
  Calculator,
  Check,
  Copy,
  SendHorizontal,
  Sparkles,
  CheckCircle2,
  Calendar,
  Layers,
  FileCheck2,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";

interface SiteProposalGeneratorProps {
  clientName: string;
  nicho?: string | null;
  phone?: string | null;
  currentValue?: number;
  currentRecurring?: number;
  onApplyValues?: (setup: number, recurring: number) => void;
}

interface ProjectType {
  id: string;
  name: string;
  description: string;
  defaultPrice: number;
}

const PROJECT_TYPES: ProjectType[] = [
  {
    id: "landing",
    name: "Landing Page de Alta Conversão",
    description: "Página única focada em gerar contatos e orçamentos no WhatsApp",
    defaultPrice: 1500,
  },
  {
    id: "institucional",
    name: "Site Institucional (3 a 5 páginas)",
    description: "Apresentação completa: Início, Sobre, Serviços, Galeria e Contato",
    defaultPrice: 2800,
  },
  {
    id: "ecommerce",
    name: "Loja Virtual / Catálogo",
    description: "Vitrine de produtos com carrinho e fechamento direto no WhatsApp/Pix",
    defaultPrice: 4200,
  },
  {
    id: "vendas",
    name: "Página de Vendas / Lançamento",
    description: "Copy persuasiva, vídeo de vendas, depoimentos e integração de checkout",
    defaultPrice: 1900,
  },
];

interface AddonOption {
  id: string;
  name: string;
  setupPrice: number;
  recurringPrice: number;
}

const ADDON_OPTIONS: AddonOption[] = [
  {
    id: "hospedagem",
    name: "Hospedagem Cloud Rápida + SSL Grátis",
    setupPrice: 0,
    recurringPrice: 150,
  },
  {
    id: "seo",
    name: "Otimização SEO Local no Google",
    setupPrice: 400,
    recurringPrice: 0,
  },
  {
    id: "pixel",
    name: "Integração WhatsApp Flutuante & Pixel Meta/Ads",
    setupPrice: 250,
    recurringPrice: 0,
  },
  {
    id: "blog",
    name: "Blog de Artigos Integrado",
    setupPrice: 600,
    recurringPrice: 0,
  },
  {
    id: "suporte",
    name: "Manutenção & Atualizações Mensais",
    setupPrice: 0,
    recurringPrice: 120,
  },
];

export function SiteProposalGenerator({
  clientName,
  nicho,
  phone,
  currentValue = 0,
  currentRecurring = 0,
  onApplyValues,
}: SiteProposalGeneratorProps) {
  const firstName = clientName.trim().split(" ")[0] || "Olá";

  const [selectedType, setSelectedType] = useState<string>("landing");
  const [selectedAddons, setSelectedAddons] = useState<string[]>(["hospedagem", "pixel"]);
  const [deadline, setDeadline] = useState<string>("5 a 10 dias úteis");
  const [customPrice, setCustomPrice] = useState<number | null>(null);
  const [customRecurring, setCustomRecurring] = useState<number | null>(null);

  // Calcula valores sugeridos
  const baseType = PROJECT_TYPES.find((t) => t.id === selectedType) || PROJECT_TYPES[0];

  const suggestedSetup = useMemo(() => {
    let total = baseType.defaultPrice;
    for (const addonId of selectedAddons) {
      const addon = ADDON_OPTIONS.find((a) => a.id === addonId);
      if (addon) total += addon.setupPrice;
    }
    return total;
  }, [baseType, selectedAddons]);

  const suggestedRecurring = useMemo(() => {
    let total = 0;
    for (const addonId of selectedAddons) {
      const addon = ADDON_OPTIONS.find((a) => a.id === addonId);
      if (addon) total += addon.recurringPrice;
    }
    return total;
  }, [selectedAddons]);

  const finalSetup = customPrice !== null ? customPrice : suggestedSetup;
  const finalRecurring = customRecurring !== null ? customRecurring : suggestedRecurring;

  const toggleAddon = (id: string) => {
    setSelectedAddons((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  // Texto formatado para o WhatsApp
  const proposalMessage = useMemo(() => {
    const nichoLine = nicho ? ` para o segmento de *${nicho}*` : "";
    const addonsList = selectedAddons
      .map((id) => ADDON_OPTIONS.find((a) => a.id === id)?.name)
      .filter(Boolean)
      .map((name) => `• ${name}`)
      .join("\n");

    const recurringText =
      finalRecurring > 0
        ? `\n🔄 *Hospedagem & Suporte:* ${formatCurrency(finalRecurring)}/mês`
        : "";

    return (
      `Olá, *${firstName}*! Tudo bem?\n\n` +
      `Conforme conversamos, estruturei a proposta comercial para o desenvolvimento do seu novo site${nichoLine}:\n\n` +
      `🎯 *Projeto:* ${baseType.name}\n` +
      `📌 *Escopo Principal:*\n` +
      `• Design 100% responsivo (otimizado para celulares e computadores)\n` +
      `• Carregamento ultra rápido e layout profissional\n` +
      `${addonsList ? addonsList + "\n" : ""}` +
      `\n💰 *Investimento de Criação:* ${formatCurrency(finalSetup)}` +
      `${recurringText}\n` +
      `⏱️ *Prazo de Entrega Estimado:* ${deadline}\n\n` +
      `Podemos dar o pontapé inicial e garantir essa condição exclusiva para você?`
    );
  }, [firstName, nicho, baseType, selectedAddons, finalSetup, finalRecurring, deadline]);

  const handleCopy = () => {
    navigator.clipboard.writeText(proposalMessage);
    toast.success("Proposta copiada para a área de transferência!");
  };

  const handleSendWhatsApp = () => {
    if (!phone) {
      toast.error("Lead não possui telefone cadastrado!");
      return;
    }
    const url = buildWhatsAppUrl(phone, proposalMessage);
    if (url) {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  const handleApply = () => {
    if (onApplyValues) {
      onApplyValues(finalSetup, finalRecurring);
      toast.success("Valores aplicados à ficha do lead!");
    }
  };

  return (
    <div className="rounded-2xl border border-border/70 bg-card/40 p-4 space-y-4">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-2 border-b border-border/60">
        <div className="flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-lg bg-primary/15 text-primary border border-primary/20">
            <Calculator className="size-3.5" />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-foreground">
              Gerador Rápido de Proposta Comercial
            </h4>
            <p className="text-[11px] text-muted-foreground">
              Configure o escopo de desenvolvimento e envie no WhatsApp
            </p>
          </div>
        </div>
      </div>

      {/* 1. Tipo de Site */}
      <div className="space-y-1.5">
        <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          1. Tipo de Projeto
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {PROJECT_TYPES.map((type) => {
            const isSelected = selectedType === type.id;
            return (
              <button
                key={type.id}
                type="button"
                onClick={() => {
                  setSelectedType(type.id);
                  setCustomPrice(null);
                }}
                className={cn(
                  "flex flex-col items-start p-2.5 rounded-xl border text-left transition-all cursor-pointer",
                  isSelected
                    ? "border-primary bg-primary/10 shadow-xs"
                    : "border-border/70 bg-background/50 hover:bg-muted/40",
                )}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-xs font-bold text-foreground line-clamp-1">
                    {type.name}
                  </span>
                  <span className="font-mono text-xs font-semibold text-primary">
                    {formatCurrency(type.defaultPrice)}
                  </span>
                </div>
                <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-1">
                  {type.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Opcionais de Escopo */}
      <div className="space-y-1.5">
        <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          2. Opcionais & Hospedagem
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
          {ADDON_OPTIONS.map((addon) => {
            const isChecked = selectedAddons.includes(addon.id);
            return (
              <button
                key={addon.id}
                type="button"
                onClick={() => {
                  toggleAddon(addon.id);
                  setCustomPrice(null);
                  setCustomRecurring(null);
                }}
                className={cn(
                  "flex items-center justify-between p-2 rounded-lg border text-left text-xs transition-all cursor-pointer",
                  isChecked
                    ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
                    : "border-border/60 bg-background/30 text-muted-foreground hover:bg-muted/30",
                )}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div
                    className={cn(
                      "flex size-4 items-center justify-center rounded border transition-colors shrink-0",
                      isChecked
                        ? "bg-emerald-500 border-emerald-500 text-white"
                        : "border-border/80 bg-background",
                    )}
                  >
                    {isChecked && <Check className="size-3 stroke-3" />}
                  </div>
                  <span className="truncate text-[11px]">{addon.name}</span>
                </div>
                <span className="font-mono text-[10px] font-semibold shrink-0 ml-1.5">
                  {addon.setupPrice > 0 && `+${formatCurrency(addon.setupPrice)}`}
                  {addon.recurringPrice > 0 && `+${formatCurrency(addon.recurringPrice)}/mês`}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Valores Finais e Prazo */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
        <div>
          <label className="text-[10px] font-semibold text-muted-foreground">
            Valor de Criação (R$)
          </label>
          <Input
            type="number"
            value={finalSetup}
            onChange={(e) => setCustomPrice(Number(e.target.value) || 0)}
            className="h-8 text-xs font-mono font-bold mt-1"
          />
        </div>
        <div>
          <label className="text-[10px] font-semibold text-muted-foreground">
            Hospedagem / Suporte (R$/mês)
          </label>
          <Input
            type="number"
            value={finalRecurring}
            onChange={(e) => setCustomRecurring(Number(e.target.value) || 0)}
            className="h-8 text-xs font-mono font-bold mt-1"
          />
        </div>
        <div>
          <label className="text-[10px] font-semibold text-muted-foreground">
            Prazo de Entrega
          </label>
          <Input
            type="text"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="h-8 text-xs mt-1"
          />
        </div>
      </div>

      {/* Botões de Ação */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-border/60">
        <div className="flex items-center gap-1.5">
          {onApplyValues && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleApply}
              className="text-xs h-8 gap-1.5 border-primary/30 text-primary hover:bg-primary/10"
              title="Salvar esses valores como o valor do projeto e da mensalidade do lead"
            >
              <FileCheck2 className="size-3.5" />
              Salvar no Lead
            </Button>
          )}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className="text-xs h-8 gap-1.5 text-muted-foreground hover:text-foreground"
          >
            <Copy className="size-3.5" />
            Copiar Texto
          </Button>
        </div>

        <Button
          type="button"
          size="sm"
          onClick={handleSendWhatsApp}
          disabled={!phone}
          className="text-xs h-8 gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-medium shadow-sm shadow-emerald-950/20"
        >
          <SendHorizontal className="size-3.5" />
          Enviar Proposta no WhatsApp
        </Button>
      </div>
    </div>
  );
}
