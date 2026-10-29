import { createFileRoute } from "@tanstack/react-router";
import { Info, Lightbulb } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { PageHeader } from "@/components/fin/primitives";
import { INDICATORS } from "@/lib/demo-data";

export const Route = createFileRoute("/indicadores")({
  head: () => ({
    meta: [
      { title: "Indicadores financeiros — PregãoIA" },
      { name: "description", content: "Aprenda P/L, P/VP, ROE, Dividend Yield e Dívida Líquida/EBITDA com exemplos simples." },
      { property: "og:title", content: "Indicadores financeiros — PregãoIA" },
      { property: "og:description", content: "Aprenda P/L, P/VP, ROE, Dividend Yield e Dívida Líquida/EBITDA com exemplos simples." },
    ],
  }),
  component: Indicadores,
});

function Indicadores() {
  return (
    <>
      <PageHeader title="Indicadores financeiros" subtitle="Entenda os números que ajudam a avaliar uma empresa — sem complicação." />
      <div className="grid gap-4 md:grid-cols-2">
        {INDICATORS.map((i) => (
          <article key={i.key} className="panel p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="num text-2xl font-semibold text-primary">{i.name}</h2>
                <p className="text-sm text-muted-foreground">{i.short}</p>
              </div>
              <Tooltip>
                <TooltipTrigger aria-label={`Resumo de ${i.name}`} className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground"><Info className="h-4 w-4" /></TooltipTrigger>
                <TooltipContent className="max-w-60">{i.tooltip}</TooltipContent>
              </Tooltip>
            </div>
            <p className="mt-4 text-sm leading-relaxed">{i.explanation}</p>
            <div className="mt-4 rounded-lg border border-border bg-secondary/50 p-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Exemplo</p>
              <p className="num mt-1 text-sm">{i.example}</p>
            </div>
            <p className="mt-4 flex gap-2 text-sm text-muted-foreground"><Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-gold" />{i.reading}</p>
          </article>
        ))}
      </div>
    </>
  );
}
