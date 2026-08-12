import { Banknote, BellRing, Handshake, Users } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatCurrency } from "@/lib/format";

export interface Metrics {
  total: number;
  vendasTotal: number;
  negociacaoCount: number;
  followUpCount: number;
}

export function MetricCards({ metrics }: { metrics: Metrics }) {
  const cards = [
    {
      label: "Total de leads",
      value: String(metrics.total),
      description: "Cadastrados na sua conta",
      icon: Users,
    },
    {
      label: "Vendas realizadas",
      value: formatCurrency(metrics.vendasTotal),
      description: "Soma de valor_venda (venda = Sim)",
      icon: Banknote,
    },
    {
      label: "Em negociação",
      value: String(metrics.negociacaoCount),
      description: "Status Em Negociação",
      icon: Handshake,
    },
    {
      label: "Negociação pendente",
      value: String(metrics.followUpCount),
      description: "Venda realizada = Negociação",
      icon: BellRing,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Card key={card.label}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.label}
              </CardTitle>
              <Icon className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <CardDescription className="mt-1 text-xs">
                {card.description}
              </CardDescription>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}