"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

export type AuthState = { error?: string; notice?: string };

function getErrorMessage(error: { code?: string; message?: string }): string {
  const message = error.message ?? "";
  if (error.code === "user_already_exists")
    return "Já existe uma conta com este e-mail.";
  if (/invalid login credentials/i.test(message))
    return "E-mail ou senha incorretos.";
  if (/email not confirmed/i.test(message))
    return "Confirme seu e-mail antes de entrar.";
  if (/password should be at least/i.test(message))
    return "A senha deve ter no mínimo 6 caracteres.";
  return "Não foi possível concluir. Tente novamente.";
}

export async function loginAction(
  _prev: AuthState | undefined,
  formData: FormData,
): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) return { error: "Informe e-mail e senha." };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: getErrorMessage(error) };

  redirect("/dashboard");
}

export async function signupAction(
  _prev: AuthState | undefined,
  formData: FormData,
): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) return { error: "Informe e-mail e senha." };
  if (password.length < 6)
    return { error: "A senha deve ter no mínimo 6 caracteres." };

  const supabase = await createClient();
  const headersList = await headers();
  const origin = headersList.get("origin") ?? "http://localhost:3000";

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { emailRedirectTo: `${origin}/auth/callback` },
  });
  if (error) return { error: getErrorMessage(error) };

  // Se a confirmacao de e-mail estiver desativada, ja retorna sessao
  if (data.session) redirect("/dashboard");

  return {
    notice:
      "Conta criada! Confirme o link enviado para o seu e-mail e depois faça login.",
  };
}

export async function logoutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}