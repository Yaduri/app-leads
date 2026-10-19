import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { SettingsForm } from "@/components/settings/settings-form";
import { getCurrentUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Configurações | CRM de Leads",
};

export default async function ConfiguracoesPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  const supabase = await createClient();
  const { count, error } = await supabase
    .from("leads")
    .select("*", { count: "exact", head: true });

  if (error) {
    console.error("Error loading leads count for settings page:", error);
  }

  const userName = user.user_metadata?.user_name || "CRM de Leads";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Configurações</h1>
        <p className="text-sm text-muted-foreground">
          Gerencie suas preferências de conta, backups e segurança de dados.
        </p>
      </div>

      <SettingsForm
        userId={user.id}
        userEmail={user.email ?? ""}
        initialUsername={userName}
        leadsCount={count ?? 0}
      />
    </div>
  );
}
