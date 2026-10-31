import { createContext, useContext, useState, type ReactNode } from "react";
import { EMPTY_PROFILE, type AnalysisRequest, type InvestorProfile, type AnalysisRecord, type FundamentalAlert } from "@/lib/analysis";

type Workspace = {
  profile: InvestorProfile;
  saveProfile: (profile: InvestorProfile) => void;
  requests: AnalysisRequest[];
  prepareRequest: (input: Pick<AnalysisRequest, "tickers" | "mode" | "question">) => void;
  analyses: readonly AnalysisRecord[];
  alerts: readonly FundamentalAlert[];
};
const Context = createContext<Workspace | null>(null);

// Session-only preparation: no financial/personal information in browser storage.
export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const [profile, saveProfile] = useState<InvestorProfile>({ ...EMPTY_PROFILE });
  const [requests, setRequests] = useState<AnalysisRequest[]>([]);
  const prepareRequest: Workspace["prepareRequest"] = (input) => {
    const request: AnalysisRequest = {
      ...input, tickers: [...input.tickers], id: crypto.randomUUID(), createdAt: new Date().toISOString(),
      profile: { ...profile }, status: "awaiting_integrations",
    };
    setRequests((current) => [...current, request]);
  };
  return <Context.Provider value={{ profile, saveProfile, requests, prepareRequest, analyses: [], alerts: [] }}>{children}</Context.Provider>;
}
export function useWorkspace() {
  const context = useContext(Context);
  if (!context) throw new Error("WorkspaceProvider ausente");
  return context;
}