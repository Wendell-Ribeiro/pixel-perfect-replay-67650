export const brl = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
export const pct = (v: number) =>
  `${v > 0 ? "+" : ""}${v.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%`;
export const num = (v: number, d = 0) =>
  v.toLocaleString("pt-BR", { minimumFractionDigits: d, maximumFractionDigits: d });
export const dateBR = (iso: string) => new Date(iso).toLocaleDateString("pt-BR");
export const dateTimeBR = (iso: string) =>
  new Date(iso).toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
export const compact = (v: number) =>
  "R$ " + v.toLocaleString("pt-BR", { notation: "compact", maximumFractionDigits: 1 });
