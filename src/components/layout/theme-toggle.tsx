"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const [isDark, setIsDark] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("theme");
    if (stored === "light") {
      setIsDark(false);
      document.documentElement.classList.remove("dark");
    } else {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setIsDark(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setIsDark(true);
    }
  };

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size={compact ? "icon" : "sm"}
        className={compact ? "size-8 text-muted-foreground" : "w-full justify-start gap-2 text-xs text-muted-foreground"}
      >
        <Moon className="size-4" />
        {!compact ? <span>Tema</span> : null}
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size={compact ? "icon" : "sm"}
      onClick={toggleTheme}
      className={
        compact
          ? "size-8 text-muted-foreground hover:text-foreground transition-colors"
          : "w-full justify-start gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
      }
      title={isDark ? "Mudar para modo claro" : "Mudar para modo escuro"}
    >
      {isDark ? (
        <>
          <Sun className="size-4 text-amber-400" />
          {!compact ? <span>Modo Claro</span> : null}
        </>
      ) : (
        <>
          <Moon className="size-4 text-sky-500" />
          {!compact ? <span>Modo Escuro</span> : null}
        </>
      )}
    </Button>
  );
}
