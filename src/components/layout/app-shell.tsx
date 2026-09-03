"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ListChecks,
  LogOut,
  Settings,
  Target,
  Upload,
} from "lucide-react";

import { logoutAction } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/leads", label: "Leads", icon: ListChecks },
  { href: "/importar", label: "Importar CSV", icon: Upload },
  { href: "/configuracoes", label: "Ajustes", icon: Settings },
];

function Logo({ name }: { name: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="relative flex size-9 items-center justify-center rounded-xl bg-gradient-to-tr from-primary/80 to-primary text-primary-foreground shadow-lg shadow-primary/20">
        <Target className="size-5" />
        <span className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full bg-emerald-500 ring-2 ring-background" />
      </div>
      <div className="flex flex-col min-w-0">
        <span className="text-sm font-bold tracking-tight text-foreground truncate max-w-[150px]" title={name}>
          {name}
        </span>
        <span className="text-[11px] font-medium text-emerald-400">
          Online · Pro
        </span>
      </div>
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
          compact && "size-8",
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

  return (
    <div className="flex min-h-dvh flex-col md:flex-row bg-background text-foreground">
      {/* Sidebar (Desktop) */}
      <aside className="hidden w-64 shrink-0 flex-col justify-between border-r border-border/70 bg-card/40 backdrop-blur-xl p-5 md:flex">
        <div className="flex flex-col gap-6">
          <Logo name={userName} />

          <nav className="flex flex-col gap-1.5">
            <span className="px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
              Navegação
            </span>
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const active =
                pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-150",
                    active
                      ? "bg-primary/15 text-primary border border-primary/20 shadow-sm shadow-primary/10 font-semibold"
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
                  )}
                >
                  <Icon className={cn("size-4", active ? "text-primary" : "text-muted-foreground")} />
                  <span>{item.label === "Ajustes" ? "Configurações" : item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="border-t border-border/60 pt-3">
          <LogoutButton />
        </div>
      </aside>

      {/* Header Superior (Mobile) */}
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-border/70 bg-background/80 backdrop-blur-lg px-4 py-3 md:hidden">
        <Logo name={userName} />
        <LogoutButton compact />
      </header>

      {/* Conteúdo Principal */}
      <main className="min-w-0 flex-1 p-4 pb-28 md:p-8 md:pb-8">{children}</main>

      {/* Floating Bottom Navigation Bar (Mobile) */}
      <nav className="fixed bottom-0 inset-x-0 z-50 flex items-center justify-around border-t border-border/80 bg-card/90 backdrop-blur-xl px-2 py-2 md:hidden shadow-lg shadow-black/20">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active =
            pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 rounded-xl py-1 px-3 min-w-[64px] transition-all",
                active
                  ? "text-primary font-semibold scale-105"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <div
                className={cn(
                  "flex size-8 items-center justify-center rounded-lg transition-colors",
                  active && "bg-primary/15",
                )}
              >
                <Icon className="size-4" />
              </div>
              <span className="text-[10px] tracking-tight">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}