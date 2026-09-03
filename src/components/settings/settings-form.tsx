"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Download, AlertTriangle, ShieldCheck, Mail, User, Loader2, Copy, Check, Zap, Code2 } from "lucide-react";
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
  userId,
  userEmail,
  initialUsername,
  leads,
}: {
  userId?: string;
  userEmail: string;
  initialUsername: string;
  leads: Lead[];
}) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);
  const [userName, setUserName] = useState(initialUsername);
  const [savingName, setSavingName] = useState(false);

  const [copiedEndpoint, setCopiedEndpoint] = useState(false);
  const [showCode, setShowCode] = useState(false);

  const endpointUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/api/leads${userId ? `?user_id=${userId}` : ""}`
      : `https://seu-crm.vercel.app/api/leads${userId ? `?user_id=${userId}` : ""}`;

  const handleCopyEndpoint = () => {
    navigator.clipboard.writeText(endpointUrl);
    setCopiedEndpoint(true);
    toast.success("URL da API copiada para a área de transferência!");
    setTimeout(() => setCopiedEndpoint(false), 2000);
  };

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

      {/* Integração de Leads (API / Webhook) */}
      <Card className="border-primary/30 bg-card/60 backdrop-blur-xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Zap className="size-4 text-primary" />
              Integração Externa (API / Webhook)
            </CardTitle>
            <span className="text-xs bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-medium">
              Pronto para Conectar
            </span>
          </div>
          <CardDescription>
            Conecte o seu captador de leads (LeadHunter Pro, bots ou formulários externos) para sincronizar leads diretamente aqui.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">URL do Endpoint de Sincronização (POST)</Label>
            <div className="flex gap-2">
              <Input
                readOnly
                value={endpointUrl}
                className="font-mono text-xs bg-muted/40 text-foreground flex-1"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyEndpoint}
                className="shrink-0 gap-1.5 text-xs h-9"
              >
                {copiedEndpoint ? (
                  <>
                    <Check className="size-3.5 text-emerald-400" />
                    Copiado!
                  </>
                ) : (
                  <>
                    <Copy className="size-3.5" />
                    Copiar URL
                  </>
                )}
              </Button>
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              Coloque esta URL na configuração do seu script <code>crm_sync.py</code>.
            </p>
          </div>

          <div className="pt-2 border-t border-border/50">
            <button
              type="button"
              onClick={() => setShowCode(!showCode)}
              className="text-xs text-primary font-medium hover:underline flex items-center gap-1.5"
            >
              <Code2 className="size-3.5" />
              {showCode ? "Ocultar exemplo de código Python" : "Ver como enviar pelo Python (crm_sync.py)"}
            </button>

            {showCode && (
              <div className="mt-3 rounded-xl bg-muted/50 p-3 border border-border/70 text-xs font-mono overflow-x-auto space-y-2">
                <p className="text-muted-foreground font-sans text-[11px]">
                  Exemplo de envio no módulo <strong>crm_sync.py</strong>:
                </p>
                <pre className="text-foreground/90 whitespace-pre">
{`import requests

url = "${endpointUrl}"
headers = {
    "Content-Type": "application/json",
    # Opcional (se configurou CRM_API_KEY na Vercel):
    # "Authorization": "Bearer SEU_TOKEN_AQUI"
}

payload = {
    "nome": "Clínica Dra. Mariana Maldonado",
    "nicho": "Estética",
    "whatsapp": "11945187012",
    "link_perfil": "https://instagram.com/marianamaldonado",
    "msg_a_mandar": "Olá Dra. Mariana, vi seu site e preparei uma proposta...",
    "observacoes": "Score: 92/100 | Diagnóstico: Site não responsivo e sem WhatsApp direto."
}

response = requests.post(url, json=payload, headers=headers)
print(response.json())`}
                </pre>
              </div>
            )}
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
