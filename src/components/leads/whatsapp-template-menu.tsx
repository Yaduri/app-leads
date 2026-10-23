"use client";

import { useState, useEffect } from "react";
import {
  MessageCircle,
  ChevronDown,
  Sparkles,
  Clock,
  SendHorizontal,
  Globe,
  Gauge,
  ShieldCheck,
  CreditCard,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";
import {
  getCustomWhatsAppTemplates,
  WhatsAppTemplateSetting,
  DEFAULT_WHATSAPP_TEMPLATES,
} from "@/lib/pricing-settings";

interface WhatsAppTemplateMenuProps {
  phone: string | null;
  name: string;
  nicho?: string | null;
  valor?: number | null;
  dia?: number | null;
  defaultMessage?: string | null;
  label?: string;
  compact?: boolean;
  onContactSent?: () => void;
}

const TEMPLATE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  sem_site: Globe,
  site_lento: Gauge,
  followup_proposta: Clock,
  lembrete_mensalidade: CreditCard,
  objecao_instagram: ShieldCheck,
  demonstracao: Sparkles,
};

export function WhatsAppTemplateMenu({
  phone,
  name,
  nicho,
  valor,
  dia,
  defaultMessage,
  label,
  compact = true,
  onContactSent,
}: WhatsAppTemplateMenuProps) {
  const [customTemplates, setCustomTemplates] = useState<WhatsAppTemplateSetting[]>(DEFAULT_WHATSAPP_TEMPLATES);

  useEffect(() => {
    setCustomTemplates(getCustomWhatsAppTemplates());
  }, []);

  const firstName = name.trim().split(" ")[0] || "Olá";
  const nichoText = nicho ? nicho.toLowerCase() : "seu segmento";
  const valorText = valor ? `R$ ${valor.toLocaleString("pt-BR")}` : "R$ 150,00";
  const diaText = dia ? dia.toString() : "10";

  const interpolate = (text: string) => {
    return text
      .replace(/{nome}/g, firstName)
      .replace(/{nicho}/g, nichoText)
      .replace(/{valor}/g, valorText)
      .replace(/{dia}/g, diaText);
  };

  const dynamicTemplates = customTemplates.map((t) => ({
    id: t.id,
    title: t.title,
    description: t.description,
    text: interpolate(t.text),
    icon: TEMPLATE_ICONS[t.id] || FileText,
    disabled: false,
  }));

  const allTemplates = [
    ...(defaultMessage
      ? [
          {
            id: "default",
            title: "Mensagem Cadastrada",
            description: defaultMessage,
            text: defaultMessage,
            icon: SendHorizontal,
            disabled: false,
          },
        ]
      : []),
    ...dynamicTemplates,
  ];

  const primaryUrl = buildWhatsAppUrl(
    phone ?? "",
    defaultMessage || (dynamicTemplates[0] ? dynamicTemplates[0].text : `Olá, ${firstName}! Tudo bem?`),
  );

  if (!phone) {
    return (
      <Button
        variant="ghost"
        size={label ? "default" : "icon"}
        disabled
        title="Sem número de WhatsApp cadastrado"
        className="opacity-40 cursor-not-allowed"
      >
        <MessageCircle className="size-4" />
        {label ? <span className="ml-2">{label}</span> : null}
      </Button>
    );
  }

  const handleOpenTemplate = (text: string) => {
    const url = buildWhatsAppUrl(phone, text);
    if (url) {
      window.open(url, "_blank", "noopener,noreferrer");
      onContactSent?.();
    }
  };

  return (
    <div
      className="inline-flex items-center rounded-lg shadow-sm"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Botão Principal de Envio Rápido */}
      <Button
        render={
          <a
            href={primaryUrl || "#"}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => onContactSent?.()}
          />
        }
        size={label ? "default" : "icon"}
        className={cn(
          "bg-emerald-600 text-white hover:bg-emerald-500 active:scale-[0.98] transition-all font-medium",
          compact && !label && "rounded-r-none border-r border-emerald-700/40 size-8",
          label && "rounded-r-none border-r border-emerald-700/40",
        )}
        title="Abrir WhatsApp com mensagem principal"
      >
        <MessageCircle className="size-4" />
        {label ? <span className="ml-1.5">{label}</span> : null}
      </Button>

      {/* Dropdown com Modelos de Mensagens */}
      <DropdownMenu>
        <DropdownMenuTrigger
          type="button"
          className={cn(
            "inline-flex items-center justify-center bg-emerald-600 text-white hover:bg-emerald-500 rounded-r-lg rounded-l-none px-1 transition-all cursor-pointer outline-none active:scale-95",
            compact && "size-8 w-6",
            label && "h-9 w-7",
          )}
          title="Escolher modelo de mensagem"
        >
          <ChevronDown className="size-3.5 opacity-80" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[calc(100vw-2rem)] sm:w-80 max-w-80 p-2 space-y-1">
          <DropdownMenuLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-2 py-1">
            Modelos Rápidos (WhatsApp)
          </DropdownMenuLabel>
          <DropdownMenuSeparator />

          {allTemplates.map((tpl) => {
            const Icon = tpl.icon;
            return (
              <DropdownMenuItem
                key={tpl.id}
                disabled={tpl.disabled}
                onClick={() => handleOpenTemplate(tpl.text)}
                className="flex flex-col items-start gap-1 p-2 cursor-pointer rounded-md focus:bg-emerald-500/10 focus:text-emerald-300"
              >
                <div className="flex items-center gap-2 font-medium text-xs">
                  <Icon className="size-3.5 text-emerald-400" />
                  <span>{tpl.title}</span>
                </div>
                <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
                  {tpl.text}
                </p>
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
