import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, Search, Send, Sparkles, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Panel, PageHeader } from "@/components/fin/primitives";
import { Readiness } from "@/components/fin/Readiness";
import { searchStocks } from "@/lib/market";
import { useWorkspace } from "@/lib/workspace";
import type { AnalysisRequest } from "@/lib/analysis";
import { dateTimeBR } from "@/lib/format";

export const Route = createFileRoute("/assistente")({
  head: () => ({ meta: [
    { title: "Assistente especializado em ações da B3 — PregãoIA" },
    { name: "description", content: "Prepare análises fundamentalistas e comparações de empresas brasileiras com contexto do investidor e fontes verificáveis." },
    { property: "og:title", content: "Assistente B3 — PregãoIA" },
    { property: "og:description", content: "Análise de empresas, indicadores e riscos. Integração de inteligência artificial ainda não ativa." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }), component: Assistente,
});
const SECTIONS = ["Resumo da empresa", "Indicadores financeiros e fontes", "Pontos positivos", "Pontos de atenção", "Principais riscos", "Fundamentação da análise", "Data de referência dos dados"];
function Assistente() {
  const { profile, requests, prepareRequest } = useWorkspace();
  const [mode, setMode] = useState<AnalysisRequest["mode"]>("empresa");
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [question, setQuestion] = useState("");
  const rows = searchStocks(q);
  const enough = selected.length >= (mode === "comparacao" ? 2 : 1);
  return <>
    <PageHeader title="Assistente PregãoIA" subtitle="Análise fundamentalista de empresas da Bolsa brasileira." actions={<span className="flex items-center gap-2 text-sm text-gold"><Sparkles className="h-4 w-4" />Integração pendente</span>} />
    <Readiness>A IA e os fornecedores de dados ainda não estão conectados. Nenhuma análise é gerada nesta etapa. Cotações demonstrativas não serão usadas para produzir conclusões ou recomendações.</Readiness>
    <div className="grid gap-4 lg:grid-cols-5">
      <div className="min-w-0 space-y-4 lg:col-span-3">
        <Panel title="Preparar consulta">
          <Tabs value={mode} onValueChange={(v) => setMode(v as AnalysisRequest["mode"])}><TabsList className="mb-5 flex h-auto flex-wrap justify-start"><TabsTrigger value="empresa">Empresa</TabsTrigger><TabsTrigger value="comparacao">Comparação</TabsTrigger><TabsTrigger value="indicadores">Indicadores</TabsTrigger><TabsTrigger value="resultados">Resultados</TabsTrigger></TabsList></Tabs>
          <Label htmlFor="stock-search">Pesquisar ação</Label><div className="relative mt-1.5"><Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" /><Input id="stock-search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Ticker, empresa ou nome conhecido" className="pl-9" /></div>
          <p className="mt-2 text-xs text-muted-foreground">Catálogo demonstrativo de 12 ações · base ampla ainda não conectada</p>
          <div className="mt-3 max-h-60 overflow-y-auto divide-y divide-border">{rows.map((s) => <div key={s.ticker} className="flex items-center justify-between gap-3 py-2"><div className="min-w-0"><p className="num text-sm font-semibold">{s.ticker}</p><p className="truncate text-xs text-muted-foreground">{s.name}</p></div><Button variant={selected.includes(s.ticker) ? "secondary" : "ghost"} size="icon" aria-label={selected.includes(s.ticker) ? `Remover ${s.ticker} da consulta` : `Selecionar ${s.ticker}`} onClick={() => setSelected((current) => current.includes(s.ticker) ? current.filter((t) => t !== s.ticker) : [...current, s.ticker])}>{selected.includes(s.ticker) ? <Check className="text-primary" /> : <span className="text-lg">+</span>}</Button></div>)}{rows.length === 0 && <p className="py-6 text-sm text-muted-foreground">Nenhuma ação nesta amostra. O catálogo completo depende de um fornecedor de dados.</p>}</div>
          <div className="mt-4 flex flex-wrap gap-2">{selected.map((ticker) => <Button key={ticker} variant="secondary" size="sm" aria-label={`Remover ${ticker} da seleção`} onClick={() => setSelected((current) => current.filter((t) => t !== ticker))}>{ticker}<X /></Button>)}</div>
          <form className="mt-5" onSubmit={(e) => { e.preventDefault(); if (!enough) return; prepareRequest({ mode, tickers: selected, question: question.trim() }); toast.success("Consulta preparada nesta sessão", { description: "Nenhuma análise foi executada. É necessário conectar dados verificáveis e IA." }); }}>
            <Label htmlFor="question">Pergunta ou critérios de interesse (opcional)</Label><Textarea id="question" className="mt-1.5" value={question} onChange={(e) => setQuestion(e.target.value)} maxLength={4000} placeholder="Ex.: compare a lucratividade e o endividamento dessas empresas" />
            {!enough && <p className="mt-2 text-xs text-muted-foreground">{mode === "comparacao" ? "Selecione pelo menos duas ações para comparar." : "Selecione uma empresa para continuar."}</p>}
            <Button className="mt-4" type="submit" disabled={!enough}><Send />Preparar consulta</Button>
          </form>
        </Panel>
        <section className="py-2"><div className="mb-3 flex items-center justify-between gap-2"><h2 className="font-semibold">Consultas preparadas</h2><Button asChild variant="link" size="sm"><Link to="/historico">Ver histórico</Link></Button></div>{requests.length === 0 ? <p className="text-sm text-muted-foreground">Nenhuma consulta preparada nesta sessão.</p> : <ul className="divide-y divide-border">{[...requests].reverse().map((r) => <li key={r.id} className="py-3"><p className="text-sm font-medium">{r.tickers.join(" · ")}</p><p className="mt-1 text-xs text-muted-foreground">{dateTimeBR(r.createdAt)} · Aguardando dados e IA</p>{r.question && <p className="mt-2 break-words text-sm">{r.question}</p>}</li>)}</ul>}</section>
      </div>
      <div className="min-w-0 space-y-4 lg:col-span-2">
        <Panel title="Contexto do investidor" action={<Button asChild size="sm" variant="link"><Link to="/perfil">Editar</Link></Button>}><dl className="space-y-3 text-sm">{[["Objetivo", profile.objective], ["Horizonte", profile.horizon], ["Tolerância ao risco", profile.risk], ["Valor disponível", profile.available ? `R$ ${profile.available}` : ""], ["Aporte mensal", profile.monthly ? `R$ ${profile.monthly}` : ""], ["Preferências", profile.preferences], ["Restrições", profile.restrictions]].map(([label, value]) => <div key={label}><dt className="text-xs text-muted-foreground">{label}</dt><dd className="mt-1 break-words">{value || "Não informado"}</dd></div>)}</dl></Panel>
        <Panel title="Análise — ainda indisponível"><ul className="divide-y divide-border">{SECTIONS.map((section) => <li key={section} className="py-3"><h3 className="text-sm font-medium">{section}</h3><p className="mt-1 text-xs text-muted-foreground">Aguardando dados verificáveis e processamento.</p></li>)}</ul></Panel>
        <Button asChild variant="outline" className="w-full"><Link to="/planos">Conhecer o Premium</Link></Button>
      </div>
    </div>
    <p className="mt-6 text-xs text-muted-foreground">Conteúdo futuro de caráter informativo. Sem recomendação de compra ou venda, classificação inventada ou garantia de retorno. Recomendações comerciais dependem de validação regulatória.</p>
  </>;
}
