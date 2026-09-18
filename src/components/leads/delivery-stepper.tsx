"use client";

import { Check, Rocket, Sparkles, FileText, Palette, Code2, Eye } from "lucide-react";
import { fireCelebrationConfetti } from "@/lib/confetti";
import type { EtapaEntrega } from "@/lib/types";
import { cn } from "@/lib/utils";

interface DeliveryStepperProps {
  currentStage?: EtapaEntrega | null;
  onStageChange?: (stage: EtapaEntrega) => void;
  readOnly?: boolean;
}

const STAGES: {
  id: EtapaEntrega;
  label: string;
  description: string;
  icon: typeof FileText;
}[] = [
  {
    id: "Briefing & Conteúdo",
    label: "Briefing",
    description: "Logo, fotos e textos",
    icon: FileText,
  },
  {
    id: "Design & Layout",
    label: "Design",
    description: "Layout e protótipo",
    icon: Palette,
  },
  {
    id: "Desenvolvimento",
    label: "Desenvolvimento",
    description: "Programação e páginas",
    icon: Code2,
  },
  {
    id: "Revisão com Cliente",
    label: "Revisão",
    description: "Testes e ajustes",
    icon: Eye,
  },
  {
    id: "Site no Ar",
    label: "Site no Ar",
    description: "Publicado com domínio e SSL",
    icon: Rocket,
  },
];

export function DeliveryStepper({
  currentStage = "Briefing & Conteúdo",
  onStageChange,
  readOnly = false,
}: DeliveryStepperProps) {
  const activeStage = currentStage || "Briefing & Conteúdo";
  const currentIndex = STAGES.findIndex((s) => s.id === activeStage);
  const safeIndex = currentIndex >= 0 ? currentIndex : 0;
  const progressPercent = ((safeIndex + 1) / STAGES.length) * 100;
  const isComplete = activeStage === "Site no Ar";

  const handleSelect = (stage: EtapaEntrega) => {
    if (readOnly || !onStageChange) return;
    if (stage === "Site no Ar" && activeStage !== "Site no Ar") {
      fireCelebrationConfetti();
    }
    onStageChange(stage);
  };

  return (
    <div className="rounded-2xl border border-border/70 bg-card/60 p-4 space-y-4">
      {/* Header do Stepper */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/25">
            <Sparkles className="size-3.5" />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-foreground">
              Funil de Produção do Site
            </h4>
            <p className="text-[11px] text-muted-foreground">
              Etapa {safeIndex + 1} de {STAGES.length}:{" "}
              <span className="font-semibold text-foreground">
                {STAGES[safeIndex]?.label}
              </span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <span
            className={cn(
              "font-mono text-xs font-bold px-2 py-0.5 rounded-full border",
              isComplete
                ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                : "bg-primary/10 text-primary border-primary/20",
            )}
          >
            {Math.round(progressPercent)}%
          </span>
        </div>
      </div>

      {/* Barra de Progresso */}
      <div className="relative w-full h-1.5 bg-muted rounded-full overflow-hidden">
        <div
          className={cn(
            "h-full transition-all duration-500 rounded-full",
            isComplete
              ? "bg-gradient-to-r from-emerald-500 to-teal-400"
              : "bg-gradient-to-r from-primary to-violet-500",
          )}
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Passos Clicáveis */}
      <div className="grid grid-cols-5 gap-1.5 pt-1">
        {STAGES.map((stage, idx) => {
          const Icon = stage.icon;
          const isDone = idx < safeIndex;
          const isCurrent = idx === safeIndex;

          return (
            <button
              key={stage.id}
              type="button"
              disabled={readOnly}
              onClick={() => handleSelect(stage.id)}
              className={cn(
                "group flex flex-col items-center text-center p-1.5 rounded-xl transition-all relative outline-none",
                !readOnly && "hover:bg-muted/60 cursor-pointer active:scale-95",
                isCurrent && "bg-primary/10 border border-primary/30 shadow-xs",
                readOnly && "cursor-default",
              )}
              title={`${stage.label} - ${stage.description}`}
            >
              <div
                className={cn(
                  "flex size-7 items-center justify-center rounded-full text-xs font-semibold mb-1 transition-all",
                  isDone && "bg-emerald-500 text-white shadow-xs",
                  isCurrent && "bg-primary text-primary-foreground ring-2 ring-primary/30",
                  !isDone && !isCurrent && "bg-muted text-muted-foreground group-hover:text-foreground",
                )}
              >
                {isDone ? <Check className="size-3.5 stroke-3" /> : <Icon className="size-3.5" />}
              </div>
              <span
                className={cn(
                  "text-[10px] font-medium leading-tight line-clamp-1",
                  isCurrent ? "text-foreground font-bold" : "text-muted-foreground",
                )}
              >
                {stage.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
