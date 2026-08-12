"use client";

import { useActionState } from "react";
import { Loader2, LogIn, Target, UserPlus } from "lucide-react";

import { loginAction, signupAction, type AuthState } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

function Field({
  id,
  label,
  type = "text",
  placeholder,
}: {
  id: string;
  label: string;
  type?: string;
  placeholder: string;
}) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} name={id} type={type} placeholder={placeholder} required />
    </div>
  );
}

function AlertMessage({ state }: { state: AuthState | undefined }) {
  if (!state?.error && !state?.notice) return null;
  return state?.error ? (
    <div className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
      {state.error}
    </div>
  ) : (
    <div className="rounded-md border border-emerald-500/30 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
      {state.notice}
    </div>
  );
}

export function LoginForm() {
  const [loginState, loginDispatch, loginPending] = useActionState(
    loginAction,
    undefined,
  );
  const [signupState, signupDispatch, signupPending] = useActionState(
    signupAction,
    undefined,
  );

  return (
    <Card>
      <CardHeader className="space-y-1 text-center">
        <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <Target className="size-6" />
        </div>
        <CardTitle className="text-xl">CRM de Leads</CardTitle>
        <CardDescription>
          Gestão de prospecção, vendas e WhatsApp em um só lugar.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="login">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Entrar</TabsTrigger>
            <TabsTrigger value="signup">Criar conta</TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="mt-4 space-y-4">
            <form action={loginDispatch} className="space-y-4">
              <AlertMessage state={loginState} />
              <Field
                id="email"
                label="E-mail"
                type="email"
                placeholder="voce@exemplo.com"
              />
              <Field
                id="password"
                label="Senha"
                type="password"
                placeholder="••••••••"
              />
              <Button className="w-full" type="submit" disabled={loginPending}>
                {loginPending ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <LogIn className="size-4" />
                )}
                Entrar
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="signup" className="mt-4 space-y-4">
            <form action={signupDispatch} className="space-y-4">
              <AlertMessage state={signupState} />
              <Field
                id="email"
                label="E-mail"
                type="email"
                placeholder="voce@exemplo.com"
              />
              <Field
                id="password"
                label="Senha"
                type="password"
                placeholder="Mínimo 6 caracteres"
              />
              <Button className="w-full" type="submit" disabled={signupPending}>
                {signupPending ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <UserPlus className="size-4" />
                )}
                Criar conta
              </Button>
              <p className="text-center text-xs text-muted-foreground">
                Você receberá um e-mail de confirmação (só ativações válidas).
              </p>
            </form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}