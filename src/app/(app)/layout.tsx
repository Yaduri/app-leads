import { AppShell } from "@/components/layout/app-shell";
import { getCurrentUser } from "@/lib/auth";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  const userName = user?.user_metadata?.user_name || "CRM de Leads";

  return <AppShell userName={userName}>{children}</AppShell>;
}