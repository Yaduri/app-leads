import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Award, PieChart } from "lucide-react";

export interface NichoCount {
  nicho: string;
  count: number;
}

const RANK_BADGES: Record<number, string> = {
  0: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  1: "bg-slate-400/20 text-slate-300 border-slate-400/30",
  2: "bg-amber-700/20 text-amber-400 border-amber-700/30",
};

export function NichoDistribution({
  counts,
}: {
  counts: NichoCount[];
}) {
  const total = counts.reduce((acc, c) => acc + c.count, 0);

  if (total === 0) {
    return (
      <Card className="border-border/70 bg-card/60 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <PieChart className="size-4 text-primary" />
            Distribuição por Nicho
          </CardTitle>
          <CardDescription>
            Nenhum lead cadastrado ainda para gerar o gráfico.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  // Ordenar por maior volume
  const sorted = [...counts].sort((a, b) => b.count - a.count);

  return (
    <Card className="border-border/70 bg-card/60 backdrop-blur-xl shadow-md">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <PieChart className="size-4 text-primary" />
              Segmentos & Nichos de Mercado
            </CardTitle>
            <CardDescription className="text-xs mt-1">
              Participação de cada nicho na sua carteira de leads
            </CardDescription>
          </div>
          <span className="text-xs font-mono text-muted-foreground bg-muted/60 px-2 py-0.5 rounded-md">
            {sorted.length} nichos
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {sorted.map((c, index) => {
          const pct = Math.round((c.count / total) * 100);
          const badgeClass = RANK_BADGES[index];

          return (
            <div key={c.nicho} className="space-y-1.5 group">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  {index < 3 ? (
                    <span
                      className={cn(
                        "size-5 rounded-full flex items-center justify-center text-[10px] font-bold border",
                        badgeClass,
                      )}
                    >
                      {index + 1}
                    </span>
                  ) : (
                    <span className="size-5 rounded-full flex items-center justify-center text-[10px] text-muted-foreground font-medium">
                      {index + 1}
                    </span>
                  )}
                  <span className="font-medium text-foreground group-hover:text-primary transition-colors">
                    {c.nicho}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-muted-foreground">
                    {c.count} leads
                  </span>
                  <span className="font-mono text-xs font-semibold text-foreground">
                    ({pct}%)
                  </span>
                </div>
              </div>
              <div className="h-2 rounded-full bg-muted/70 overflow-hidden">
                <div
                  className="h-2 rounded-full bg-gradient-to-r from-primary to-emerald-400 transition-all duration-500"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}