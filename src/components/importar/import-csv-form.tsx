"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Link2, Loader2, UploadCloud } from "lucide-react";
import { toast } from "sonner";

import { importLeads } from "@/lib/actions/leads";
import { parseLeadsCsv, type CsvParseResult } from "@/lib/csv/parse-leads-csv";
import type { ParsedLeadRow } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function ImportCsvForm() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const [fileName, setFileName] = useState<string | null>(null);
  const [parseResult, setParseResult] = useState<CsvParseResult | null>(null);
  const [importing, setImporting] = useState(false);
  const [dragging, setDragging] = useState(false);

  async function handleFile(file: File) {
    if (!/\.csv$/i.test(file.name) && file.type !== "text/csv") {
      toast.error("Selecione um arquivo .csv");
      return;
    }
    const text = await file.text();
    const result = parseLeadsCsv(text);
    setFileName(file.name);
    setParseResult(result);
    result.errors.forEach((msg) => toast.warning(msg));
    if (result.errors.length === 0) {
      toast.success(
        `Parsing OK: ${result.validCount} leads, ${result.skippedCount} linhas ignoradas`,
      );
    }
  }

  async function handleImport() {
    if (!parseResult || parseResult.rows.length === 0) return;

    setImporting(true);
    try {
      const result = await importLeads(parseResult.rows);
      if (result.error) {
        toast.error(result.error);
        return;
      }
      toast.success(
        `Importação concluída: ${result.inserted} inseridos, ${result.failed} falhas`,
      );
      router.refresh();
      setFileName(null);
      setParseResult(null);
      if (inputRef.current) inputRef.current.value = "";
    } finally {
      setImporting(false);
    }
  }

  const preview = parseResult?.rows.slice(0, 8) ?? [];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Seu arquivo CSV</CardTitle>
          <CardDescription>
            Arraste o arquivo aqui ou clique para escolher. Cabeçalhos
            esperados: Nicho, Nome, Link do Perfil, Status de Prospecção,
            Venda Realizada, Observações, Data, Msg a mandar, Valor da Venda.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <label
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragging(false);
              const file = e.dataTransfer.files?.[0];
              if (file) void handleFile(file);
            }}
            className={cn(
              "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-10 text-center transition-colors",
              dragging
                ? "border-primary bg-primary/5"
                : "border-muted-foreground/30 hover:border-primary/50",
            )}
          >
            <UploadCloud className="size-10 text-muted-foreground" />
            <p className="text-sm font-medium">
              {fileName ?? "Arraste o arquivo aqui ou clique para selecionar"}
            </p>
            <p className="text-xs text-muted-foreground">Arquivo .csv</p>
            <input
              ref={inputRef}
              type="file"
              accept=".csv,text/csv"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) void handleFile(file);
              }}
            />
          </label>

          {parseResult && (
            <div className="flex flex-wrap items-center gap-2 rounded-lg border bg-muted/50 p-3 text-sm">
              <span className="font-medium">{fileName}</span>
              <span className="text-muted-foreground">·</span>
              <span>{parseResult.validCount} leads identificados</span>
              <span className="text-muted-foreground">·</span>
              <span>{parseResult.skippedCount} linhas ignoradas</span>
            </div>
          )}

          {parseResult && (
            <Button
              onClick={handleImport}
              disabled={importing}
              className="w-full sm:w-auto"
            >
              {importing ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <UploadCloud className="size-4" />
              )}
              Importar {parseResult.validCount} leads para minha conta
            </Button>
          )}
        </CardContent>
      </Card>

      {parseResult && preview.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Pré-visualização</CardTitle>
            <CardDescription>
              Primeiras {preview.length} linhas já normalizadas (telefone
              limpo, valor convertido, status mapeados).
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Nicho</TableHead>
                    <TableHead>WhatsApp</TableHead>
                    <TableHead className="w-10" />
                    <TableHead>Status</TableHead>
                    <TableHead>Venda</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Data</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {preview.map((row: ParsedLeadRow, i) => (
                    <TableRow key={i}>
                      <TableCell className="max-w-[220px]">
                        <span className="line-clamp-1 font-medium">
                          {row.nome}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {row.nicho ?? "—"}
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-sm">
                        {row.whatsapp
                          ? `(${row.whatsapp.slice(0, 2)}) ${row.whatsapp.slice(2)}`
                          : "—"}
                      </TableCell>
                      <TableCell>
                        {row.link_perfil ? (
                          <Link2 className="size-3.5 text-muted-foreground" />
                        ) : null}
                      </TableCell>
                      <TableCell className="text-sm">
                        {row.status_prospeccao}
                      </TableCell>
                      <TableCell className="text-sm">
                        {row.venda_realizada}
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-sm font-medium">
                        {formatValue(row.valor_venda)}
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                        {row.data_contato ?? "—"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function formatValue(value: number) {
  return `R$ ${value.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
  })}`;
}