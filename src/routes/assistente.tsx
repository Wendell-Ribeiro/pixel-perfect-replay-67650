import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, Crown, Lock, Send, Sparkles, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Change, Panel, PageHeader, TickerLogo } from "@/components/fin/primitives";
import { STOCKS, getStock } from "@/lib/demo-data";
import { brl } from "@/lib/format";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/assistente")({
  head: () => ({
    meta: [
      { title: "Assistente de IA Premium — PregãoIA" },
      { name: "description", content: "Conheça o assistente de IA que analisa até cinco ações conforme seu perfil." },
      { property: "og:title", content: "Assistente de IA Premium — PregãoIA" },
      { property: "og:description", content: "Conheça o assistente de IA que analisa até cinco ações conforme seu perfil." },
    ],
  }),
  component: Assistente,
});

const SUGGESTIONS = ["O que é Dividend Yield?", "Compare PETR4 e VALE3", "Quais setores são mais defensivos?", "Monte uma análise para perfil moderado"];
type Msg = { from: "ia" | "user"; text: string };
const DEMO_REPLY = "Esta é uma resposta demonstrativa. Na versão Premium, o assistente de IA trará uma análise personalizada para a sua pergunta, considerando seu perfil e objetivos.";

function Assistente() {
  const [msgs, setMsgs] = useState<Msg[]>([{ from: "ia", text: "Olá! Sou o assistente de IA do PregãoIA. Posso explicar indicadores, comparar ações e montar análises de acordo com o seu perfil de investidor. Como posso ajudar?" }]);
  const [text, setText] = useState("");
  const send = (t: string) => {
    if (!t.trim()) return;
    setMsgs((m) => [...m, { from: "user", text: t }, { from: "ia", text: DEMO_REPLY }]);
    setText("");
  };
  return (
    <>
      <PageHeader title="Assistente de IA" subtitle="Seu analista pessoal para entender o mercado." actions={<span className="inline-flex items-center gap-1.5 rounded-full bg-gold px-3 py-1 text-xs font-bold text-gold-foreground"><Crown className="h-3.5 w-3.5" /> Premium</span>} />
      <div className="mb-4 rounded-lg border border-gold/40 bg-gold/10 px-4 py-3 text-sm text-gold">
        Modo demonstração: as respostas e análises desta página são ilustrativas e não representam recomendações de investimento nem dados reais.
      </div>
      <div className="grid gap-4 lg:grid-cols-5">
        <Panel className="flex min-h-[520px] flex-col lg:col-span-3" title="Conversa">
          <div className="flex-1 space-y-3 overflow-y-auto">
            {msgs.map((m, i) => (
              <div key={i} className={cn("flex", m.from === "user" && "justify-end")}>
                <div className={cn("max-w-[85%] rounded-2xl px-4 py-2.5 text-sm", m.from === "user" ? "rounded-br-sm bg-primary text-primary-foreground" : "rounded-bl-sm bg-secondary")}>
                  {m.from === "ia" && <Sparkles className="mb-1 h-3.5 w-3.5 text-gold" />}
                  {m.text}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {SUGGESTIONS.map((s) => (
              <button key={s} onClick={() => send(s)} className="rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground hover:border-primary/50 hover:text-foreground">{s}</button>
            ))}
          </div>
          <form onSubmit={(e) => { e.preventDefault(); send(text); }} className="mt-3 flex gap-2">
            <Input value={text} onChange={(e) => setText(e.target.value)} placeholder="Pergunte algo sobre o mercado..." />
            <Button type="submit" size="icon" aria-label="Enviar"><Send className="h-4 w-4" /></Button>
          </form>
        </Panel>
        <div className="space-y-4 lg:col-span-2">
          <AnalysisDemo />
          <Benefits />
        </div>
      </div>
    </>
  );
}

const SCORES: Record<string, { score: number; note: string }> = {
  PETR4: { score: 78, note: "Alto rendimento em dividendos; sensível ao preço do petróleo." },
  VALE3: { score: 71, note: "Valuation atrativo; exposição à demanda chinesa." },
  ITUB4: { score: 84, note: "Rentabilidade consistente e baixo risco relativo." },
  WEGE3: { score: 80, note: "Crescimento sólido; múltiplos elevados." },
  TAEE11: { score: 76, note: "Receita previsível, perfil defensivo." },
};

function AnalysisDemo() {
  const [sel, setSel] = useState<string[]>(["PETR4", "VALE3", "ITUB4"]);
  const toggle = (t: string) => setSel((s) => (s.includes(t) ? s.filter((x) => x !== t) : s.length >= 5 ? s : [...s, t]));
  return (
    <Panel title="Análise de até 5 ações" action={<span className="num text-xs text-muted-foreground">{sel.length}/5</span>}>
      <div className="mb-4 flex flex-wrap gap-1.5">
        {STOCKS.slice(0, 8).concat(STOCKS.filter((s) => s.ticker === "TAEE11")).map((s) => (
          <button key={s.ticker} onClick={() => toggle(s.ticker)} disabled={!sel.includes(s.ticker) && sel.length >= 5}
            className={cn("num rounded-md border px-2 py-1 text-xs disabled:opacity-40", sel.includes(s.ticker) ? "border-primary bg-primary/15 text-primary" : "border-border text-muted-foreground")}>
            {s.ticker}
          </button>
        ))}
      </div>
      <ul className="space-y-3">
        {sel.map((t) => {
          const s = getStock(t)!;
          const sc = SCORES[t] ?? { score: 65, note: "Análise ilustrativa disponível no Premium." };
          return (
            <li key={t} className="rounded-lg bg-secondary/50 p-3">
              <div className="flex items-center gap-3">
                <TickerLogo ticker={t} />
                <div className="flex-1"><p className="font-semibold">{t}</p><p className="num text-xs text-muted-foreground">{brl(s.price)} · <Change value={s.change} /></p></div>
                <span className="num text-lg font-semibold text-primary">{sc.score}</span>
              </div>
              <div className="mt-2 h-1.5 rounded-full bg-muted"><div className="h-full rounded-full bg-primary" style={{ width: `${sc.score}%` }} /></div>
              <p className="mt-2 text-xs text-muted-foreground">{sc.note}</p>
            </li>
          );
        })}
      </ul>
      <p className="mt-3 text-[11px] text-muted-foreground">Notas e comentários fictícios, apenas para ilustrar o formato da análise.</p>
    </Panel>
  );
}

function Benefits() {
  const rows = [
    ["Dashboard e cotações", true, true],
    ["Conteúdo educativo", true, true],
    ["Chat com assistente de IA", false, true],
    ["Análise personalizada de até 5 ações", false, true],
    ["Alertas por perfil e objetivos", false, true],
  ] as const;
  return (
    <div className="bg-premium rounded-xl border border-gold/30 p-5">
      <div className="flex items-center gap-2"><Lock className="h-4 w-4 text-gold" /><h3 className="font-semibold">Você está no plano Gratuito</h3></div>
      <table className="mt-4 w-full text-sm">
        <thead><tr className="text-xs text-muted-foreground"><th className="text-left font-medium" /><th className="font-medium">Grátis</th><th className="font-medium text-gold">Premium</th></tr></thead>
        <tbody>
          {rows.map(([l, f, p]) => (
            <tr key={l} className="border-t border-border/50">
              <td className="py-2">{l}</td>
              <td className="text-center">{f ? <Check className="mx-auto h-4 w-4 text-gain" /> : <X className="mx-auto h-4 w-4 text-muted-foreground" />}</td>
              <td className="text-center">{p && <Check className="mx-auto h-4 w-4 text-gold" />}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Button asChild className="mt-4 w-full bg-gold text-gold-foreground hover:opacity-90"><Link to="/planos">Ver planos</Link></Button>
    </div>
  );
}
