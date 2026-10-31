import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Change, DemoBadge, Panel, SeriesChart, StarButton, TickerLogo } from "@/components/fin/primitives";
import { INDICATORS, demoSeries, getStock } from "@/lib/demo-data";
import { brl, compact, num } from "@/lib/format";

export const Route = createFileRoute("/mercado/$ticker")({
  loader: ({ params }) => {
    const stock = getStock(params.ticker);
    if (!stock) throw notFound();
    return { stock };
  },
  head: ({ loaderData }) => {
    const t = loaderData ? `${loaderData.stock.ticker} — ${loaderData.stock.name} | PregãoIA` : "Ação não encontrada | PregãoIA";
    const d = loaderData ? `Indicadores e gráfico demonstrativo de ${loaderData.stock.name}.` : "Ação não encontrada.";
    return { meta: [{ title: t }, { name: "description", content: d }, { property: "og:title", content: t }, { property: "og:description", content: d }] };
  },
  notFoundComponent: () => (
    <div className="py-20 text-center">
      <p className="text-lg font-semibold">Ação não encontrada</p>
      <Button asChild className="mt-4"><Link to="/mercado">Voltar ao mercado</Link></Button>
    </div>
  ),
  component: Detail,
});

function Detail() {
  const { stock: s } = Route.useLoaderData();
  const series = demoSeries(s.ticker, 30, s.price / (1 + s.change / 100) * 0.95, 0.02);
  const last = series.at(-1);
  if (last) last.value = s.price;
  const tip = (k: string) => INDICATORS.find((i) => i.key === k)?.tooltip ?? "";
  const metrics = [
    { k: "pl", label: "P/L", v: num(s.pl, 1) },
    { k: "pvp", label: "P/VP", v: num(s.pvp, 1) },
    { k: "roe", label: "ROE", v: `${num(s.roe, 1)}%` },
    { k: "dy", label: "Dividend Yield", v: `${num(s.dy, 1)}%` },
  ];
  return (
    <>
      <Link to="/mercado" className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" /> Mercado</Link>
      <div className="mb-6 flex flex-wrap items-center gap-4">
        <TickerLogo ticker={s.ticker} />
        <div className="flex-1">
          <h1 className="text-2xl font-semibold">{s.ticker} <span className="text-base font-normal text-muted-foreground">{s.name}</span></h1>
          <p className="text-sm text-muted-foreground">{s.sector}</p>
        </div>
        <DemoBadge />
        <StarButton ticker={s.ticker} />
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <Panel className="lg:col-span-2">
          <div className="flex items-baseline gap-3">
            <span className="num text-3xl font-semibold">{brl(s.price)}</span>
            <Change value={s.change} icon />
          </div>
          <div className="mt-4"><SeriesChart data={series} height={280} positive={s.change >= 0} /></div>
        </Panel>
        <div className="grid gap-4">
          <Panel title="Indicadores">
            <div className="grid grid-cols-2 gap-3">
              {metrics.map((m) => (
                <div key={m.k} className="rounded-lg bg-secondary/60 p-3">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    {m.label}
                    <Tooltip><TooltipTrigger aria-label={`O que é ${m.label}`}><Info className="h-3 w-3" /></TooltipTrigger><TooltipContent className="max-w-56">{tip(m.k)}</TooltipContent></Tooltip>
                  </div>
                  <p className="num mt-1 text-lg font-semibold">{m.v}</p>
                </div>
              ))}
            </div>
            <p className="mt-3 text-xs text-muted-foreground">Volume do dia: <span className="num">{compact(s.volume)}</span></p>
          </Panel>
          <Panel title="Sobre a empresa"><p className="text-sm leading-relaxed text-muted-foreground">{s.about}</p></Panel>
        </div>
      </div>
      <div className="mt-5 flex flex-wrap items-center gap-4"><Button asChild><Link to="/assistente">Preparar análise</Link></Button><p className="text-xs text-muted-foreground">Fonte: amostra demonstrativa PregãoIA. Sem data de referência real; indicadores e gráfico fictícios.</p></div>
      <section className="mt-6 border-t border-border pt-5"><h2 className="font-semibold">Resultados, endividamento e histórico financeiro</h2><p className="mt-2 text-sm text-muted-foreground">Indisponíveis até a integração com fontes verificáveis. Nenhum balanço ou conclusão foi gerado.</p></section>
    </>
  );
}
