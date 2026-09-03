import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { LeadsPage } from "@/components/leads/leads-page";
import { getCurrentUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import type { Lead } from "@/lib/types";

export const metadata: Metadata = {
  title: "Leads | CRM de Leads",
};

export default async function LeadsRoute() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const supabase = await createClient();
  const { data } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });

  return <LeadsPage leads={(data as Lead[]) ?? []} />;
}