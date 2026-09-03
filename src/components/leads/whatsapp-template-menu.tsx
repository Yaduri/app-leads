"use client";

import { MessageCircle, ChevronDown, Sparkles, Clock, SendHorizontal } from "lucide-react";
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

interface WhatsAppTemplateMenuProps {
  phone: string | null;
  name: string;
  nicho?: string | null;
  defaultMessage?: string | null;
  label?: string;
  compact?: boolean;
}

export function WhatsAppTemplateMenu({
  phone,
  name,
  nicho,
  defaultMessage,
  label,
  compact = true,
}: WhatsAppTemplateMenuProps) {
  const firstName = name.trim().split(" ")[0] || "Olá";
  const nichoText = nicho ? nicho.toLowerCase() : "seu segmento";

  const templates = [
    {
      id: "default",
      title: "Mensagem Cadastrada",
      description: defaultMessage || "Sem mensagem customizada salva",
      text: defaultMessage || `Olá, ${firstName}! Tudo bem?`,
      icon: SendHorizontal,
      disabled: !defaultMessage,
    },
    {
      id: "apresentacao",
      title: "1º Contato / Apresentação",
      description: `Apresentação direta para ${nichoText}`,
      text: `Olá, ${firstName}! Tudo bem? Vi seu trabalho com ${nichoText} e achei excelente. Gostaria de te apresentar uma oportunidade rápida para alavancar seus atendimentos. Teria 2 minutos?`,
      icon: Sparkles,
      disabled: false,
    },
    {
      id: "followup",
      title: "Follow-up de Negociação",
      description: "Retomar contato sem parecer invasivo",
      text: `Oi, ${firstName}! Passando rapidinho para saber se você conseguiu ver a mensagem anterior. Como estão as coisas por aí essa semana?`,
      icon: Clock,
      disabled: false,
    },
    {
      id: "demonstracao",
      title: "Demonstração & Fechamento",
      description: "Convite para call rápida de 15 min",
      text: `Olá, ${firstName}! Separei um horário exclusivo esta semana para te mostrar uma demonstração prática de como aumentar suas conversões. Terça ou quinta fica melhor para você?`,
      icon: MessageCircle,
      disabled: false,
    },
  ];

  const primaryUrl = buildWhatsAppUrl(phone ?? "", defaultMessage || templates[1].text);

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
    }
  };

  return (
    <div className="inline-flex items-center rounded-lg shadow-sm">
      {/* Botão Principal de Envio Rápido */}
      <Button
        render={<a href={primaryUrl || "#"} target="_blank" rel="noopener noreferrer" />}
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
          render={
            <Button
              size="icon"
              className={cn(
                "bg-emerald-600 text-white hover:bg-emerald-500 rounded-l-none px-1 transition-all",
                compact && "size-8 w-6",
                label && "h-9 w-7",
              )}
              title="Escolher modelo de mensagem"
            >
              <ChevronDown className="size-3.5 opacity-80" />
            </Button>
          }
        />
        <DropdownMenuContent align="end" className="w-80 p-2 space-y-1">
          <DropdownMenuLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-2 py-1">
            Modelos Rápidos (WhatsApp)
          </DropdownMenuLabel>
          <DropdownMenuSeparator />

          {templates.map((tpl) => {
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
