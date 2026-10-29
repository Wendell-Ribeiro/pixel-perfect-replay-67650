import { createFileRoute } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { DemoBadge, PageHeader } from "@/components/fin/primitives";
import { NEWS, NEWS_CATEGORIES } from "@/lib/demo-data";
import { dateTimeBR } from "@/lib/format";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/noticias")({
  head: () => ({
    meta: [
      { title: "Notícias do mercado — PregãoIA" },
      { name: "description", content: "Notícias do mercado financeiro separadas por categoria." },
      { property: "og:title", content: "Notícias do mercado — PregãoIA" },
      { property: "og:description", content: "Notícias do mercado financeiro separadas por categoria." },
    ],
  }),
  component: Noticias,
});

function Noticias() {
  const [cat, setCat] = useState("Todas");
  const [q, setQ] = useState("");
  const t = q.trim().toLowerCase();
  const items = NEWS.filter((n) => (cat === "Todas" || n.category === cat) && (!t || (n.title + n.summary).toLowerCase().includes(t)));
  return (
    <>
      <PageHeader title="Notícias" subtitle="O que movimenta o mercado, explicado de forma direta." actions={<DemoBadge />} />
      <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center">
        <div className="flex flex-wrap gap-2">
          {["Todas", ...NEWS_CATEGORIES].map((c) => (
            <button key={c} onClick={() => setCat(c)} className={cn("rounded-full border px-3.5 py-1.5 text-sm transition-colors", cat === c ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground hover:text-foreground")}>{c}</button>
          ))}
        </div>
        <div className="relative md:ml-auto md:w-72">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Pesquisar notícias" className="pl-9" />
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {items.map((n) => (
          <article key={n.id} className="panel flex flex-col p-5 transition-colors hover:border-primary/40">
            <span className="w-fit rounded bg-secondary px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-primary">{n.category}</span>
            <h2 className="mt-3 text-base font-semibold leading-snug">{n.title}</h2>
            <p className="mt-2 flex-1 text-sm text-muted-foreground">{n.summary}</p>
            <p className="mt-4 text-xs text-muted-foreground">{n.source} · {dateTimeBR(n.date)}</p>
          </article>
        ))}
      </div>
      {items.length === 0 && <p className="py-16 text-center text-muted-foreground">Nenhuma notícia encontrada.</p>}
    </>
  );
}
