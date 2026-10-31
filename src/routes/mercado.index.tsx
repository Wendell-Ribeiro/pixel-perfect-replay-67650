import { createFileRoute, Link } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Change, DemoBadge, PageHeader, StarButton, TickerLogo } from "@/components/fin/primitives";
import { SECTORS, STOCKS } from "@/lib/demo-data";
import { brl } from "@/lib/format";
import { searchStocks } from "@/lib/market";

export const Route = createFileRoute("/mercado/")({
  head: () => ({
    meta: [
      { title: "Mercado de ações — PregãoIA" },
      { name: "description", content: "Pesquise e filtre ações da B3 por setor e variação diária." },
      { property: "og:title", content: "Mercado de ações — PregãoIA" },
      { property: "og:description", content: "Pesquise e filtre ações da B3 por setor e variação diária." },
    ],
  }),
  component: Mercado,
});

function Mercado() {
  const [q, setQ] = useState("");
  const [sector, setSector] = useState("todos");
  const [dir, setDir] = useState("todas");
  const rows = useMemo(() => {
    return searchStocks(q).filter((s) =>
      (sector === "todos" || s.sector === sector) &&
      (dir === "todas" || (dir === "alta" ? s.change >= 0 : s.change < 0)));
  }, [q, sector, dir]);

  return (
    <>
      <PageHeader title="Mercado de ações" subtitle="Explore as principais ações da bolsa brasileira." actions={<DemoBadge />} />
      <p className="mb-4 text-sm text-muted-foreground">Amostra de {STOCKS.length} ações. Preços e indicadores fictícios, sem data de mercado real. Catálogo completo da B3 e cotações reais ainda não conectados.</p>
      <div className="panel mb-4 flex flex-col gap-3 p-4 md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input aria-label="Buscar ações" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Ticker, empresa ou nome conhecido (ex.: Magalu)" className="pl-9" />
        </div>
        <Select value={sector} onValueChange={setSector}>
          <SelectTrigger className="md:w-52"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos os setores</SelectItem>
            {SECTORS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={dir} onValueChange={setDir}>
          <SelectTrigger className="md:w-44"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="todas">Todas as variações</SelectItem>
            <SelectItem value="alta">Em alta</SelectItem>
            <SelectItem value="baixa">Em baixa</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <p className="mb-3 text-xs text-muted-foreground">{rows.length} ações encontradas na amostra demonstrativa.</p>

      <div className="panel overflow-x-auto">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground">
              <th className="px-4 py-3 font-medium">Ação</th>
              <th className="px-4 py-3 font-medium">Setor</th>
              <th className="px-4 py-3 text-right font-medium">Preço</th>
              <th className="px-4 py-3 text-right font-medium">Var. dia</th>
              <th className="px-4 py-3 text-right font-medium">P/L</th>
              <th className="px-4 py-3 text-right font-medium">DY</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {rows.map((s) => (
              <tr key={s.ticker} className="border-b border-border/60 last:border-0 hover:bg-accent/40">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <TickerLogo ticker={s.ticker} />
                    <div><div className="font-semibold">{s.ticker}</div><div className="text-xs text-muted-foreground">{s.name}</div></div>
                  </div>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{s.sector}</td>
                <td className="num px-4 py-3 text-right">{brl(s.price)}</td>
                <td className="px-4 py-3 text-right"><Change value={s.change} icon /></td>
                <td className="num px-4 py-3 text-right">{s.pl.toLocaleString("pt-BR")}</td>
                <td className="num px-4 py-3 text-right">{s.dy.toLocaleString("pt-BR")}%</td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <StarButton ticker={s.ticker} />
                    <Button asChild size="sm" variant="secondary"><Link to="/mercado/$ticker" params={{ ticker: s.ticker }}>Detalhes</Link></Button>
                  </div>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr><td colSpan={7} className="px-4 py-12 text-center text-muted-foreground">Nenhuma ação encontrada nesta amostra. O catálogo completo ainda não está conectado.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
