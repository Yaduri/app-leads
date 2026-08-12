"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Download, AlertTriangle, ShieldCheck, Mail, User, Loader2 } from "lucide-react";
import { toast } from "sonner";
import Papa from "papaparse";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { deleteAllLeads, updateUsername } from "@/lib/actions/settings";
import type { Lead } from "@/lib/types";

export function SettingsForm({
  userEmail,
  initialUsername,
  leads,
}: {
  userEmail: string;
  initialUsername: string;
  leads: Lead[];
}) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);
  const [userName, setUserName] = useState(initialUsername);
  const [savingName, setSavingName] = useState(false);

  async function handleSaveName() {
    if (!userName.trim()) {
      toast.error("O nome de usuário não pode ficar em branco.");
      return;
    }
    setSavingName(true);
    try {
      const result = await updateUsername(userName);
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      toast.success("Nome do usuário atualizado!");
      router.refresh();
    } catch (err) {
      console.error(err);
      toast.error("Erro ao atualizar o nome.");
    } finally {
      setSavingName(false);
    }
  }

  function handleExport() {
    if (leads.length === 0) {
      toast.error("Você não tem nenhum lead para exportar.");
      return;
    }

    try {
      const csvData = leads.map((l) => ({
        Nicho: l.nicho ?? "",
        Nome: l.nome ?? "",
        "Link do Perfil": l.link_perfil || l.whatsapp || "",
        "Status de Prospecção": l.status_prospeccao ?? "",
        "Venda Realizada": l.venda_realizada ?? "",
        "Observações": l.observacoes ?? "",
        Data: l.data_contato ?? "",
        "Msg a mandar": l.msg_a_mandar ?? "",
        "Valor da Venda": l.valor_venda
          ? `R$ ${l.valor_venda.toFixed(2).replace(".", ",")}`
          : "R$ 0,00",
      }));

      const csv = Papa.unparse(csvData);
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `backup-leads-${new Date().toISOString().slice(0, 10)}.csv`);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success("Backup exportado com sucesso!");
    } catch (err) {
      console.error(err);
      toast.error("Erro ao exportar o backup de leads.");
    }
  }

  async function handleDeleteAll() {
    setDeleting(true);
    try {
      const result = await deleteAllLeads();
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      toast.success("Todos os leads foram deletados.");
      router.refresh();
    } catch (err) {
      console.error(err);
      toast.error("Ocorreu um erro ao tentar apagar os leads.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Informações do Usuário */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Informações da Conta</CardTitle>
          <CardDescription>
            Detalhes do usuário autenticado no sistema.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Mail className="size-5" />
            </div>
            <div>
              <div className="text-sm font-medium">E-mail de Acesso</div>
              <div className="text-sm text-muted-foreground">{userEmail}</div>
            </div>
          </div>

          <div className="border-t pt-4 space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="username" className="text-sm font-semibold flex items-center gap-1.5">
                <User className="size-4" />
                Nome do Usuário / Sistema
              </Label>
              <CardDescription>
                Este nome será exibido no menu lateral e na barra superior da aplicação.
              </CardDescription>
              <div className="flex flex-col sm:flex-row gap-2 max-w-md">
                <Input
                  id="username"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Ex: Yaduri"
                  className="flex-1"
                />
                <Button onClick={handleSaveName} disabled={savingName} className="shrink-0 gap-1.5">
                  {savingName ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : null}
                  Salvar
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Exportação de Backup */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Backup e Exportação</CardTitle>
          <CardDescription>
            Exporte uma cópia completa dos seus leads em formato de planilha (CSV).
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            O arquivo gerado é 100% compatível com o nosso importador de planilhas. Você pode usar este backup para transferir seus leads ou restaurar dados posteriormente.
          </p>
          <Button onClick={handleExport} className="w-full sm:w-auto gap-2">
            <Download className="size-4" />
            Exportar {leads.length} Leads para CSV
          </Button>
        </CardContent>
      </Card>

      {/* Zona de Perigo */}
      <Card className="border-destructive/30 bg-destructive/5 dark:bg-destructive/10">
        <CardHeader>
          <CardTitle className="text-base text-destructive flex items-center gap-2">
            <AlertTriangle className="size-5" />
            Zona de Perigo
          </CardTitle>
          <CardDescription className="text-destructive/80">
            Ações irreversíveis e críticas para a sua conta.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="text-sm font-semibold text-destructive">Apagar todos os leads</h4>
            <p className="text-sm text-muted-foreground mt-1">
              Esta ação excluirá permanentemente todos os leads cadastrados na sua conta, incluindo observações, dados de contato e valores de venda. Esta ação é irreversível.
            </p>
          </div>

          <AlertDialog>
            <AlertDialogTrigger render={
              <Button variant="destructive" className="w-full sm:w-auto gap-2">
                <Trash2 className="size-4" />
                Apagar todos os leads
              </Button>
            } />
            <AlertDialogContent>
              <AlertDialogHeader>
                <div className="mx-auto sm:mx-0 flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive mb-2">
                  <AlertTriangle className="size-6" />
                </div>
                <AlertDialogTitle>Você tem certeza absoluta?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta ação excluirá permanentemente todos os <strong>{leads.length} leads</strong> cadastrados. Você não poderá recuperar estes dados depois de confirmar.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteAll}
                  disabled={deleting}
                  className="bg-destructive hover:bg-destructive/90 text-destructive-foreground focus-visible:ring-destructive/20"
                >
                  {deleting ? "Excluindo..." : "Sim, apagar leads permanentemente"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </div>
  );
}
