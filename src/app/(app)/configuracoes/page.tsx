import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { SettingsForm } from "@/components/settings/settings-form";
import { createClient } from "@/lib/supabase/server";
import type { Lead } from "@/lib/types";

export const metadata: Metadata = {
  title: "Configurações | CRM de Leads",
};

export default async function ConfiguraacoesPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Buscar todos os leads para passar ao exportador e exibir a quantidade
  const { data: leads, error } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error loading leads for settings page:", error);
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
        userEmail={user.email ?? ""}
        initialUsername={userName}
        leads={(leads as Lead[]) ?? []}
      />
    </div>
  );
}
