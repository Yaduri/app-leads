import {
  Sparkles,
  Clock,
  Flame,
  CheckCircle2,
  XCircle,
  CircleDashed,
  Handshake,
  BadgeCheck,
  Ban,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  LEAD_STATUS_CLASSES,
  SALE_STATUS_CLASSES,
} from "@/lib/constants";
import type { LeadStatus, SaleStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

const STATUS_ICON: Record<LeadStatus, React.ComponentType<{ className?: string }>> = {
  "Novo Lead": Sparkles,
  "Em Andamento": Clock,
  "Em Negociação": Flame,
  Concluído: CheckCircle2,
  "Sem interesse": XCircle,
};

const SALE_ICON: Record<SaleStatus, React.ComponentType<{ className?: string }>> = {
  "Em aberto": CircleDashed,
  Negociação: Handshake,
  Sim: BadgeCheck,
  Não: Ban,
};

export function StatusBadge({ status }: { status: LeadStatus }) {
  const Icon = STATUS_ICON[status] || Clock;
  return (
    <Badge
      variant="outline"
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-medium rounded-full border transition-all select-none",
        LEAD_STATUS_CLASSES[status],
      )}
    >
      <Icon className="size-3 shrink-0" />
      {status}
    </Badge>
  );
}

export function SaleBadge({ sale }: { sale: SaleStatus }) {
  const Icon = SALE_ICON[sale] || CircleDashed;
  return (
    <Badge
      variant="outline"
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-medium rounded-full border transition-all select-none",
        SALE_STATUS_CLASSES[sale],
      )}
    >
      <Icon className="size-3 shrink-0" />
      {sale}
    </Badge>
  );
}