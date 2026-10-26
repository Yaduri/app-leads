"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Trash2,
  Download,
  AlertTriangle,
  Mail,
  User,
  Loader2,
  Copy,
  Check,
  Zap,
  Code2,
  DollarSign,
  MessageSquare,
  RotateCcw,
  Save,
  Globe,
  Lightbulb,
} from "lucide-react";
import { toast } from "sonner";
import { downloadLeadsCsv } from "@/lib/csv/export-leads-csv";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { deleteAllLeads, getLeadsForExport, updateUsername } from "@/lib/actions/settings";
import {
  getCustomPricing,
  saveCustomPricing,
  getCustomWhatsAppTemplates,
  saveCustomWhatsAppTemplates,
  DEFAULT_PROJECT_PRICING,
  DEFAULT_ADDON_PRICING,
  DEFAULT_WHATSAPP_TEMPLATES,
  ProjectPricing,
  AddonPricing,
  WhatsAppTemplateSetting,
} from "@/lib/pricing-settings";

export function SettingsForm({
  userId,
  userEmail,
  initialUsername,
  leadsCount,
}: {
  userId?: string;
  userEmail: string;
  initialUsername: string;
  leadsCount: number;
}) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [localCount, setLocalCount] = useState(leadsCount);
  const [userName, setUserName] = useState(initialUsername);
  const [savingName, setSavingName] = useState(false);

  const [projects, setProjects] = useState<ProjectPricing[]>(DEFAULT_PROJECT_PRICING);
  const [addons, setAddons] = useState<AddonPricing[]>(DEFAULT_ADDON_PRICING);
  const [whatsappTemplates, setWhatsappTemplates] = useState<WhatsAppTemplateSetting[]>(DEFAULT_WHATSAPP_TEMPLATES);

  useEffect(() => {
    const custom = getCustomPricing();
    setProjects(custom.projects);
    setAddons(custom.addons);
    setWhatsappTemplates(getCustomWhatsAppTemplates());
  }, []);

  const handleSavePricing = () => {
    saveCustomPricing(projects, addons);
    toast.success("Tabela de preços atualizada com sucesso!");
  };

  const handleResetPricing = () => {
    setProjects(DEFAULT_PROJECT_PRICING);
    setAddons(DEFAULT_ADDON_PRICING);
    saveCustomPricing(DEFAULT_PROJECT_PRICING, DEFAULT_ADDON_PRICING);
    toast.success("Preços restaurados para os padrões originais.");
  };

  const handleSaveTemplates = () => {
    saveCustomWhatsAppTemplates(whatsappTemplates);
    toast.success("Modelos de WhatsApp salvos com sucesso!");
  };

  const handleResetTemplates = () => {
    setWhatsappTemplates(DEFAULT_WHATSAPP_TEMPLATES);
    saveCustomWhatsAppTemplates(DEFAULT_WHATSAPP_TEMPLATES);
    toast.success("Modelos restaurados para os originais.");
  };

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

  async function handleExport() {
    if (localCount === 0) {
      toast.error("Você não tem nenhum lead para exportar.");
      return;
    }

    setExporting(true);
    try {
      const res = await getLeadsForExport();
      if (!res.ok) {
        toast.error(res.error);
        return;
      }

      const leads = res.leads;
      if (leads.length === 0) {
        toast.error("Você não tem nenhum lead para exportar.");
        return;
      }

      downloadLeadsCsv(leads, `backup-leads-${new Date().toISOString().slice(0, 10)}.csv`);
      toast.success("Backup completo exportado com sucesso!");
    } catch (err) {
      console.error(err);
      toast.error("Erro ao exportar o backup de leads.");
    } finally {
      setExporting(false);
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
      setLocalCount(0);
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

      {/* Tabela de Preços & Planos Padrão */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <DollarSign className="size-4 text-emerald-400" />
                Tabela de Preços & Planos Padrão
              </CardTitle>
              <CardDescription>
                Defina os valores padrão que serão sugeridos automaticamente no Gerador de Propostas.
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleResetPricing}
                className="gap-1.5 text-xs text-muted-foreground hover:text-foreground"
              >
                <RotateCcw className="size-3.5" />
                Padrões
              </Button>
              <Button
                size="sm"
                onClick={handleSavePricing}
                className="gap-1.5 text-xs bg-emerald-600 hover:bg-emerald-500 text-white"
              >
                <Save className="size-3.5" />
                Salvar Preços
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Tipos de Projeto (Criação de Sites)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {projects.map((proj, idx) => (
                <div
                  key={proj.id}
                  className="rounded-xl border border-border/70 bg-card/60 p-3.5 space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-medium text-xs text-foreground">{proj.name}</span>
                    <span className="text-[11px] bg-muted px-1.5 py-0.5 rounded text-muted-foreground font-mono">
                      Setup
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground line-clamp-1">{proj.description}</p>
                  <div className="flex items-center gap-2 pt-1">
                    <span className="text-xs text-muted-foreground font-mono">R$</span>
                    <Input
                      type="number"
                      value={proj.defaultPrice}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value) || 0;
                        setProjects((prev) =>
                          prev.map((p, i) => (i === idx ? { ...p, defaultPrice: val } : p)),
                        );
                      }}
                      className="h-8 text-xs font-mono font-semibold"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3 pt-3 border-t border-border/50">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Globe className="size-3.5 text-sky-400" />
              Serviços Adicionais & Mensalidades (MRR)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {addons.map((addon, idx) => (
                <div
                  key={addon.id}
                  className="rounded-xl border border-border/70 bg-card/60 p-3.5 space-y-2.5"
                >
                  <span className="font-medium text-xs text-foreground block">{addon.name}</span>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[11px] text-muted-foreground">Criação (R$)</label>
                      <Input
                        type="number"
                        value={addon.setupPrice}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value) || 0;
                          setAddons((prev) =>
                            prev.map((a, i) => (i === idx ? { ...a, setupPrice: val } : a)),
                          );
                        }}
                        className="h-8 text-xs font-mono"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] text-muted-foreground">Mensalidade (R$/mês)</label>
                      <Input
                        type="number"
                        value={addon.recurringPrice}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value) || 0;
                          setAddons((prev) =>
                            prev.map((a, i) => (i === idx ? { ...a, recurringPrice: val } : a)),
                          );
                        }}
                        className="h-8 text-xs font-mono"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modelos de Mensagens (WhatsApp) */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <MessageSquare className="size-4 text-emerald-400" />
                Scripts & Modelos de WhatsApp
              </CardTitle>
              <CardDescription>
                Personalize os textos rápidos que aparecem no menu de envio do WhatsApp em cada lead.
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleResetTemplates}
                className="gap-1.5 text-xs text-muted-foreground hover:text-foreground"
              >
                <RotateCcw className="size-3.5" />
                Restaurar Padrões
              </Button>
              <Button
                size="sm"
                onClick={handleSaveTemplates}
                className="gap-1.5 text-xs bg-emerald-600 hover:bg-emerald-500 text-white"
              >
                <Save className="size-3.5" />
                Salvar Modelos
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-muted/40 p-3 border border-border/70 text-xs text-muted-foreground space-y-1">
            <p className="font-semibold text-foreground flex items-center gap-1.5">
              <Lightbulb className="size-3.5 text-amber-400 shrink-0" />
              Variáveis dinâmicas que você pode usar:
            </p>
            <div className="flex flex-wrap gap-2 text-[11px] pt-1">
              <span className="bg-background px-2 py-0.5 rounded border border-border font-mono">
                {"{nome}"} = Primeiro nome
              </span>
              <span className="bg-background px-2 py-0.5 rounded border border-border font-mono">
                {"{nicho}"} = Segmento/Nicho
              </span>
              <span className="bg-background px-2 py-0.5 rounded border border-border font-mono">
                {"{valor}"} = Valor de mensalidade
              </span>
              <span className="bg-background px-2 py-0.5 rounded border border-border font-mono">
                {"{dia}"} = Dia do vencimento
              </span>
            </div>
          </div>

          <div className="space-y-3">
            {whatsappTemplates.map((tpl, idx) => (
              <div
                key={tpl.id}
                className="rounded-xl border border-border/70 bg-card/60 p-3.5 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-foreground">{tpl.title}</span>
                  <span className="text-[11px] text-muted-foreground">{tpl.description}</span>
                </div>
                <Textarea
                  value={tpl.text}
                  rows={2}
                  onChange={(e) => {
                    const text = e.target.value;
                    setWhatsappTemplates((prev) =>
                      prev.map((t, i) => (i === idx ? { ...t, text } : t)),
                    );
                  }}
                  className="text-xs leading-relaxed font-sans resize-y"
                />
              </div>
            ))}
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
          <Button onClick={handleExport} disabled={exporting || localCount === 0} className="w-full sm:w-auto gap-2">
            {exporting ? <Loader2 className="size-4 animate-spin" /> : <Download className="size-4" />}
            {exporting ? "Gerando arquivo CSV..." : `Exportar ${localCount} Leads para CSV`}
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
              <Button variant="destructive" disabled={localCount === 0} className="w-full sm:w-auto gap-2">
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
                  Esta ação excluirá permanentemente todos os <strong>{localCount} leads</strong> cadastrados. Você não poderá recuperar estes dados depois de confirmar.
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
