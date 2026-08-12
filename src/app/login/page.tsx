import type { Metadata } from "next";

import { LoginForm } from "@/components/auth/login-form";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Entrar | CRM de Leads",
};

export default function LoginPage() {
  return (
    <main className="flex flex-1 items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-md">
        <LoginForm />
      </div>
    </main>
  );
}