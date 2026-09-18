"use client";

import { ExternalLink, Gauge, Globe, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { PresencaDigital } from "@/lib/types";
import { cn } from "@/lib/utils";

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

interface DigitalPresenceBadgeProps {
  presence?: PresencaDigital | null;
  siteUrl?: string | null;
  onPresenceChange?: (presence: PresencaDigital) => void;
  compact?: boolean;
}

const PRESENCE_CONFIG: Record<
  PresencaDigital,
  { label: string; bg: string; text: string; border: string; icon: React.ComponentType<{ className?: string }> }
> = {
  "Sem Site": {
    label: "Sem Site",
    bg: "bg-rose-500/10",
    text: "text-rose-400",
    border: "border-rose-500/25",
    icon: AlertTriangle,
  },
  "Site Lento/Antigo": {
    label: "Site Lento",
    bg: "bg-amber-500/10",
    text: "text-amber-400",
    border: "border-amber-500/25",
    icon: Gauge,
  },
  "Apenas Instagram": {
    label: "Só Instagram",
    bg: "bg-violet-500/10",
    text: "text-violet-400",
    border: "border-violet-500/25",
    icon: InstagramIcon,
  },
  "Site Moderno": {
    label: "Site Ativo",
    bg: "bg-emerald-500/10",
    text: "text-emerald-400",
    border: "border-emerald-500/25",
    icon: CheckCircle2,
  },
};

export function DigitalPresenceBadge({
  presence = "Sem Site",
  siteUrl,
  onPresenceChange,
  compact = false,
}: DigitalPresenceBadgeProps) {
  const current = presence || "Sem Site";
  const config = PRESENCE_CONFIG[current] || PRESENCE_CONFIG["Sem Site"];
  const Icon = config.icon;

  const formattedUrl = siteUrl
    ? siteUrl.startsWith("http://") || siteUrl.startsWith("https://")
      ? siteUrl
      : `https://${siteUrl}`
    : null;

  const pageSpeedUrl = formattedUrl
    ? `https://pagespeed.web.dev/analysis?url=${encodeURIComponent(formattedUrl)}`
    : null;

  const badgeContent = (
    <Badge
      variant="outline"
      className={cn(
        "inline-flex items-center gap-1 font-medium select-none transition-all cursor-pointer",
        config.bg,
        config.text,
        config.border,
        compact ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-xs",
      )}
    >
      <Icon className={compact ? "size-2.5" : "size-3"} />
      <span>{config.label}</span>
    </Badge>
  );

  return (
    <div className="inline-flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
      {onPresenceChange ? (
        <DropdownMenu>
          <DropdownMenuTrigger render={<button type="button" className="outline-none focus:ring-1 focus:ring-primary/40 rounded-full" />}>
            {badgeContent}
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48 p-1">
            {(Object.keys(PRESENCE_CONFIG) as PresencaDigital[]).map((key) => {
              const item = PRESENCE_CONFIG[key];
              const ItemIcon = item.icon;
              return (
                <DropdownMenuItem
                  key={key}
                  onClick={() => onPresenceChange(key)}
                  className="flex items-center gap-2 text-xs cursor-pointer py-1.5"
                >
                  <ItemIcon className={cn("size-3.5", item.text)} />
                  <span className={cn(key === current && "font-bold text-foreground")}>
                    {key}
                  </span>
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        badgeContent
      )}

      {/* Botões de Ação do Site (Diagnóstico PageSpeed & Abrir Site) */}
      {formattedUrl && (
        <div className="inline-flex items-center gap-1">
          {pageSpeedUrl && (
            <a
              href={pageSpeedUrl}
              target="_blank"
              rel="noopener noreferrer"
              title="Testar velocidade no Google PageSpeed Insights"
              className="inline-flex size-6 items-center justify-center rounded-md bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 hover:text-amber-300 transition-colors border border-amber-500/20"
            >
              <Gauge className="size-3" />
            </a>
          )}
          <a
            href={formattedUrl}
            target="_blank"
            rel="noopener noreferrer"
            title={`Abrir site (${formattedUrl})`}
            className="inline-flex size-6 items-center justify-center rounded-md bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors border border-border/70"
          >
            <ExternalLink className="size-3" />
          </a>
        </div>
      )}
    </div>
  );
}
