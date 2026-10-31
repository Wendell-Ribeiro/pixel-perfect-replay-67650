import { createFileRoute, Link } from "@tanstack/react-router";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/fin/primitives";
import { Readiness } from "@/components/fin/Readiness";
import { useWatchlist } from "@/lib/watchlist";

export const Route = createFileRoute("/alertas")({
  head: () => ({ meta: [
    { title: "Alertas de empresas da B3 — PregãoIA" },
    { name: "description", content: "Acompanhe mudanças nos fundamentos, resultados, endividamento e eventos de empresas da B3." },
    { property: "og:title", content: "Alertas de empresas — PregãoIA" },
    { property: "og:description", content: "Monitoramento de empresas e revisão de análises. Serviço ainda não conectado." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }), component: Alertas,
});
function Alertas() {
  const { list } = useWatchlist();
  return <>
    <PageHeader title="Alertas importantes" subtitle="Mudanças que merecem uma nova leitura da empresa." actions={<Button asChild variant="outline"><Link to="/acompanhamento">Minha lista</Link></Button>} />
    <Readiness>Monitoramento e notificações ainda não conectados. Nenhuma empresa está sendo monitorada automaticamente; a ausência de alertas não significa ausência de eventos.</Readiness>
    <section className="border-b border-border py-6"><Bell className="mb-3 h-6 w-6 text-muted-foreground" /><h2 className="text-lg font-semibold">Alertas indisponíveis</h2><p className="mt-2 text-sm text-muted-foreground">{list.length} ações na lista demonstrativa. Eventos reais exigem fontes de dados conectadas.</p></section>
    <section className="py-6"><h2 className="mb-4 font-semibold">Categorias previstas</h2><ul className="divide-y divide-border">{["Mudanças relevantes nos fundamentos", "Divulgação de resultados financeiros", "Alterações no endividamento", "Eventos relevantes das empresas", "Mudanças que exigem revisar uma análise anterior"].map((category) => <li key={category} className="flex flex-wrap justify-between gap-2 py-4 text-sm"><span>{category}</span><span className="text-xs text-muted-foreground">Aguardando fontes verificáveis</span></li>)}</ul></section>
  </>;
}