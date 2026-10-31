import { createFileRoute, Link } from "@tanstack/react-router";
import { Clock, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/fin/primitives";
import { Readiness } from "@/components/fin/Readiness";
import { useWorkspace } from "@/lib/workspace";
import { dateTimeBR } from "@/lib/format";

export const Route = createFileRoute("/historico")({
  head: () => ({ meta: [
    { title: "Histórico de análises — PregãoIA" },
    { name: "description", content: "Histórico de análises de ações da B3 com critérios, fundamentos, riscos e fontes." },
    { property: "og:title", content: "Histórico de análises — PregãoIA" },
    { property: "og:description", content: "Análises anteriores preservadas e consultas preparadas, com suas datas e critérios." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }), component: Historico,
});
function Historico() {
  const { requests } = useWorkspace();
  return <>
    <PageHeader title="Histórico de análises" subtitle="Fundamentação, fontes e evolução das empresas." actions={<Button asChild><Link to="/assistente">Preparar consulta</Link></Button>} />
    <Readiness>Armazenamento de análises ainda não conectado. Consultas preparadas existem somente nesta sessão; não são análises concluídas e desaparecem ao recarregar.</Readiness>
    <section className="border-b border-border py-6"><FileText className="mb-3 h-6 w-6 text-muted-foreground" /><h2 className="text-lg font-semibold">Nenhuma análise concluída</h2><p className="mt-2 max-w-2xl text-sm text-muted-foreground">Comparação entre análises anteriores e atuais indisponível até existirem resultados verificados e histórico persistente.</p><Button variant="outline" className="mt-4" disabled>Comparar análises</Button></section>
    <section className="py-6"><h2 className="mb-4 flex items-center gap-2 font-semibold"><Clock className="h-4 w-4 text-gold" />Consultas preparadas nesta sessão</h2>
      {requests.length === 0 ? <p className="text-sm text-muted-foreground">Nenhuma consulta preparada.</p> : <ul className="divide-y divide-border">{[...requests].reverse().map((r) => <li key={r.id} className="py-4"><div className="flex flex-wrap items-center justify-between gap-2"><h3 className="font-semibold">{r.tickers.join(" · ")}</h3><span className="text-xs text-gold">Aguardando integrações</span></div><p className="mt-1 text-xs text-muted-foreground">{dateTimeBR(r.createdAt)} · {r.mode}</p><dl className="mt-3 grid gap-3 text-sm sm:grid-cols-2"><div><dt className="text-muted-foreground">Critérios solicitados</dt><dd className="break-words">{r.question || "Não informados"}</dd></div><div><dt className="text-muted-foreground">Contexto no momento da consulta</dt><dd>{r.profile.objective || "Objetivo não informado"} · {r.profile.risk || "Risco não informado"}</dd></div><div><dt className="text-muted-foreground">Dados e fontes</dt><dd>Não utilizados — consulta não executada</dd></div><div><dt className="text-muted-foreground">Resultado, fundamentação e riscos</dt><dd>Indisponíveis</dd></div></dl></li>)}</ul>}
    </section>
  </>;
}