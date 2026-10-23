"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ListChecks,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
  Target,
  Upload,
  Search,
} from "lucide-react";

import { logoutAction } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { CommandMenu } from "@/components/layout/command-menu";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/leads", label: "Leads", icon: ListChecks },
  { href: "/importar", label: "Importar CSV", icon: Upload },
  { href: "/configuracoes", label: "Configurações", icon: Settings },
];

function Logo({ name, collapsed = false }: { name: string; collapsed?: boolean }) {
  return (
    <div className={cn("flex items-center gap-3", collapsed && "justify-center")}>
      <div className="relative flex size-9 items-center justify-center rounded-xl bg-gradient-to-tr from-primary/80 to-primary text-primary-foreground shadow-lg shadow-primary/20 shrink-0">
        <Target className="size-5" />
        <span className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full bg-emerald-500 ring-2 ring-background" />
      </div>
      {!collapsed && (
        <div className="flex flex-col min-w-0">
          <span className="text-sm font-bold tracking-tight text-foreground truncate max-w-[130px]" title={name}>
            {name}
          </span>
          <span className="text-[11px] font-medium text-emerald-400">
            Online · Pro
          </span>
        </div>
      )}
    </div>
  );
}

function LogoutButton({ compact = false }: { compact?: boolean }) {
  return (
    <form action={logoutAction}>
      <Button
        variant="ghost"
        size={compact ? "icon" : "default"}
        className={cn(
          "text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors",
          !compact && "w-full justify-start gap-2 text-xs",
          compact && "size-9 mx-auto",
        )}
        type="submit"
        title="Encerrar sessão"
      >
        <LogOut className="size-4" />
        {!compact ? <span>Sair da conta</span> : null}
      </Button>
    </form>
  );
}

export function AppShell({
  children,
  userName = "CRM de Leads",
}: {
  children: React.ReactNode;
  userName?: string;
}) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("sidebar_collapsed");
    if (stored === "true") {
      setCollapsed(true);
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+K / Cmd+K
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCommandOpen((prev) => !prev);
        return;
      }

      // 'N' to open new lead (only when not typing in an input)
      const target = e.target as HTMLElement | null;
      const isInput =
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT" ||
          target.isContentEditable);

      if (!isInput && (e.key === "n" || e.key === "N") && !e.metaKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
        if (window.location.pathname === "/leads") {
          window.dispatchEvent(new CustomEvent("crm:new-lead"));
        } else {
          window.location.href = "/leads?new=1";
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const toggleCollapsed = () => {
    setCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem("sidebar_collapsed", String(next));
      return next;
    });
  };

  return (
    <div className="flex min-h-dvh w-full max-w-[100vw] overflow-x-clip flex-col md:flex-row bg-background text-foreground">
      {/* Sidebar (Desktop) */}
      <aside
        className={cn(
          "hidden shrink-0 flex-col justify-between border-r border-border/70 bg-card/40 backdrop-blur-xl transition-[width,padding] duration-200 ease-in-out md:flex",
          collapsed ? "w-[72px] p-3" : "w-64 p-5",
        )}
      >
        <div className="flex flex-col gap-5">
          {/* Topo do menu: Logo + Botão Minimizar/Expandir */}
          <div className={cn("flex items-center", collapsed ? "flex-col gap-3 justify-center" : "justify-between")}>
            <Logo name={userName} collapsed={collapsed} />
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleCollapsed}
              className="size-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors shrink-0"
              title={collapsed ? "Expandir menu lateral" : "Minimizar menu lateral"}
            >
              {collapsed ? (
                <PanelLeftOpen className="size-4 text-primary" />
              ) : (
                <PanelLeftClose className="size-4" />
              )}
              <span className="sr-only">
                {collapsed ? "Expandir menu" : "Minimizar menu"}
              </span>
            </Button>
          </div>

          {/* Botão de Busca Rápida (Ctrl+K) */}
          <button
            type="button"
            onClick={() => setCommandOpen(true)}
            className={cn(
              "flex items-center gap-2 rounded-xl border border-border/70 bg-card/60 px-3 py-2 text-xs text-muted-foreground transition-all hover:border-primary/50 hover:bg-muted/50 hover:text-foreground shadow-sm cursor-pointer",
              collapsed ? "justify-center px-0 size-10 mx-auto" : "w-full justify-between",
            )}
            title="Busca e Comandos (Ctrl+K)"
          >
            <div className="flex items-center gap-2">
              <Search className="size-3.5 text-primary shrink-0" />
              {!collapsed && <span>Buscar ou Ação...</span>}
            </div>
            {!collapsed && (
              <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[11px] text-muted-foreground">
                Ctrl+K
              </kbd>
            )}
          </button>

          <nav className="flex flex-col gap-1.5">
            {!collapsed && (
              <span className="px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
                Navegação
              </span>
            )}
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const active =
                pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={collapsed ? item.label : undefined}
                  className={cn(
                    "flex items-center rounded-xl py-2.5 text-sm font-medium transition-all duration-150",
                    collapsed ? "justify-center px-0 size-11 mx-auto" : "gap-3 px-3.5",
                    active
                      ? "bg-primary/15 text-primary border border-primary/20 shadow-sm shadow-primary/10 font-semibold"
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
                  )}
                >
                  <Icon className={cn("size-4 shrink-0", active ? "text-primary" : "text-muted-foreground")} />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className={cn("border-t border-border/60 pt-3 flex flex-col gap-1.5", collapsed && "items-center")}>
          <ThemeToggle compact={collapsed} />
          <LogoutButton compact={collapsed} />
        </div>
      </aside>

      {/* Header Superior (Mobile) */}
      <header className="sticky top-0 z-40 flex w-full max-w-full items-center justify-between border-b border-border/70 bg-background/85 backdrop-blur-lg px-3.5 py-2.5 sm:px-4 sm:py-3 md:hidden">
        <Logo name={userName} />
        <div className="flex items-center gap-0.5 sm:gap-1 shrink-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCommandOpen(true)}
            className="size-9 text-muted-foreground hover:text-foreground touch-manipulation"
            title="Busca e Comandos (Ctrl+K)"
          >
            <Search className="size-4" />
          </Button>
          <ThemeToggle compact />
          <LogoutButton compact />
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="min-w-0 w-full max-w-full flex-1 px-3.5 py-4 pb-28 sm:px-6 sm:py-6 md:p-8 md:pb-8 transition-all overflow-x-hidden">
        {children}
      </main>

      {/* Modal de Comandos / Busca Rápida Global */}
      <CommandMenu open={commandOpen} onOpenChange={setCommandOpen} />

      {/* Floating Bottom Navigation Bar (Mobile) */}
      <nav className="fixed bottom-0 inset-x-0 z-50 flex w-full max-w-[100vw] items-center justify-around border-t border-border/80 bg-card/95 backdrop-blur-xl px-1.5 pt-1.5 pb-[max(0.375rem,env(safe-area-inset-bottom))] md:hidden shadow-lg shadow-black/20">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active =
            pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-1 min-w-0 flex-col items-center justify-center gap-1 rounded-xl py-1 px-1 min-h-[44px] transition-all touch-manipulation active:scale-95",
                active
                  ? "text-primary font-semibold"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <div
                className={cn(
                  "flex size-7 items-center justify-center rounded-lg transition-colors",
                  active && "bg-primary/15",
                )}
              >
                <Icon className="size-4" />
              </div>
              <span className="text-[11px] tracking-tight leading-none truncate max-w-full">
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}