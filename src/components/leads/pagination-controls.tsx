"use client";

import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  pageSizeOptions?: number[];
  className?: string;
}

export function PaginationControls({
  currentPage,
  totalPages,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 25, 50, 100],
  className,
}: PaginationControlsProps) {
  const safeTotalPages = Math.max(1, totalPages);
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  // Gera a lista de páginas com elipses quando houver muitas páginas
  const getPageNumbers = () => {
    if (safeTotalPages <= 7) {
      return Array.from({ length: safeTotalPages }, (_, i) => i + 1);
    }

    const pages: (number | "ellipsis-left" | "ellipsis-right")[] = [1];

    if (currentPage > 3) {
      pages.push("ellipsis-left");
    }

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(safeTotalPages - 1, currentPage + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (currentPage < safeTotalPages - 2) {
      pages.push("ellipsis-right");
    }

    pages.push(safeTotalPages);
    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-3 border-t border-border/60 text-xs text-muted-foreground bg-card/20",
        className,
      )}
    >
      {/* Contagem de Itens e Seletor de Tamanho */}
      <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
        <span className="tabular-nums">
          Mostrando <strong className="font-semibold text-foreground">{startItem}–{endItem}</strong> de{" "}
          <strong className="font-semibold text-foreground">{totalItems}</strong> {totalItems === 1 ? "lead" : "leads"}
        </span>

        <div className="flex items-center gap-2">
          <span className="text-[11px] text-muted-foreground/80 hidden sm:inline">
            Linhas por página:
          </span>
          <Select
            value={String(pageSize)}
            onValueChange={(val) => {
              onPageSizeChange(Number(val));
              onPageChange(1);
            }}
          >
            <SelectTrigger className="h-7 w-16 text-xs font-mono bg-background/50 border-border/70">
              <SelectValue placeholder={String(pageSize)} />
            </SelectTrigger>
            <SelectContent align="end">
              {pageSizeOptions.map((opt) => (
                <SelectItem key={opt} value={String(opt)} className="text-xs font-mono">
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Controles de Navegação de Página */}
      <div className="flex items-center gap-1">
        {/* Primeira Página */}
        <Button
          variant="outline"
          size="icon"
          className="size-7 hidden sm:inline-flex border-border/70"
          onClick={() => onPageChange(1)}
          disabled={currentPage <= 1}
          title="Primeira página"
        >
          <ChevronsLeft className="size-3.5" />
        </Button>

        {/* Anterior */}
        <Button
          variant="outline"
          size="icon"
          className="size-7 border-border/70"
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage <= 1}
          title="Página anterior"
        >
          <ChevronLeft className="size-3.5" />
        </Button>

        {/* Pílulas de Página para Desktop */}
        <div className="hidden md:flex items-center gap-1">
          {pageNumbers.map((p, idx) => {
            if (p === "ellipsis-left" || p === "ellipsis-right") {
              return (
                <span
                  key={`ellipsis-${idx}`}
                  className="px-1.5 text-muted-foreground/50 select-none text-xs"
                >
                  …
                </span>
              );
            }

            const isCurrent = p === currentPage;
            return (
              <Button
                key={p}
                variant={isCurrent ? "default" : "ghost"}
                size="icon"
                className={cn(
                  "size-7 text-xs font-mono font-medium transition-colors",
                  isCurrent
                    ? "shadow-sm"
                    : "hover:bg-muted text-muted-foreground hover:text-foreground",
                )}
                onClick={() => onPageChange(p)}
              >
                {p}
              </Button>
            );
          })}
        </div>

        {/* Indicador Mobile */}
        <span className="md:hidden px-2 font-mono text-xs text-foreground">
          {currentPage} / {safeTotalPages}
        </span>

        {/* Próxima */}
        <Button
          variant="outline"
          size="icon"
          className="size-7 border-border/70"
          onClick={() => onPageChange(Math.min(safeTotalPages, currentPage + 1))}
          disabled={currentPage >= safeTotalPages}
          title="Próxima página"
        >
          <ChevronRight className="size-3.5" />
        </Button>

        {/* Última Página */}
        <Button
          variant="outline"
          size="icon"
          className="size-7 hidden sm:inline-flex border-border/70"
          onClick={() => onPageChange(safeTotalPages)}
          disabled={currentPage >= safeTotalPages}
          title="Última página"
        >
          <ChevronsRight className="size-3.5" />
        </Button>
      </div>
    </div>
  );
}
