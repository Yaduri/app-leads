export interface ProjectPricing {
  id: string;
  name: string;
  description: string;
  defaultPrice: number;
}

export interface AddonPricing {
  id: string;
  name: string;
  setupPrice: number;
  recurringPrice: number;
}

export interface WhatsAppTemplateSetting {
  id: string;
  title: string;
  description: string;
  text: string;
}

export const DEFAULT_PROJECT_PRICING: ProjectPricing[] = [
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

export const DEFAULT_ADDON_PRICING: AddonPricing[] = [
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

export const DEFAULT_WHATSAPP_TEMPLATES: WhatsAppTemplateSetting[] = [
  {
    id: "sem_site",
    title: "Sem Site (Landing Page & Google)",
    description: "Gancho para quem só tem Instagram ou não tem página",
    text: "Olá, {nome}! Tudo bem? Vi seu trabalho com {nicho} e percebi que você tem um ótimo perfil, mas quando o cliente pesquisa no Google vocês não têm uma página oficial para converter direto no WhatsApp. Criei um modelo exclusivo para o seu segmento que dobra os contatos diários. Posso te enviar o link da demonstração?",
  },
  {
    id: "site_lento",
    title: "Site Lento / Auditoria Mobile",
    description: "Para leads com site desatualizado ou lento",
    text: "Olá, {nome}! Tudo bem? Dei uma olhada no site de vocês e percebi que no celular ele demora para carregar e não tem botão direto de WhatsApp, o que faz muitos clientes desistirem antes de chamar. Fiz um diagnóstico rápido de melhorias para aumentar as vendas. Posso compartilhar aqui com você?",
  },
  {
    id: "followup_proposta",
    title: "Follow-up de Proposta de Site",
    description: "Cobrança elegante sobre o projeto",
    text: "Oi, {nome}! Tudo joia? Passando para saber se você conseguiu dar uma olhada na proposta e na estrutura de páginas que desenhei para o site da sua empresa. Ficou alguma dúvida sobre o prazo ou as condições?",
  },
  {
    id: "lembrete_mensalidade",
    title: "Lembrete de Mensalidade / Hospedagem",
    description: "Aviso amigável de renovação de hospedagem e suporte",
    text: "Olá, {nome}! Tudo joia? Passando para avisar que a mensalidade de Hospedagem & Manutenção do seu site vence no dia {dia}. O valor é de {valor}. Segue a nossa chave PIX para acerto. Qualquer dúvida estamos à disposição!",
  },
  {
    id: "objecao_instagram",
    title: "Objeção 'Só uso Instagram'",
    description: "Explica a força de ter canal próprio no Google",
    text: "Com certeza, {nome}! O Instagram é ótimo para relacionamento, mas a grande vantagem do site é que ele é um canal proprietário que coloca sua empresa no topo do Google quando as pessoas buscam ativamente por {nicho} na sua região, gerando clientes prontos para comprar. Quer ver como funciona?",
  },
  {
    id: "demonstracao",
    title: "Demonstração & Fechamento",
    description: "Convite para call rápida de 15 min",
    text: "Olá, {nome}! Montei uma demonstração prática de uma estrutura de alta conversão para {nicho}. Separei 15 minutinhos amanhã para te mostrar na tela. Às 14h ou 16h fica melhor para você?",
  },
];

export function getCustomPricing(): {
  projects: ProjectPricing[];
  addons: AddonPricing[];
} {
  if (typeof window === "undefined") {
    return {
      projects: DEFAULT_PROJECT_PRICING,
      addons: DEFAULT_ADDON_PRICING,
    };
  }
  try {
    const rawProj = localStorage.getItem("crm_custom_pricing_projects");
    const rawAddons = localStorage.getItem("crm_custom_pricing_addons");
    return {
      projects: rawProj ? JSON.parse(rawProj) : DEFAULT_PROJECT_PRICING,
      addons: rawAddons ? JSON.parse(rawAddons) : DEFAULT_ADDON_PRICING,
    };
  } catch {
    return {
      projects: DEFAULT_PROJECT_PRICING,
      addons: DEFAULT_ADDON_PRICING,
    };
  }
}

export function saveCustomPricing(projects: ProjectPricing[], addons: AddonPricing[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem("crm_custom_pricing_projects", JSON.stringify(projects));
  localStorage.setItem("crm_custom_pricing_addons", JSON.stringify(addons));
}

export function getCustomWhatsAppTemplates(): WhatsAppTemplateSetting[] {
  if (typeof window === "undefined") {
    return DEFAULT_WHATSAPP_TEMPLATES;
  }
  try {
    const raw = localStorage.getItem("crm_custom_whatsapp_templates");
    return raw ? JSON.parse(raw) : DEFAULT_WHATSAPP_TEMPLATES;
  } catch {
    return DEFAULT_WHATSAPP_TEMPLATES;
  }
}

export function saveCustomWhatsAppTemplates(templates: WhatsAppTemplateSetting[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem("crm_custom_whatsapp_templates", JSON.stringify(templates));
}
