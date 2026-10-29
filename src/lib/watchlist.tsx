import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { toast } from "sonner";

const KEY = "demo-watchlist";
const DEFAULT = ["PETR4", "VALE3", "ITUB4", "WEGE3"];

type Ctx = { list: string[]; has: (t: string) => boolean; toggle: (t: string) => void; add: (t: string) => void; remove: (t: string) => void };
const WatchCtx = createContext<Ctx | null>(null);

export function WatchlistProvider({ children }: { children: ReactNode }) {
  const [list, setList] = useState<string[]>(DEFAULT);
  useEffect(() => {
    const raw = localStorage.getItem(KEY);
    if (raw) try { setList(JSON.parse(raw)); } catch { /* ignore */ }
  }, []);
  const save = (l: string[]) => { setList(l); localStorage.setItem(KEY, JSON.stringify(l)); };
  const add = (t: string) => { if (!list.includes(t)) { save([...list, t]); toast.success(`${t} adicionada à sua lista`); } };
  const remove = (t: string) => { save(list.filter((x) => x !== t)); toast(`${t} removida da sua lista`); };
  const has = (t: string) => list.includes(t);
  const toggle = (t: string) => (has(t) ? remove(t) : add(t));
  return <WatchCtx.Provider value={{ list, has, toggle, add, remove }}>{children}</WatchCtx.Provider>;
}

export function useWatchlist() {
  const c = useContext(WatchCtx);
  if (!c) throw new Error("WatchlistProvider ausente");
  return c;
}
