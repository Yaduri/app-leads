"use client";

import { SaleBadge } from "@/components/leads/status-badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SALE_STATUSES } from "@/lib/constants";
import type { SaleStatus } from "@/lib/types";

interface InlineSaleSelectProps {
  leadId: string;
  sale: SaleStatus;
  onSaleChange: (id: string, nextSale: SaleStatus) => void;
}

export function InlineSaleSelect({
  leadId,
  sale,
  onSaleChange,
}: InlineSaleSelectProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <button
            type="button"
            className="cursor-pointer outline-none hover:scale-105 active:scale-95 transition-transform"
            title="Clique para alterar status de venda rapidamente"
          />
        }
      >
        <SaleBadge sale={sale} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-36 p-1">
        {SALE_STATUSES.map((s) => (
          <DropdownMenuItem
            key={s}
            onClick={() => onSaleChange(leadId, s)}
            className="flex items-center gap-2 text-xs py-1.5 cursor-pointer font-medium"
          >
            <SaleBadge sale={s} />
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
