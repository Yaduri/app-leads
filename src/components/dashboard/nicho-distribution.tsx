import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface NichoCount {
  nicho: string;
  count: number;
}

export function NichoDistribution({
  counts,
}: {
  counts: NichoCount[];
}) {
  const total = counts.reduce((acc, c) => acc + c.count, 0);

  if (total === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Distribuição por nicho</CardTitle>
          <CardDescription>
            Nenhum lead cadastrado ainda.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Distribuição por nicho</CardTitle>
        <CardDescription>
          Participação de cada nicho na sua base
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {counts.map((c) => {
          const pct = Math.round((c.count / total) * 100);
          return (
            <div key={c.nicho} className="space-y-1.5">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{c.nicho}</span>
                <span className="text-muted-foreground">
                  {c.count} ({pct}%)
                </span>
              </div>
              <div className="h-2 rounded-full bg-muted">
                <div
                  className={cn("h-2 rounded-full bg-primary")}
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