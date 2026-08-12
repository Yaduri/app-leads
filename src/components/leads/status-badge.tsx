import { Badge } from "@/components/ui/badge";
import {
  LEAD_STATUS_CLASSES,
  SALE_STATUS_CLASSES,
} from "@/lib/constants";
import type { LeadStatus, SaleStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

export function StatusBadge({ status }: { status: LeadStatus }) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "border-transparent font-medium",
        LEAD_STATUS_CLASSES[status],
      )}
    >
      {status}
    </Badge>
  );
}

export function SaleBadge({ sale }: { sale: SaleStatus }) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "border-transparent font-medium",
        SALE_STATUS_CLASSES[sale],
      )}
    >
      {sale}
    </Badge>
  );
}