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
  { href: "/configuracoes", label: "Configurações", icon: Settings },
];

function Logo() {
  return (
    <div className="flex items-center gap-2">
      <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <Target className="size-4" />
      </div>
      <span className="text-sm font-semibold">CRM de Leads</span>
    </div>
  );
}

function LogoutButton() {
  return (
    <form action={logoutAction}>
      <Button
        variant="ghost"
        className="w-full justify-start gap-2 text-muted-foreground"
        type="submit"
      >
        <LogOut className="size-4" />
        Sair
      </Button>
    </form>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-dvh flex-col md:flex-row">
      {/* Sidebar (desktop) */}
      <aside className="hidden w-60 shrink-0 flex-col gap-2 border-r bg-muted/20 p-4 md:flex">
        <Logo />
        <nav className="mt-4 flex flex-1 flex-col gap-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active =
              pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <Icon className="size-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t pt-2">
          <LogoutButton />
        </div>
      </aside>

      {/* Barra superior (mobile) */}
      <header className="flex items-center justify-between gap-2 border-b p-4 md:hidden">
        <Logo />
        <LogoutButton />
      </header>
      <nav className="flex items-center gap-1 overflow-x-auto px-4 pb-1 md:hidden">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex shrink-0 items-center gap-2 rounded-md px-3 py-2 text-sm font-medium",
                active
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground",
              )}
            >
              <Icon className="size-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <main className="min-w-0 flex-1 p-4 md:p-8">{children}</main>
    </div>
  );
}