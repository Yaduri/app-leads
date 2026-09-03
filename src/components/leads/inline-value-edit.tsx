"use client";

import { useState, useRef, useEffect } from "react";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";

interface InlineValueEditProps {
  leadId: string;
  value: number;
  onValueChange: (id: string, nextValue: number) => void;
}

export function InlineValueEdit({
  leadId,
  value,
  onValueChange,
}: InlineValueEditProps) {
  const [editing, setEditing] = useState(false);
  const [currentVal, setCurrentVal] = useState(String(value || 0));
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setCurrentVal(String(value || 0));
  }, [value]);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  const handleSave = () => {
    setEditing(false);
    const num = parseFloat(currentVal.replace(",", "."));
    const valid = isNaN(num) ? 0 : Math.max(0, Math.round(num * 100) / 100);
    if (valid !== value) {
      onValueChange(leadId, valid);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      setCurrentVal(String(value || 0));
      setEditing(false);
    }
  };

  if (editing) {
    return (
      <div className="flex items-center justify-end">
        <span className="text-xs text-muted-foreground mr-1">R$</span>
        <input
          ref={inputRef}
          type="number"
          step="0.01"
          value={currentVal}
          onChange={(e) => setCurrentVal(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          className="w-20 rounded border border-primary/50 bg-background px-1.5 py-0.5 text-right font-mono text-xs font-semibold outline-none focus:ring-1 focus:ring-primary"
        />
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setEditing(true)}
      className="group/val text-right font-mono text-sm font-semibold text-foreground hover:text-primary transition-colors cursor-pointer"
      title="Clique para editar valor"
    >
      <span className="underline decoration-muted-foreground/30 decoration-dashed underline-offset-4 group-hover/val:decoration-primary">
        {formatCurrency(value)}
      </span>
    </button>
  );
}
