import { Badge } from "@/components/ui/badge";
import {
  LEAD_STATUS_CLASSES,
  SALE_STATUS_CLASSES,
} from "@/lib/constants";
import type { LeadStatus, SaleStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

const STATUS_DOT: Record<LeadStatus, string> = {
  "Novo Lead": "bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.6)]",
  "Em Andamento": "bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6)]",
  "Em Negociação": "bg-violet-400 shadow-[0_0_8px_rgba(167,139,250,0.6)]",
  Concluído: "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]",
  "Sem interesse": "bg-rose-400 shadow-[0_0_8px_rgba(244,63,94,0.6)]",
};

export function StatusBadge({ status }: { status: LeadStatus }) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-medium rounded-full border transition-all select-none",
        LEAD_STATUS_CLASSES[status],
      )}
    >
      <span className={cn("size-1.5 rounded-full shrink-0", STATUS_DOT[status])} />
      {status}
    </Badge>
  );
}

export function SaleBadge({ sale }: { sale: SaleStatus }) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "px-2.5 py-0.5 text-xs font-medium rounded-full border transition-all select-none",
        SALE_STATUS_CLASSES[sale],
      )}
    >
      {sale}
    </Badge>
  );
}