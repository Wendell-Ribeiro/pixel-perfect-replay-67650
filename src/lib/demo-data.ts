export type Stock = {
  ticker: string;
  name: string;
  sector: string;
  price: number;
  change: number; // % diária
  volume: number;
  pl: number;
  pvp: number;
  roe: number;
  dy: number;
  about: string;
};

export const STOCKS: Stock[] = [
  { ticker: "PETR4", name: "Petrobras PN", sector: "Petróleo e Gás", price: 38.42, change: 1.84, volume: 1_820_000_000, pl: 4.1, pvp: 1.2, roe: 28.4, dy: 14.2, about: "Empresa integrada de energia, com atuação em exploração, produção, refino e distribuição de petróleo e derivados." },
  { ticker: "VALE3", name: "Vale ON", sector: "Mineração", price: 61.15, change: -1.27, volume: 1_340_000_000, pl: 6.3, pvp: 1.5, roe: 21.7, dy: 9.8, about: "Uma das maiores mineradoras do mundo, com destaque na produção de minério de ferro e níquel." },
  { ticker: "ITUB4", name: "Itaú Unibanco PN", sector: "Financeiro", price: 34.87, change: 0.62, volume: 980_000_000, pl: 8.9, pvp: 1.8, roe: 21.2, dy: 6.4, about: "Maior banco privado do Brasil, com operações de varejo, atacado, seguros e gestão de recursos." },
  { ticker: "BBDC4", name: "Bradesco PN", sector: "Financeiro", price: 13.21, change: -0.45, volume: 640_000_000, pl: 7.8, pvp: 0.8, roe: 11.3, dy: 8.1, about: "Banco com ampla rede de agências e forte presença em seguros." },
  { ticker: "BBAS3", name: "Banco do Brasil ON", sector: "Financeiro", price: 27.6, change: 1.12, volume: 590_000_000, pl: 4.5, pvp: 0.9, roe: 20.5, dy: 10.3, about: "Banco de economia mista com forte atuação no agronegócio." },
  { ticker: "WEGE3", name: "WEG ON", sector: "Bens Industriais", price: 42.9, change: 2.31, volume: 410_000_000, pl: 29.4, pvp: 8.9, roe: 31.1, dy: 1.7, about: "Fabricante global de motores elétricos, equipamentos de automação e energia." },
  { ticker: "ABEV3", name: "Ambev ON", sector: "Consumo", price: 12.74, change: -0.31, volume: 380_000_000, pl: 13.6, pvp: 2.3, roe: 16.8, dy: 5.9, about: "Maior cervejaria da América Latina, dona de marcas como Brahma e Skol." },
  { ticker: "MGLU3", name: "Magazine Luiza ON", sector: "Varejo", price: 9.18, change: -3.42, volume: 290_000_000, pl: -12.4, pvp: 1.1, roe: -4.2, dy: 0, about: "Varejista multicanal com forte operação de e-commerce e marketplace." },
  { ticker: "RENT3", name: "Localiza ON", sector: "Serviços", price: 44.35, change: 0.98, volume: 350_000_000, pl: 18.2, pvp: 2.1, roe: 12.4, dy: 2.2, about: "Líder em aluguel de carros e gestão de frotas no Brasil." },
  { ticker: "ELET3", name: "Eletrobras ON", sector: "Energia Elétrica", price: 41.06, change: -0.74, volume: 420_000_000, pl: 11.5, pvp: 0.7, roe: 6.8, dy: 3.1, about: "Maior companhia de geração e transmissão de energia elétrica da América Latina." },
  { ticker: "SUZB3", name: "Suzano ON", sector: "Papel e Celulose", price: 56.8, change: 1.55, volume: 260_000_000, pl: 9.7, pvp: 1.9, roe: 19.4, dy: 2.8, about: "Maior produtora mundial de celulose de eucalipto." },
  { ticker: "TAEE11", name: "Taesa Unit", sector: "Energia Elétrica", price: 35.12, change: 0.21, volume: 95_000_000, pl: 9.1, pvp: 1.6, roe: 17.9, dy: 10.9, about: "Transmissora de energia elétrica com receitas previsíveis." },
];

export const SECTORS = Array.from(new Set(STOCKS.map((s) => s.sector))).sort();

export const getStock = (ticker: string) => STOCKS.find((s) => s.ticker === ticker.toUpperCase());

// Série determinística para gráficos de demonstração
export function demoSeries(seed: string, points = 30, base = 100, vol = 0.018) {
  let h = 0;
  for (const c of seed) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  const rand = () => {
    h = (h * 1664525 + 1013904223) >>> 0;
    return h / 4294967296;
  };
  const out: { date: string; value: number }[] = [];
  let v = base;
  const start = new Date(2026, 8, 1);
  for (let i = 0; i < points; i++) {
    v = v * (1 + (rand() - 0.47) * vol * 2);
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    out.push({ date: d.toISOString(), value: Number(v.toFixed(2)) });
  }
  return out;
}

export const IBOV = { value: 131_482, change: 0.87, high: 132_010, low: 130_215 };

export type News = { id: string; title: string; summary: string; source: string; date: string; category: string };

export const NEWS_CATEGORIES = ["Mercado", "Empresas", "Economia", "Dividendos", "Internacional"];

export const NEWS: News[] = [
  { id: "1", title: "Ibovespa fecha em alta puxado por bancos e petroleiras", summary: "Índice avançou com fluxo estrangeiro positivo e expectativa de manutenção da taxa de juros.", source: "Redação Demo", date: "2026-10-28T18:10:00", category: "Mercado" },
  { id: "2", title: "Petrobras anuncia novo cronograma de investimentos", summary: "Plano prevê ampliação da produção no pré-sal nos próximos cinco anos.", source: "Jornal Exemplo", date: "2026-10-28T14:30:00", category: "Empresas" },
  { id: "3", title: "Copom sinaliza cautela com inflação de serviços", summary: "Ata da reunião reforça postura conservadora diante do cenário fiscal.", source: "Economia Demo", date: "2026-10-27T09:00:00", category: "Economia" },
  { id: "4", title: "Taesa aprova distribuição de proventos trimestrais", summary: "Valor por unit será pago aos acionistas posicionados até a data de corte.", source: "Redação Demo", date: "2026-10-26T17:45:00", category: "Dividendos" },
  { id: "5", title: "Minério de ferro recua com dados fracos da China", summary: "Queda na demanda siderúrgica pressiona papéis de mineradoras.", source: "Mundo Mercado", date: "2026-10-26T11:20:00", category: "Internacional" },
  { id: "6", title: "WEG reporta receita recorde no trimestre", summary: "Segmento de energia renovável impulsionou o crescimento das vendas externas.", source: "Jornal Exemplo", date: "2026-10-25T19:05:00", category: "Empresas" },
  { id: "7", title: "Dólar fecha estável diante de agenda esvaziada", summary: "Investidores aguardam dados de emprego dos Estados Unidos.", source: "Mundo Mercado", date: "2026-10-24T17:30:00", category: "Internacional" },
  { id: "8", title: "Bancos lideram ranking de dividendos em 2026", summary: "Setor financeiro concentra os maiores rendimentos entre as ações do índice.", source: "Economia Demo", date: "2026-10-23T08:15:00", category: "Dividendos" },
];

export type Indicator = { key: string; name: string; short: string; tooltip: string; explanation: string; example: string; reading: string };

export const INDICATORS: Indicator[] = [
  { key: "pl", name: "P/L", short: "Preço / Lucro", tooltip: "Quantos anos de lucro seriam necessários para 'pagar' o preço da ação.", explanation: "Divide o preço da ação pelo lucro por ação. Ajuda a saber se a ação está cara ou barata em relação ao quanto a empresa lucra.", example: "Ação a R$ 20,00 com lucro de R$ 2,00 por ação → P/L = 10.", reading: "P/L menor pode indicar ação barata, mas compare sempre com empresas do mesmo setor." },
  { key: "pvp", name: "P/VP", short: "Preço / Valor Patrimonial", tooltip: "Compara o preço de mercado com o patrimônio contábil da empresa.", explanation: "Mostra quanto o mercado paga por cada real de patrimônio líquido da empresa.", example: "Ação a R$ 15,00 com patrimônio de R$ 10,00 por ação → P/VP = 1,5.", reading: "Abaixo de 1 pode sugerir desconto; muito acima pode refletir expectativas altas." },
  { key: "roe", name: "ROE", short: "Retorno sobre o Patrimônio", tooltip: "Mede a eficiência da empresa em gerar lucro com o dinheiro dos acionistas.", explanation: "Lucro líquido dividido pelo patrimônio líquido, em porcentagem.", example: "Lucro de R$ 200 mi e patrimônio de R$ 1 bi → ROE = 20%.", reading: "ROE consistente acima de 15% costuma indicar boa rentabilidade." },
  { key: "dy", name: "Dividend Yield", short: "Rendimento de dividendos", tooltip: "Quanto a ação pagou em proventos em relação ao seu preço.", explanation: "Soma dos dividendos dos últimos 12 meses dividida pelo preço atual da ação.", example: "Ação a R$ 50,00 que pagou R$ 4,00 no ano → DY = 8%.", reading: "Útil para quem busca renda, mas um DY muito alto pode ser pontual." },
  { key: "div", name: "Dívida Líq./EBITDA", short: "Alavancagem", tooltip: "Em quantos anos a empresa pagaria sua dívida com a geração de caixa operacional.", explanation: "Dívida líquida dividida pelo EBITDA (lucro operacional antes de juros, impostos, depreciação e amortização).", example: "Dívida líquida de R$ 3 bi e EBITDA de R$ 1,5 bi → 2,0x.", reading: "Abaixo de 2x é geralmente confortável; acima de 3x merece atenção." },
];
