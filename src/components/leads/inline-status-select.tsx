"use client";

import { useState } from "react";
import { StatusBadge } from "@/components/leads/status-badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LEAD_STATUSES } from "@/lib/constants";
import type { LeadStatus } from "@/lib/types";

interface InlineStatusSelectProps {
  leadId: string;
  status: LeadStatus;
  onStatusChange: (id: string, nextStatus: LeadStatus) => void;
}

export function InlineStatusSelect({
  leadId,
  status,
  onStatusChange,
}: InlineStatusSelectProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <button
            type="button"
            className="cursor-pointer outline-none hover:scale-105 active:scale-95 transition-transform"
            title="Clique para alterar status rapidamente"
          />
        }
      >
        <StatusBadge status={status} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-44 p-1">
        {LEAD_STATUSES.map((st) => (
          <DropdownMenuItem
            key={st}
            onClick={() => onStatusChange(leadId, st)}
            className="flex items-center gap-2 text-xs py-1.5 cursor-pointer font-medium"
          >
            <StatusBadge status={st} />
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
