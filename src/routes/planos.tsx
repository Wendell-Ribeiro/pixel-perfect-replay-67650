import { createFileRoute } from "@tanstack/react-router";
import { Check, Crown } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/fin/primitives";
import { PLAN_PRICES } from "@/lib/plans";
import { brl } from "@/lib/format";

export const Route = createFileRoute("/planos")({
  head: () => ({ meta: [
    { title: "Gratuito e Premium R$ 25,90/mês — PregãoIA" },
    { name: "description", content: "Conheça o Premium PregãoIA: análises de ações da B3, contexto do investidor, comparação e acompanhamento por R$ 25,90 ao mês." },
    { property: "og:title", content: "Planos PregãoIA — Premium R$ 25,90/mês" },
    { property: "og:description", content: "Experiência completa de inteligência artificial para analisar ações da Bolsa brasileira. Assinaturas ainda indisponíveis." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }), component: Planos,
});
const FREE = ["Visualização geral do mercado", "Pesquisa de ações da B3", "Consultas básicas de empresas", "Consultas limitadas ao Assistente IA", "Acompanhamento limitado de ações favoritas", "Notícias e guia de indicadores"];
const PREMIUM = [
  { title: "Inteligência artificial", rows: ["Assistente especializado em ações da B3", "Análises aprofundadas e perguntas sobre empresas", "Comparação de empresas e indicadores", "Pontos positivos, pontos de atenção e riscos"] },
  { title: "Seu contexto de investidor", rows: ["Objetivos, horizonte e tolerância ao risco", "Capacidade de investimento e aporte mensal", "Preferências e restrições informadas por você"] },
  { title: "Análise fundamentalista", rows: ["Lucratividade, rentabilidade e crescimento", "Endividamento, valuation e dividendos", "Histórico financeiro e comparação setorial"] },
  { title: "Acompanhamento", rows: ["Lista de favoritas sem limite artificial", "Monitoramento e alertas de mudanças relevantes", "Notícias das empresas e atualização de análises"] },
  { title: "Histórico e relatórios", rows: ["Histórico completo e comparação de análises", "Justificativas e riscos identificados", "Datas e fontes dos dados utilizados"] },
];
function Planos() {
  return <>
    <PageHeader title="Planos e assinatura" subtitle="Sua inteligência para investir melhor começa aqui. Análises da Bolsa com tecnologia, dados e inteligência artificial." />
    <p className="mb-6 text-sm text-gold">Oferta prevista. Serviços de IA, dados reais, alertas e assinaturas ainda não estão ativos.</p>
    <div className="grid max-w-5xl items-start gap-4 md:grid-cols-2">
      <div className="panel flex flex-col p-6"><h2 className="text-lg font-semibold">Gratuito</h2><p className="mt-1 text-sm text-muted-foreground">Acesso inicial ao PregãoIA.</p><p className="num mt-6 text-4xl font-semibold">{brl(PLAN_PRICES.free)}</p><ul className="mt-6 space-y-3 text-sm">{FREE.map((f) => <li key={f} className="flex gap-2"><Check className="mt-0.5 shrink-0 text-gain" />{f}</li>)}</ul><p className="mt-5 text-xs text-muted-foreground">Limites de consultas e favoritos serão definidos antes da ativação. Não há cotas arbitrárias nesta prévia.</p><Button variant="secondary" className="mt-6" disabled>Prévia do plano Gratuito</Button></div>
      <div className="bg-premium flex flex-col rounded-xl border border-gold/40 p-6"><div className="flex flex-wrap items-center justify-between gap-2"><h2 className="flex items-center gap-2 text-lg font-semibold"><Crown className="text-gold" />Premium</h2><span className="rounded bg-gold px-2.5 py-1 text-xs font-semibold text-gold-foreground">Experiência completa</span></div>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">Tenha acesso à experiência completa de inteligência artificial para analisar ações da Bolsa brasileira. Receba análises aprofundadas e personalizadas conforme seu perfil, acompanhe empresas, compare indicadores e identifique mudanças relevantes no mercado.</p>
        <p className="num mt-6 text-4xl font-semibold">{brl(PLAN_PRICES.premiumMonthly ?? 25.90)}<span className="text-base font-normal text-muted-foreground">/mês</span></p><p className="mt-1 text-xs text-muted-foreground">Cobrança mensal · acesso completo às funcionalidades Premium quando ativadas</p>
        <Button onClick={() => toast("Assinaturas ainda indisponíveis", { description: "Nenhum pagamento será processado. O preço previsto é R$ 25,90 por mês." })} className="mt-6 bg-gold text-gold-foreground hover:opacity-90"><Crown />Assinar Premium</Button>
        <div className="mt-6 space-y-5">{PREMIUM.map((group) => <section key={group.title}><h3 className="mb-2 text-sm font-semibold text-gold">{group.title}</h3><ul className="space-y-2 text-sm">{group.rows.map((f) => <li key={f} className="flex gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-gold" />{f}</li>)}</ul></section>)}</div>
      </div>
    </div>
    <p className="mt-6 max-w-4xl text-xs leading-relaxed text-muted-foreground">Nenhum pagamento é processado nesta etapa. Investir em ações envolve riscos e não há garantia de rentabilidade. Recomendações personalizadas comerciais não serão disponibilizadas antes da validação regulatória e da participação dos profissionais habilitados necessários.</p>
  </>;
}
