import { STOCKS, type Stock } from "@/lib/demo-data";

export const MARKET_STATUS = { kind: "demo", source: "Amostra demonstrativa PregãoIA", referenceDate: null } as const;
const ALIASES: Record<string, string[]> = {
  PETR4: ["Petrobras", "Petróleo Brasileiro"], VALE3: ["Vale", "Vale do Rio Doce"],
  ITUB4: ["Itaú", "Itau", "Itaú Unibanco"], BBDC4: ["Bradesco"], BBAS3: ["Banco do Brasil", "BB"],
  WEGE3: ["WEG"], ABEV3: ["Ambev"], MGLU3: ["Magalu", "Magazine Luiza"],
  RENT3: ["Localiza", "Localiza Hertz"], ELET3: ["Eletrobras", "Centrais Elétricas Brasileiras"],
  SUZB3: ["Suzano"], TAEE11: ["Taesa", "Transmissora Aliança de Energia Elétrica"],
};
export const normalizeSearch = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
export function searchStocks(query: string, stocks: Stock[] = STOCKS): Stock[] {
  const words = normalizeSearch(query).split(/\s+/).filter(Boolean);
  return stocks.filter((s) => {
    const searchable = normalizeSearch([s.ticker, s.name, ...(ALIASES[s.ticker] ?? [])].join(" "));
    return words.every((word) => searchable.includes(word));
  });
}