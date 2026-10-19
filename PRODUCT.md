# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Web designers autônomos, desenvolvedores frontend freelancers e donos de pequenas agências digitais que vendem desenvolvimento de sites (Landing Pages, Sites Institucionais, Lojas Virtuais/Catálogos e Páginas de Vendas) e prestam serviços de hospedagem e manutenção recorrente mensal.

Eles operam sob alto volume de prospecção fria (Instagram, Google Maps, scrapers externos como LeadHunter Pro), realizam dezenas de contatos diários no WhatsApp e precisam acompanhar follow-ups sem deixar propostas ou cobranças de mensalidade caírem no esquecimento.

## Product Purpose

Oferecer um CRM e pipeline ágil, focado 100% no modelo de negócio de venda e entrega de sites, permitindo ao profissional:
1. Prospectar e qualificar leads com base na presença digital atual do cliente (Sem Site, Site Antigo/Lento, Só Instagram).
2. Abordar contatos rapidamente no WhatsApp com scripts persuasivos personalizados por variáveis dinâmicas.
3. Gerar e enviar propostas comerciais de sites com cálculo de setup e recorrência com 1 clique.
4. Gerenciar as fases de entrega do site após o fechamento (Briefing & Conteúdo, Design, Dev, Revisão, Site no Ar).
5. Controlar pagamentos de entrada/quitação (50%/100%) e mensalidades ativas (MRR de hospedagem/suporte) com dia de vencimento.

O sucesso significa: taxa de conversão mais alta em contatos frios, zero follow-ups atrasados e previsibilidade financeira com receita recorrente consolidada.

## Positioning

Diferente de CRMs corporativos genéricos e pesados (HubSpot, RD Station, Pipedrive), este CRM foi desenhado exclusivamente para quem vende sites: incorpora diagnóstico de presença digital, cálculo automático de escopo de desenvolvimento, esteira de produção pós-venda e esteira de cobrança de mensalidades de hospedagem integrado ao WhatsApp.

## Operating Context

- **Rotina de Prospecção Diária:** O usuário acessa o Dashboard no início do dia para executar a fila de "Ações Urgentes do Dia" (leads com follow-up agendado para hoje ou atrasados).
- **Abordagem Rápida via WhatsApp:** Disparo de mensagens diretas usando modelos prontos e parametrizados (`{nome}`, `{nicho}`, `{valor}`, `{dia}`).
- **Captura Automática de Leads:** Integração via script Python (`crm_sync.py`) ou bots de automação através do endpoint REST `/api/leads`.
- **Navegação Produtiva no Teclado:** Paleta de comandos global (`Ctrl+K` / `Cmd+K`) para busca instantânea e atalho `N` para cadastro imediato sem tirar a mão do teclado.

## Capabilities and Constraints

- **Pipeline & Visualizações:** Alternância fluida entre visão Kanban por etapas e Tabela com paginação de alta performance para listas grandes (+200 leads).
- **Filtros Inteligentes:** Vistas rápidas de leads para Hoje, Atrasados, Negociação, Em Produção, Vendas Fechadas e Mensalidades/MRR.
- **Controle Financeiro de Projetos e Recorrência:**
  - Valores separados de Criação (Setup único) e Mensalidade (Hospedagem & Suporte mensal).
  - Status de pagamento dedicados (`Aguardando Entrada (50%)`, `50% Pago (Em Produção)`, `100% Quitado`, `Em Aberto`, `Mensalidade Pendente`, `Mensalidade em Dia`).
  - Dia de vencimento da hospedagem (1 a 31).
- **Detecção de Duplicidade:** Alerta em tempo real no formulário ao digitar telefone já existente no banco.
- **Customização Total:** Ajuste dinâmico de tabela de preços e textos de templates de mensagens na página de configurações.
- **Exportação & Backup:** Download completo da base de leads em CSV estruturado e importador em lote com mapeamento de colunas.
- **Stack Tecnológica:** Next.js 16 (Turbopack, App Router), React 19, Tailwind CSS v4, Radix/Base-UI, Supabase (PostgreSQL, Auth e Row Level Security).

## Brand Commitments

- **Identidade:** Visual moderno, escuro, profissional, estilo dashboard SaaS de alta precisão (tons de esmeralda, céu e âmbar para status e alertas sem sobrecarga visual).
- **Linguagem & Tom:** Direto, comercial, focado em fechamento e valor percebido para o cliente final.

## Evidence on Hand

- Código completo em produção com migrations SQL (`supabase/leads.sql`).
- Endpoint de API funcional `/api/leads` para ingestão externa.
- Templates pré-configurados em `src/lib/pricing-settings.ts` e componentes em `src/components/leads/`.

## Product Principles

1. **Agilidade Extrema:** Nenhuma ação comum (abrir WhatsApp, atualizar último contato, mudar status) deve exigir mais de 1 ou 2 cliques.
2. **Contexto de Web Design Primeiro:** O vocabulário e os campos sempre refletem a realidade de criação de sites (Landing Page, Institucional, Hospedagem, Entrega, Domínio/Pixel).
3. **Foco em Fechamento e MRR:** Vender o site é metade da batalha; manter o cliente na hospedagem mensal garante a sobrevivência e crescimento do negócio.
4. **Resiliência e Zero Perda de Dados:** Confirmações em ações destrutivas, backups em CSV a qualquer momento e detecção de contatos duplicados.

## Accessibility & Inclusion

- Navegação completa por teclado com atalhos globais (`Ctrl+K`, `N`, `Esc`, setas).
- Contraste legível em modo escuro e claro, suporte a leitores de tela com labels acessíveis nos botões de ação e modais com foco gerenciado.
