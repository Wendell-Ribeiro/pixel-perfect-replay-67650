import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Save, User } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Panel, PageHeader } from "@/components/fin/primitives";
import { Readiness } from "@/components/fin/Readiness";
import { useWorkspace } from "@/lib/workspace";
import type { InvestorProfile } from "@/lib/analysis";

export const Route = createFileRoute("/perfil")({
  head: () => ({ meta: [
    { title: "Perfil de investidor — PregãoIA" },
    { name: "description", content: "Informe objetivos, horizonte, risco, aportes e restrições para contextualizar análises de ações da B3." },
    { property: "og:title", content: "Perfil de investidor — PregãoIA" },
    { property: "og:description", content: "Objetivos, horizonte, risco e capacidade de aporte, sem presumir suas informações." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }), component: Perfil,
});

function Perfil() {
  const { profile, saveProfile } = useWorkspace();
  const [draft, setDraft] = useState({ ...profile });
  const [prefs, setPrefs] = useState({ news: false, alerts: false, weekly: false });
  const set = <K extends keyof InvestorProfile>(key: K, value: InvestorProfile[K]) => setDraft((p) => ({ ...p, [key]: value }));
  const fields = [
    { key: "objective", label: "Objetivo principal", options: [["crescimento", "Crescimento patrimonial"], ["dividendos", "Dividendos"], ["equilibrio", "Equilíbrio"]] },
    { key: "horizon", label: "Horizonte de investimento", options: [["curto", "Até 2 anos"], ["medio", "De 2 a 5 anos"], ["longo", "Mais de 5 anos"]] },
    { key: "risk", label: "Tolerância ao risco", options: [["conservador", "Conservador"], ["moderado", "Moderado"], ["arrojado", "Arrojado"]] },
  ] as const;
  return <>
    <PageHeader title="Perfil e configurações" subtitle="Seu contexto de investidor, informado por você." />
    <Readiness>Sem conta conectada. As informações ficam apenas nesta sessão e são descartadas ao recarregar. Não há envio de notificações.</Readiness>
    <form onSubmit={(e) => { e.preventDefault(); saveProfile({ ...draft }); toast.success("Perfil atualizado nesta sessão", { description: "Não foi salvo em uma conta. Ao recarregar, será descartado." }); }} className="grid gap-4 lg:grid-cols-3">
      <Panel className="self-start">
        <div className="flex flex-col items-center text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary font-display text-2xl font-semibold text-primary-foreground">{draft.name.trim() ? draft.name.trim().split(/\s+/).map((p) => p[0]).slice(0, 2).join("").toUpperCase() : <User className="h-8 w-8" />}</div>
          <p className="mt-3 max-w-full break-words font-semibold">{draft.name || "Perfil não informado"}</p>
          <p className="text-sm text-muted-foreground">Conta não conectada</p>
          <span className="mt-3 rounded-full bg-secondary px-3 py-1 text-xs">Prévia do plano Gratuito</span>
        </div>
      </Panel>
      <div className="space-y-4 lg:col-span-2">
        <Panel title="Identificação"><Label htmlFor="name">Nome (opcional)</Label><Input id="name" className="mt-1.5" value={draft.name} onChange={(e) => set("name", e.target.value)} placeholder="Seu nome" maxLength={100} /></Panel>
        <Panel title="Perfil de investidor"><div className="grid gap-4 sm:grid-cols-2">
          {fields.map((field) => <div key={field.key} className="space-y-1.5"><Label htmlFor={field.key}>{field.label}</Label><Select value={draft[field.key] || "nao-informado"} onValueChange={(v) => set(field.key, (v === "nao-informado" ? "" : v) as InvestorProfile[typeof field.key])}><SelectTrigger id={field.key}><SelectValue /></SelectTrigger><SelectContent><SelectItem value="nao-informado">Não informado</SelectItem>{field.options.map(([value, label]) => <SelectItem key={value} value={value}>{label}</SelectItem>)}</SelectContent></Select></div>)}
          <div className="space-y-1.5"><Label htmlFor="available">Valor disponível para investir (R$)</Label><Input id="available" type="number" min="0" step="0.01" value={draft.available} onChange={(e) => set("available", e.target.value)} placeholder="Não informado" /></div>
          <div className="space-y-1.5"><Label htmlFor="monthly">Capacidade de aporte mensal (R$)</Label><Input id="monthly" type="number" min="0" step="0.01" value={draft.monthly} onChange={(e) => set("monthly", e.target.value)} placeholder="Não informado" /></div>
        </div></Panel>
        <Panel title="Preferências e restrições"><div className="space-y-4"><div><Label htmlFor="preferences">Preferências de investimento</Label><Textarea id="preferences" className="mt-1.5" value={draft.preferences} onChange={(e) => set("preferences", e.target.value)} placeholder="Setores ou características de interesse" maxLength={2000} /></div><div><Label htmlFor="restrictions">Restrições de investimento</Label><Textarea id="restrictions" className="mt-1.5" value={draft.restrictions} onChange={(e) => set("restrictions", e.target.value)} placeholder="Setores ou empresas que prefere evitar" maxLength={2000} /></div></div></Panel>
        <Panel title="Notificações — ainda indisponíveis">{([["news", "Resumo de notícias da B3"], ["alerts", "Alertas das empresas acompanhadas"], ["weekly", "Relatório por e-mail"]] as const).map(([k, l]) => <div key={k} className="flex items-center justify-between gap-4 border-b border-border/60 py-3 last:border-0"><Label htmlFor={k}>{l}</Label><Switch id={k} checked={prefs[k]} disabled /></div>)}</Panel>
        <div className="flex flex-wrap justify-end gap-2"><Button type="button" variant="ghost" disabled>Sair · conta não conectada</Button><Button type="submit"><Save />Salvar nesta sessão</Button></div>
      </div>
    </form>
  </>;
}
