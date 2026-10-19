"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  LayoutDashboard,
  ListChecks,
  Upload,
  Settings,
  Plus,
  Clock,
  AlertCircle,
  CreditCard,
  Rocket,
  CheckCircle2,
  ArrowRight,
  Sparkles,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface CommandItem {
  id: string;
  title: string;
  category: "Navegação" | "Filtros de Leads" | "Ações";
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  shortcut?: string;
  action: () => void;
}

export function CommandMenu({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleOpenNewLead = useCallback(() => {
    onOpenChange(false);
    if (window.location.pathname === "/leads") {
      window.dispatchEvent(new CustomEvent("crm:new-lead"));
    } else {
      router.push("/leads?new=1");
    }
  }, [onOpenChange, router]);

  const handleNavigate = useCallback(
    (path: string) => {
      onOpenChange(false);
      router.push(path);
    },
    [onOpenChange, router],
  );

  const items: CommandItem[] = useMemo(
    () => [
      {
        id: "novo-lead",
        title: "Cadastrar Novo Lead",
        category: "Ações",
        icon: Plus,
        badge: "Atalho",
        shortcut: "N",
        action: handleOpenNewLead,
      },
      {
        id: "dashboard",
        title: "Ir para Dashboard",
        category: "Navegação",
        icon: LayoutDashboard,
        action: () => handleNavigate("/dashboard"),
      },
      {
        id: "leads",
        title: "Ir para Todos os Leads",
        category: "Navegação",
        icon: ListChecks,
        action: () => handleNavigate("/leads"),
      },
      {
        id: "importar",
        title: "Importar Planilha CSV",
        category: "Navegação",
        icon: Upload,
        action: () => handleNavigate("/importar"),
      },
      {
        id: "configuracoes",
        title: "Configurações & Tabela de Preços",
        category: "Navegação",
        icon: Settings,
        action: () => handleNavigate("/configuracoes"),
      },
      {
        id: "filter-hoje",
        title: "Ver Follow-ups de Hoje",
        category: "Filtros de Leads",
        icon: Clock,
        action: () => handleNavigate("/leads?filter=hoje"),
      },
      {
        id: "filter-atrasados",
        title: "Ver Retornos Atrasados",
        category: "Filtros de Leads",
        icon: AlertCircle,
        action: () => handleNavigate("/leads?filter=atrasados"),
      },
      {
        id: "filter-mensalidades",
        title: "Ver Mensalidades & MRR (Hospedagem)",
        category: "Filtros de Leads",
        icon: CreditCard,
        action: () => handleNavigate("/leads?filter=mensalidades"),
      },
      {
        id: "filter-producao",
        title: "Ver Sites em Produção / Entrega",
        category: "Filtros de Leads",
        icon: Rocket,
        action: () => handleNavigate("/leads?filter=producao"),
      },
      {
        id: "filter-vendas",
        title: "Ver Vendas Fechadas",
        category: "Filtros de Leads",
        icon: CheckCircle2,
        action: () => handleNavigate("/leads?filter=vendas"),
      },
    ],
    [handleOpenNewLead, handleNavigate],
  );

  const filteredItems = useMemo(() => {
    if (!query.trim()) return items;
    const q = query.toLowerCase();
    return items.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q),
    );
  }, [items, query]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Keyboard navigation inside command palette
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < filteredItems.length - 1 ? prev + 1 : 0,
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev > 0 ? prev - 1 : filteredItems.length - 1,
        );
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (filteredItems[selectedIndex]) {
          filteredItems[selectedIndex].action();
        }
      }
    },
    [filteredItems, selectedIndex],
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="p-0 overflow-hidden sm:max-w-xl border-border/80 bg-background/95 backdrop-blur-2xl shadow-2xl"
        onKeyDown={handleKeyDown}
      >
        <DialogTitle className="sr-only">Busca Rápida e Comandos</DialogTitle>

        {/* Input de Busca */}
        <div className="flex items-center gap-3 border-b border-border/70 px-4 py-3.5">
          <Search className="size-4 text-muted-foreground shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Digite para buscar página, filtro ou ação..."
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
            autoFocus
          />
          <kbd className="hidden sm:inline-flex items-center gap-0.5 rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[11px] text-muted-foreground">
            ESC
          </kbd>
        </div>

        {/* Lista de Resultados */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {filteredItems.length === 0 ? (
            <div className="py-8 text-center text-xs text-muted-foreground">
              Nenhuma ação ou página encontrada para &ldquo;{query}&rdquo;.
            </div>
          ) : (
            filteredItems.map((item, idx) => {
              const Icon = item.icon;
              const isSelected = idx === selectedIndex;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={item.action}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={cn(
                    "flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left text-xs transition-colors cursor-pointer",
                    isSelected
                      ? "bg-primary text-primary-foreground font-medium shadow-sm"
                      : "text-foreground hover:bg-muted/60",
                  )}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon
                      className={cn(
                        "size-4 shrink-0",
                        isSelected
                          ? "text-primary-foreground"
                          : "text-muted-foreground",
                      )}
                    />
                    <span className="truncate">{item.title}</span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={cn(
                        "text-[11px] font-mono",
                        isSelected
                          ? "text-primary-foreground/80"
                          : "text-muted-foreground/60",
                      )}
                    >
                      {item.category}
                    </span>
                    {item.shortcut ? (
                      <kbd
                        className={cn(
                          "rounded px-1.5 py-0.5 font-mono text-[11px] border",
                          isSelected
                            ? "bg-primary-foreground/20 text-primary-foreground border-primary-foreground/30"
                            : "bg-muted text-muted-foreground border-border",
                        )}
                      >
                        {item.shortcut}
                      </kbd>
                    ) : (
                      <ArrowRight
                        className={cn(
                          "size-3 opacity-0 transition-opacity",
                          isSelected && "opacity-100",
                        )}
                      />
                    )}
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Rodapé com Dicas de Teclado */}
        <div className="border-t border-border/70 bg-muted/30 px-4 py-2 flex items-center justify-between text-[11px] text-muted-foreground">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="rounded bg-muted px-1 border border-border text-[11px]">↑</kbd>
              <kbd className="rounded bg-muted px-1 border border-border text-[11px]">↓</kbd>
              Navegar
            </span>
            <span className="flex items-center gap-1">
              <kbd className="rounded bg-muted px-1 border border-border text-[11px]">↵</kbd>
              Executar
            </span>
          </div>
          <span className="text-[11px] text-primary font-medium flex items-center gap-1">
            <Sparkles className="size-3" />
            Atalho N para Novo Lead
          </span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
