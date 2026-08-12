import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { ImportCsvForm } from "@/components/importar/import-csv-form";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Importar CSV | CRM de Leads",
};

export default async function ImportarPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Importar CSV</h1>
        <p className="text-sm text-muted-foreground">
          Envie o arquivo exportado da sua planilha para preencher leads em
          lote. O arquivo base fica em{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs">
            sample-data/Leads.csv
          </code>
          .
        </p>
      </div>
      <ImportCsvForm />
    </div>
  );
}