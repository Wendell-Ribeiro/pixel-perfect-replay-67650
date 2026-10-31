import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Change, DemoBadge, PageHeader, SeriesChart, TickerLogo } from "@/components/fin/primitives";
import { STOCKS, demoSeries, getStock } from "@/lib/demo-data";
import { brl } from "@/lib/format";
import { useWatchlist } from "@/lib/watchlist";

export const Route = createFileRoute("/acompanhamento")({
  head: () => ({
    meta: [
      { title: "Minha lista de acompanhamento — PregãoIA" },
      { name: "description", content: "Acompanhe suas ações favoritas em um só lugar." },
      { property: "og:title", content: "Minha lista de acompanhamento — PregãoIA" },
      { property: "og:description", content: "Acompanhe suas ações favoritas em um só lugar." },
    ],
  }),
  component: Watch,
});

function Watch() {
  const { list, add, remove } = useWatchlist();
  const [pick, setPick] = useState("");
  const available = STOCKS.filter((s) => !list.includes(s.ticker));
  return (
    <>
      <PageHeader title="Minha lista" subtitle="Suas ações favoritas, sempre à mão." actions={<DemoBadge />} />
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3"><p className="text-xs text-muted-foreground">Lista demonstrativa salva neste navegador. Cotações fictícias; monitoramento automático não ativo.</p><Button asChild variant="outline" size="sm"><Link to="/alertas">Ver alertas</Link></Button></div>
      <div className="panel mb-4 flex flex-col gap-3 p-4 sm:flex-row">
        <Select value={pick} onValueChange={setPick}>
          <SelectTrigger className="sm:w-80"><SelectValue placeholder="Escolha uma ação para adicionar" /></SelectTrigger>
          <SelectContent>{available.map((s) => <SelectItem key={s.ticker} value={s.ticker}>{s.ticker} — {s.name}</SelectItem>)}</SelectContent>
        </Select>
        <Button disabled={!pick} onClick={() => { add(pick); setPick(""); }}><Plus className="h-4 w-4" /> Adicionar</Button>
      </div>
      {list.length === 0 ? (
        <div className="panel py-16 text-center">
          <p className="text-muted-foreground">Nenhuma ação na sua lista ainda.</p>
          <Button asChild variant="secondary" className="mt-4"><Link to="/mercado">Explorar mercado</Link></Button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {list.map((t) => {
            const s = getStock(t);
            if (!s) return null;
            return (
              <div key={t} className="panel p-4">
                <div className="flex items-center gap-3">
                  <TickerLogo ticker={t} />
                  <Link to="/mercado/$ticker" params={{ ticker: t }} className="flex-1 hover:text-primary">
                    <p className="font-semibold">{t}</p>
                    <p className="text-xs text-muted-foreground">{s.name}</p>
                  </Link>
                  <Button variant="ghost" size="icon" onClick={() => remove(t)} aria-label={`Remover ${t}`} className="text-muted-foreground hover:bg-loss/15 hover:text-loss"><Trash2 className="h-4 w-4" /></Button>
                </div>
                <div className="mt-3"><SeriesChart data={demoSeries(t, 20)} height={60} positive={s.change >= 0} compact /></div>
                <div className="mt-2 flex items-baseline justify-between">
                  <span className="num text-lg font-semibold">{brl(s.price)}</span>
                  <Change value={s.change} icon />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
