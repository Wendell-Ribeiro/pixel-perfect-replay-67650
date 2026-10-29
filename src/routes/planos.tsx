import { createFileRoute } from "@tanstack/react-router";
import { Check, Crown } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/fin/primitives";
import { PLAN_PRICES } from "@/lib/plans";
import { brl } from "@/lib/format";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/planos")({
  head: () => ({
    meta: [
      { title: "Planos e assinatura — PregãoIA" },
      { name: "description", content: "Compare os planos Gratuito e Premium do PregãoIA." },
      { property: "og:title", content: "Planos e assinatura — PregãoIA" },
      { property: "og:description", content: "Compare os planos Gratuito e Premium do PregãoIA." },
    ],
  }),
  component: Planos,
});

const FREE = ["Dashboard do mercado", "Tabela de ações com filtros", "Notícias por categoria", "Guia de indicadores", "Lista de acompanhamento"];
const PREMIUM = ["Tudo do plano Gratuito", "Assistente de IA ilimitado", "Análise personalizada de até 5 ações", "Recomendações por perfil e objetivo", "Alertas inteligentes", "Suporte prioritário"];

function Planos() {
  const [yearly, setYearly] = useState(false);
  const price = yearly ? PLAN_PRICES.premiumYearly : PLAN_PRICES.premiumMonthly;
  const subscribe = () => toast("Assinaturas ainda não estão disponíveis", { description: "Esta é uma versão de demonstração — nenhum pagamento é processado." });
  return (
    <>
      <PageHeader title="Planos e assinatura" subtitle="Comece grátis e evolua quando quiser." />
      <div className="mb-6 inline-flex rounded-lg border border-border p-1">
        {[["Mensal", false], ["Anual", true]].map(([l, v]) => (
          <button key={String(l)} onClick={() => setYearly(v as boolean)} className={cn("rounded-md px-4 py-1.5 text-sm", yearly === v ? "bg-secondary text-foreground" : "text-muted-foreground")}>{l}</button>
        ))}
      </div>
      <div className="grid max-w-4xl gap-4 md:grid-cols-2">
        <div className="panel flex flex-col p-6">
          <h2 className="text-lg font-semibold">Gratuito</h2>
          <p className="mt-1 text-sm text-muted-foreground">Para quem está começando.</p>
          <p className="num mt-6 text-4xl font-semibold">{brl(PLAN_PRICES.free)}</p>
          <ul className="mt-6 flex-1 space-y-2.5 text-sm">{FREE.map((f) => <li key={f} className="flex gap-2"><Check className="h-4 w-4 text-gain" />{f}</li>)}</ul>
          <Button variant="secondary" className="mt-6" disabled>Plano atual</Button>
        </div>
        <div className="bg-premium flex flex-col rounded-xl border border-gold/40 p-6">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-lg font-semibold"><Crown className="h-5 w-5 text-gold" />Premium</h2>
            <span className="rounded-full bg-gold px-2.5 py-0.5 text-[11px] font-bold text-gold-foreground">Recomendado</span>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">Análises com IA para decidir melhor.</p>
          <p className="num mt-6 text-4xl font-semibold">{price != null ? brl(price) : "A definir"}<span className="text-base font-normal text-muted-foreground">{price != null && (yearly ? "/ano" : "/mês")}</span></p>
          <ul className="mt-6 flex-1 space-y-2.5 text-sm">{PREMIUM.map((f) => <li key={f} className="flex gap-2"><Check className="h-4 w-4 text-gold" />{f}</li>)}</ul>
          <Button onClick={subscribe} className="mt-6 bg-gold text-gold-foreground hover:opacity-90">Assinar Premium</Button>
        </div>
      </div>
      <p className="mt-6 text-xs text-muted-foreground">Nenhum pagamento é processado nesta versão. Os valores serão definidos em breve.</p>
    </>
  );
}
