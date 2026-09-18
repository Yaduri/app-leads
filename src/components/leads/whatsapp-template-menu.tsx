"use client";

import {
  MessageCircle,
  ChevronDown,
  Sparkles,
  Clock,
  SendHorizontal,
  Globe,
  Gauge,
  ShieldCheck,
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
      id: "sem_site",
      title: "Sem Site (Landing Page & Google)",
      description: "Gancho para quem só tem Instagram ou não tem página",
      text: `Olá, ${firstName}! Tudo bem? Vi seu trabalho com ${nichoText} e percebi que você tem um ótimo perfil, mas quando o cliente pesquisa no Google vocês não têm uma página oficial para converter direto no WhatsApp. Criei um modelo exclusivo para o seu segmento que dobra os contatos diários. Posso te enviar o link da demonstração?`,
      icon: Globe,
      disabled: false,
    },
    {
      id: "site_lento",
      title: "Site Lento / Auditoria Mobile",
      description: "Para leads com site desatualizado ou lento",
      text: `Olá, ${firstName}! Tudo bem? Dei uma olhada no site de vocês e percebi que no celular ele demora para carregar e não tem botão direto de WhatsApp, o que faz muitos clientes desistirem antes de chamar. Fiz um diagnóstico rápido de melhorias para aumentar as vendas. Posso compartilhar aqui com você?`,
      icon: Gauge,
      disabled: false,
    },
    {
      id: "followup_proposta",
      title: "Follow-up de Proposta de Site",
      description: "Cobrança elegante sobre o projeto",
      text: `Oi, ${firstName}! Tudo joia? Passando para saber se você conseguiu dar uma olhada na proposta e na estrutura de páginas que desenhei para o site da sua empresa. Ficou alguma dúvida sobre o prazo ou as condições?`,
      icon: Clock,
      disabled: false,
    },
    {
      id: "objecao_instagram",
      title: "Objeção 'Só uso Instagram'",
      description: "Explica a força de ter canal próprio no Google",
      text: `Com certeza, ${firstName}! O Instagram é ótimo para relacionamento, mas a grande vantagem do site é que ele é um canal proprietário que coloca sua empresa no topo do Google quando as pessoas buscam ativamente por ${nichoText} na sua região, gerando clientes prontos para comprar. Quer ver como funciona?`,
      icon: ShieldCheck,
      disabled: false,
    },
    {
      id: "demonstracao",
      title: "Demonstração & Fechamento",
      description: "Convite para call rápida de 15 min",
      text: `Olá, ${firstName}! Montei uma demonstração prática de uma estrutura de alta conversão para ${nichoText}. Separei 15 minutinhos amanhã para te mostrar na tela. Às 14h ou 16h fica melhor para você?`,
      icon: Sparkles,
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
    <div
      className="inline-flex items-center rounded-lg shadow-sm"
      onClick={(e) => e.stopPropagation()}
    >
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
