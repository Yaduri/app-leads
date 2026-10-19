---
name: "CRM de Vendas de Sites & MRR"
description: "Terminal de alta precisão e cockpit de prospecção para web designers e agências digitais"
colors:
  canvas-deep: "oklch(0.13 0.015 260)"
  surface-card: "oklch(0.17 0.018 260)"
  surface-popover: "oklch(0.17 0.018 260)"
  surface-muted: "oklch(0.2 0.018 260)"
  text-primary: "oklch(0.98 0.005 260)"
  text-muted: "oklch(0.65 0.02 260)"
  accent-brand: "oklch(0.65 0.2 250)"
  accent-emerald: "oklch(0.7 0.18 160)"
  accent-amber: "oklch(0.75 0.17 65)"
  accent-rose: "oklch(0.65 0.22 25)"
  accent-sky: "oklch(0.7 0.2 250)"
  border-subtle: "oklch(0.25 0.02 260 / 70%)"
typography:
  display:
    fontFamily: "var(--font-sans), -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: "1.875rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "var(--font-sans), -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "-0.015em"
  title:
    fontFamily: "var(--font-sans), -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "-0.01em"
  body:
    fontFamily: "var(--font-sans), -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
  label:
    fontFamily: "var(--font-geist-mono), ui-monospace, SFMono-Regular, Menlo, monospace"
    fontSize: "0.6875rem"
    fontWeight: 500
    lineHeight: 1
    letterSpacing: "0.05em"
rounded:
  sm: "7.2px"
  md: "9.6px"
  lg: "12px"
  xl: "16.8px"
  full: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.accent-brand}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.lg}"
    padding: "8px 16px"
  button-whatsapp:
    backgroundColor: "{colors.accent-emerald}"
    textColor: "#ffffff"
    rounded: "{rounded.lg}"
    padding: "8px 14px"
  card-glass:
    backgroundColor: "{colors.surface-card}"
    rounded: "{rounded.xl}"
    padding: "16px"
---

# Design System: CRM de Vendas de Sites & MRR

## Overview

**Creative North Star: "The Velocity Studio"**

O sistema foi desenhado como um cockpit de operações veloz e de alta densidade para profissionais que vendem desenvolvimento web. A estética une a sobriedade de um terminal moderno no tema escuro profundo (`oklch(0.13 0.015 260)`) com o frescor do glassmorphism translúcido (`backdrop-filter: blur(12px)` e bordas finas com 70% de opacidade).

A hierarquia visual é orientada por dados de ação imediata: números monetários e datas críticas são destacados em fontes monoespaçadas de alta legibilidade, enquanto acentos cromáticos energéticos (verde esmeralda para fechamento de vendas, âmbar para follow-ups urgentes de hoje e azul celeste para receita recorrente/MRR) orientam o foco do usuário sem gerar fadiga visual.

**Key Characteristics:**
- Fundo escuro imersivo com camadas tonais sutis que dispensam sombras pesadas ou artificiais.
- Microinterações rápidas com feedback tátil e sonner toasts elegantes.
- Superfícies com translucidez e bordas com divisão de luz limpa.
- Cores semânticas reservadas estritamente para status de prospecção, dinheiro e prazo.

## Colors

A paleta de cores adota o modelo cromático perceptualmente uniforme OKLCH, garantindo contraste rigoroso e nitidez mesmo sob iluminação reduzida.

### Primary
- **Electric Indigo / Primary** (`oklch(0.65 0.2 250)`): Utilizado no botão principal de ação (Novo Lead, Salvar), badges de seleção ativa e estados de foco do sistema.
- **Pure Contrast Text** (`oklch(0.98 0.005 260)`): Texto principal para leitura rápida de títulos, nomes de clientes e valores monetários.

### Secondary
- **Emerald Closing** (`oklch(0.7 0.18 160)`): Exclusivo para o botão de ação rápida do WhatsApp, propostas aceitas e status "Venda Realizada".
- **Amber Urgency** (`oklch(0.75 0.17 65)`): Reservado para follow-ups que vencem hoje e alertas de atenção no cadastro.
- **Sky MRR** (`oklch(0.7 0.2 250)`): Utilizado para sinalizar receita recorrente mensal, planos de hospedagem e contatos em dia.
- **Rose Overdue** (`oklch(0.65 0.22 25)`): Aplicado exclusivamente em retornos atrasados e ações de perigo (excluir).

### Neutral
- **Deep Obsidian Canvas** (`oklch(0.13 0.015 260)`): Fundo base da aplicação inteira.
- **Surface Card Glass** (`oklch(0.17 0.018 260)`): Cartões do Kanban, painéis do Dashboard e modais.
- **Muted Surface** (`oklch(0.2 0.018 260)`): Elementos secundários, inputs e tags inativas.
- **Subtle Wire Border** (`oklch(0.25 0.02 260 / 70%)`): Linhas de demarcação ultrafinas.
- **Muted Text** (`oklch(0.65 0.02 260)`): Rótulos, explicações e timestamps secundários.

### Named Rules
**The Color-as-Action Rule.** Cores saturadas (verde, âmbar, vermelho, azul) nunca são usadas apenas como enfeite decorativo; cada cor viva indica um estado comercial real ou uma ação clicável.

**The Glass Perimeter Rule.** Divisórias e bordas de cartões usam no máximo 1px com canal alfa reduzido (60% a 70%), mantendo a sensação de leveza estrutural.

## Typography

A tipografia combina uma fonte sem serifa moderna e geométrica com uma fonte monoespaçada técnica para números, códigos e atalhos.

**Display Font:** `var(--font-sans)` (Inter / Geist Sans / system-ui)
**Body Font:** `var(--font-sans)`
**Label/Mono Font:** `var(--font-geist-mono)` (Geist Mono / ui-monospace)

**Character:** Tipografia compacta, direta e precisa, otimizada para listas densas de leads sem quebras indesejadas de linha.

### Hierarchy
- **Display** (Bold 700, 1.875rem, line-height 1.2, letter-spacing -0.025em): Títulos de seções de destaque e métricas financeiras principais no topo do dashboard.
- **Headline** (SemiBold 600, 1.25rem, line-height 1.3): Títulos de cards e modais principais.
- **Title** (SemiBold 600, 0.875rem, line-height 1.4): Nomes de leads em tabelas e cards Kanban.
- **Body** (Regular 400, 0.8125rem, line-height 1.5): Textos de observações, mensagens e descrições.
- **Label / Metric** (Medium 500, 0.6875rem, monoespaçado, letter-spacing 0.05em): Moeda (R$), datas de follow-up, atalhos de teclado (Ctrl+K, N) e badges de status.

### Named Rules
**The Numeric Clarity Rule.** Todos os valores financeiros (`valor_venda`, `valor_recorrente`), datas (`data_contato`, `data_proximo_contato`) e atalhos de teclado são obrigatoriamente renderizados com a fonte monoespaçada.

## Layout

O layout segue um modelo adaptativo de visualização dupla (Kanban horizontal e Tabela paginada responsiva).

- **Grid do Dashboard:** Grade responsiva de 4 colunas para métricas superiores (Total de Leads, Taxa de Conversão, Vendas e MRR), acompanhada por área principal dividida entre Ações Diárias (2/3) e Metas Financeiras (1/3).
- **Área de Leads:** Barra superior unificada com filtros rápidos tipo "pills" horizontais com rolagem suave, busca em tempo real e alternador de visualização (Tabela / Kanban).
- **Espaçamento e Densidade:** Escala compacta baseada em múltiplos de 4px (`gap-2`, `gap-3`, `gap-4`, `p-3.5`), maximizando o número de leads visíveis na tela sem rolagem vertical excessiva.
- **Navegação:** Sidebar recolhível no desktop (64px recolhido / 256px expandido) e barra de navegação inferior flutuante no mobile (`z-50`).

## Elevation & Depth

A profundidade é expressa quase que exclusivamente por **camadas tonais e glassmorphism**, em vez de sombras pretas difusas clássicas.

O fundo da aplicação repousa no nível 0 (`oklch(0.13)`). Cartões, gavetas e modais repousam no nível 1 (`oklch(0.17)` com `backdrop-filter: blur(12px)`). Popovers e dropdowns repousam no nível 2 (`oklch(0.20)` com `backdrop-filter: blur(16px)`).

### Shadow Vocabulary
- **Subtle Card Lift** (`shadow-md shadow-black/10`): Usado nos cartões principais do Kanban e do Dashboard.
- **Emerald Pulse Glow** (`0 0 20px -5px oklch(0.75 0.2 155 / 25%)`): Usado em cartões de follow-up de hoje e confirmações de venda.
- **Command Palette Depth** (`shadow-2xl shadow-black/40`): Usado no modal central do `Ctrl+K`.

### Named Rules
**The Tonal Layering Rule.** Elementos interativos sobem na escala de luminosidade OKLCH ao receber foco ou passar o mouse (`bg-card/60` -> `hover:bg-muted/40`), sem necessidade de deslocamento físico em pixels.

## Shapes

O sistema de formas privilegia cantos arredondados generosos e suaves, conferindo um toque moderno e orgânico:

- **Cartões e Modais:** Raios grandes (`rounded-2xl` / 16.8px) para acolher o conteúdo com elegância.
- **Botões e Inputs:** Raios médios (`rounded-xl` / 12px) que proporcionam uma pegada tátil agradável.
- **Badges e Pills:** Formato totalmente circular (`rounded-full` / 9999px) para filtros e tags de status.
- **Bordas:** Traçado contínuo de 1px com transparência de 60% a 70% (`border-border/70`).

## Components

### Buttons
- **Shape:** Cantos arredondados de 12px (`rounded-xl` / `rounded-lg`).
- **Primary:** Fundo Electric Indigo ou Emerald com texto contrastante e padding `px-4 py-2`.
- **WhatsApp Split-Button:** Botão de ação rápida verde esmeralda com dropdown acoplado para seleção de templates de mensagem.
- **Hover / Focus:** Transição suave de cor (`transition-all active:scale-[0.98]`) e anel de foco acessível (`focus-visible:ring-1`).

### Chips & Filter Pills
- **Style:** Formato pílula (`rounded-full`), fundo translúcido `bg-card/50` e borda `border-border/70`.
- **State:** Quando ativo, preenchimento sólido colorido (`bg-emerald-600`, `bg-sky-600`, `bg-amber-600`) com texto branco e contador em destaque.

### Cards / Containers
- **Corner Style:** `rounded-2xl` (16.8px).
- **Background:** `bg-card/60` com `backdrop-blur-xl`.
- **Internal Padding:** `p-4` a `p-6` em dashboards; `p-3.5` no Kanban para economia de espaço.

### Inputs & Fields
- **Style:** Fundo `bg-card/40` ou `bg-background/50`, borda de 1px `border-border/70`, altura compacta de 36px (`h-9`).
- **Focus:** Anel sutil com foco visível sem deformação de layout (`focus-visible:ring-1 focus-visible:ring-ring`).

### Command Palette (Ctrl+K)
- **Modal:** Centralizado, com backdrop blur denso, input de busca sem bordas internas e lista rolante de atalhos organizada por categorias (Ações, Navegação, Filtros).

## Do's and Don'ts

### Do:
- **Do** formatar qualquer moeda usando o padrão brasileiro (`R$ 1.500,00`) e fonte monoespaçada.
- **Do** usar o botão dedicado de WhatsApp com o menu de templates em qualquer lugar onde o telefone do cliente for exibido.
- **Do** manter a sidebar com suporte a estado minimizado em telas desktop para liberar espaço de visualização para o Kanban.
- **Do** preservar a divisão clara entre valores únicos de criação (Setup) e recorrentes (MRR de hospedagem).

### Don't:
- **Don't** utilizar fundos brancos puros ou cinzas lavados fora do tema pretendido; a identidade visual padrão é baseada em tons de ardósia e obsidiana com alto contraste.
- **Don't** abrir modais sem atalho de cancelamento rápido com a tecla `Esc` e gerenciamento de foco.
- **Don't** esconder status de pagamento em tabelas densas; clientes em produção com 50% pago devem ter visibilidade imediata.
- **Don't** bloquear a interface durante operações assíncronas; usar optimistic updates em alternâncias de status e toasts informativos da Sonner.
