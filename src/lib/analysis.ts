export type InvestorProfile = {
  name: string;
  objective: "" | "crescimento" | "dividendos" | "equilibrio";
  horizon: "" | "curto" | "medio" | "longo";
  risk: "" | "conservador" | "moderado" | "arrojado";
  available: string;
  monthly: string;
  preferences: string;
  restrictions: string;
};

export const EMPTY_PROFILE: InvestorProfile = {
  name: "", objective: "", horizon: "", risk: "", available: "", monthly: "", preferences: "", restrictions: "",
};

export type DataReference = {
  source: string;
  sourceUrl: string;
  referenceDate: string;
  retrievedAt: string;
  kind: "verified" | "demo";
};

export type FinancialSnapshot = {
  ticker: string;
  reference: DataReference;
  // Only externally calculated, sourced values. Missing is never zero.
  metrics: Record<string, number | null>;
};

export type AnalysisRequest = {
  id: string;
  tickers: string[];
  createdAt: string;
  question: string;
  mode: "empresa" | "comparacao" | "indicadores" | "resultados";
  profile: InvestorProfile;
  status: "awaiting_integrations";
};

export type AnalysisRecord = {
  id: string;
  requestId: string;
  tickers: string[];
  createdAt: string;
  snapshots: FinancialSnapshot[];
  criteria: string[];
  profile: InvestorProfile;
  result: {
    companySummary: string;
    positives: string[];
    cautions: string[];
    risks: string[];
    reasoning: string;
  };
};

export type FundamentalAlert = {
  id: string;
  ticker: string;
  event: "fundamentos" | "resultados" | "endividamento" | "evento" | "revisao";
  createdAt: string;
  reference: DataReference;
  analysisId: string | null;
  description: string;
};

// Integration contracts only: no provider, secrets or network calls in this stage.
export interface FinancialDataProvider {
  search(query: string): Promise<{ ticker: string; name: string; aliases: string[] }[]>;
  snapshot(ticker: string): Promise<FinancialSnapshot>;
}
export interface MetricsProcessor {
  calculate(sourcedInputs: FinancialSnapshot): Promise<FinancialSnapshot>;
}
export interface AnalysisEngine {
  analyze(request: AnalysisRequest, snapshots: FinancialSnapshot[]): Promise<AnalysisRecord>;
}
export interface AnalysisRepository {
  list(): Promise<AnalysisRecord[]>;
  append(record: AnalysisRecord): Promise<void>;
}

export function canAnalyze(snapshots: FinancialSnapshot[]): boolean {
  return snapshots.length > 0 && snapshots.every((s) =>
    s.reference.kind === "verified" && s.reference.source.trim().length > 0 &&
    /^https:\/\//.test(s.reference.sourceUrl) && Number.isFinite(Date.parse(s.reference.referenceDate)) &&
    Number.isFinite(Date.parse(s.reference.retrievedAt)));
}

export function appendAnalysis(history: readonly AnalysisRecord[], record: AnalysisRecord): AnalysisRecord[] {
  if (history.some((item) => item.id === record.id)) throw new Error("Análise já registrada; o histórico não pode ser sobrescrito.");
  return [...history, structuredClone(record)];
}