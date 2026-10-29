import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Change, DemoBadge, Panel, PageHeader, SeriesChart, StockRow } from "@/components/fin/primitives";
import { IBOV, NEWS, STOCKS, demoSeries, getStock } from "@/lib/demo-data";
import { dateTimeBR, num, pct } from "@/lib/format";
import { useWatchlist } from "@/lib/watchlist";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — PregãoIA" },
      { name: "description", content: "Resumo do mercado, Ibovespa, ações em destaque e notícias em um só painel." },
      { property: "og:title", content: "Dashboard — PregãoIA" },
      { property: "og:description", content: "Resumo do mercado, Ibovespa, ações em destaque e notícias em um só painel." },
    ],
  }),
  component: Dashboard,
});

const ibovSeries = demoSeries("IBOV", 30, 127000, 0.009);

function Dashboard() {
  const { list } = useWatchlist();
  const sorted = [...STOCKS].sort((a, b) => b.change - a.change);
  const ups = STOCKS.filter((s) => s.change >= 0).length;
  return (
    <>
      <PageHeader title="Visão geral do mercado" subtitle="Acompanhe o pregão e aprenda enquanto investe." actions={<DemoBadge />} />

      <div className="grid gap-4 lg:grid-cols-3">
        <Panel className="lg:col-span-2">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Ibovespa · IBOV</p>
              <div className="mt-1 flex items-baseline gap-3">
                <span className="num text-3xl font-semibold sm:text-4xl">{num(IBOV.value)}</span>
                <Change value={IBOV.change} icon />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6 text-sm">
              <div><p className="text-muted-foreground">Máxima</p><p className="num">{num(IBOV.high)}</p></div>
              <div><p className="text-muted-foreground">Mínima</p><p className="num">{num(IBOV.low)}</p></div>
            </div>
          </div>
          <div className="mt-6"><SeriesChart data={ibovSeries} height={260} /></div>
          <p className="mt-2 text-xs text-muted-foreground">Evolução demonstrativa dos últimos 30 dias — não representa cotações reais.</p>
        </Panel>

        <div className="grid gap-4">
          <Panel title="Resumo do dia">
            <div className="grid grid-cols-3 gap-3 text-center">
              <Stat label="Em alta" value={String(ups)} tone="gain" />
              <Stat label="Em baixa" value={String(STOCKS.length - ups)} tone="loss" />
              <Stat label="Dólar" value="R$ 5,42" />
            </div>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-loss/40">
              <div className="h-full bg-gain" style={{ width: `${(ups / STOCKS.length) * 100}%` }} />
            </div>
          </Panel>
          <div className="bg-premium relative overflow-hidden rounded-xl border border-gold/30 p-5">
            <Sparkles className="h-6 w-6 text-gold" />
            <h3 className="mt-3 text-lg font-semibold">Assistente de IA <span className="text-gold-gradient">Premium</span></h3>
            <p className="mt-1 text-sm text-muted-foreground">Análises personalizadas de até 5 ações, de acordo com seus objetivos e perfil.</p>
            <Button asChild className="mt-4 bg-gold text-gold-foreground hover:opacity-90">
              <Link to="/assistente">Conhecer o assistente <ArrowRight className="h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Panel title="Ações em destaque" action={<Link to="/mercado" className="text-xs text-primary hover:underline">Ver todas</Link>}>
          <div className="-mx-2">{sorted.slice(0, 5).map((s) => <StockRow key={s.ticker} s={s} />)}</div>
        </Panel>
        <Panel title="Minha lista" action={<Link to="/acompanhamento" className="text-xs text-primary hover:underline">Gerenciar</Link>}>
          {list.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">Sua lista está vazia.</p>
          ) : (
            <div className="-mx-2">{list.slice(0, 5).map((t) => { const s = getStock(t); return s && <StockRow key={t} s={s} />; })}</div>
          )}
        </Panel>
        <Panel title="Notícias recentes" action={<Link to="/noticias" className="text-xs text-primary hover:underline">Ver mais</Link>}>
          <ul className="space-y-4">
            {NEWS.slice(0, 4).map((n) => (
              <li key={n.id}>
                <Link to="/noticias" className="group block">
                  <p className="text-sm font-medium leading-snug group-hover:text-primary">{n.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{n.source} · {dateTimeBR(n.date)}</p>
                </Link>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
      <p className="mt-6 text-xs text-muted-foreground">Variação média das ações listadas: {pct(STOCKS.reduce((a, s) => a + s.change, 0) / STOCKS.length)}. Todos os valores são fictícios, para fins de demonstração.</p>
    </>
  );
}

function Stat({ label, value, tone }: { label: string; value: string; tone?: "gain" | "loss" }) {
  return (
    <div className="rounded-lg bg-secondary/60 p-3">
      <p className={`num text-xl font-semibold ${tone === "gain" ? "text-gain" : tone === "loss" ? "text-loss" : ""}`}>{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}
