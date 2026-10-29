import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Panel, PageHeader } from "@/components/fin/primitives";

export const Route = createFileRoute("/perfil")({
  head: () => ({
    meta: [
      { title: "Perfil e configurações — PregãoIA" },
      { name: "description", content: "Gerencie seu perfil de investidor, preferências e conta." },
      { property: "og:title", content: "Perfil e configurações — PregãoIA" },
      { property: "og:description", content: "Gerencie seu perfil de investidor, preferências e conta." },
    ],
  }),
  component: Perfil,
});

function Perfil() {
  const [name, setName] = useState("Investidor Demo");
  const [email, setEmail] = useState("investidor@exemplo.com.br");
  const [profile, setProfile] = useState("moderado");
  const [goal, setGoal] = useState("longo");
  const [prefs, setPrefs] = useState({ news: true, alerts: false, weekly: true });
  const save = () => toast.success("Preferências salvas (demonstração)");
  return (
    <>
      <PageHeader title="Perfil e configurações" subtitle="Personalize sua experiência." />
      <div className="grid gap-4 lg:grid-cols-3">
        <Panel className="lg:col-span-1">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary font-display text-2xl font-semibold text-primary-foreground">{name.split(" ").map((p) => p[0]).slice(0, 2).join("")}</div>
            <p className="mt-3 font-semibold">{name}</p>
            <p className="text-sm text-muted-foreground">{email}</p>
            <span className="mt-3 rounded-full bg-secondary px-3 py-1 text-xs">Plano Gratuito</span>
          </div>
        </Panel>
        <div className="space-y-4 lg:col-span-2">
          <Panel title="Dados da conta">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5"><Label htmlFor="n">Nome</Label><Input id="n" value={name} onChange={(e) => setName(e.target.value)} /></div>
              <div className="space-y-1.5"><Label htmlFor="e">E-mail</Label><Input id="e" type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
            </div>
          </Panel>
          <Panel title="Perfil de investidor">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5"><Label>Perfil</Label>
                <Select value={profile} onValueChange={setProfile}><SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="conservador">Conservador</SelectItem><SelectItem value="moderado">Moderado</SelectItem><SelectItem value="arrojado">Arrojado</SelectItem></SelectContent></Select>
              </div>
              <div className="space-y-1.5"><Label>Objetivo principal</Label>
                <Select value={goal} onValueChange={setGoal}><SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="renda">Renda com dividendos</SelectItem><SelectItem value="longo">Crescimento no longo prazo</SelectItem><SelectItem value="aprender">Aprender sobre o mercado</SelectItem></SelectContent></Select>
              </div>
            </div>
          </Panel>
          <Panel title="Preferências">
            {([["news", "Resumo diário de notícias"], ["alerts", "Alertas de variação da minha lista"], ["weekly", "Relatório semanal por e-mail"]] as const).map(([k, l]) => (
              <div key={k} className="flex items-center justify-between border-b border-border/60 py-3 last:border-0">
                <Label htmlFor={k}>{l}</Label>
                <Switch id={k} checked={prefs[k]} onCheckedChange={(v) => setPrefs((p) => ({ ...p, [k]: v }))} />
              </div>
            ))}
          </Panel>
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => toast("Sessão encerrada (demonstração)")}>Sair</Button>
            <Button onClick={save}>Salvar alterações</Button>
          </div>
        </div>
      </div>
    </>
  );
}
