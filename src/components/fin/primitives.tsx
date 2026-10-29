import { Link } from "@tanstack/react-router";
import { Star, TrendingDown, TrendingUp } from "lucide-react";
import type { ReactNode } from "react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { cn } from "@/lib/utils";
import { pct, brl, dateBR, num } from "@/lib/format";
import { useWatchlist } from "@/lib/watchlist";
import type { Stock } from "@/lib/demo-data";

export function PageHeader({ title, subtitle, actions }: { title: string; subtitle?: string; actions?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-semibold sm:text-3xl">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {actions}
    </div>
  );
}

export function Panel({ title, action, children, className }: { title?: string; action?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={cn("panel p-5", className)}>
      {(title || action) && (
        <div className="mb-4 flex items-center justify-between gap-2">
          {title && <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">{title}</h2>}
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

export function Change({ value, className, icon = false }: { value: number; className?: string; icon?: boolean }) {
  const up = value >= 0;
  const I = up ? TrendingUp : TrendingDown;
  return (
    <span className={cn("num inline-flex items-center gap-1 font-medium", up ? "text-gain" : "text-loss", className)}>
      {icon && <I className="h-3.5 w-3.5" />}
      {pct(value)}
    </span>
  );
}

export function DemoBadge({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center rounded-full border border-gold/40 bg-gold/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-gold", className)}>
      Dados demonstrativos
    </span>
  );
}

export function TickerLogo({ ticker }: { ticker: string }) {
  return (
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary font-display text-[11px] font-bold text-foreground">
      {ticker.slice(0, 2)}
    </div>
  );
}

export function StarButton({ ticker }: { ticker: string }) {
  const { has, toggle } = useWatchlist();
  const on = has(ticker);
  return (
    <button
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggle(ticker); }}
      aria-label={on ? `Remover ${ticker} da lista` : `Adicionar ${ticker} à lista`}
      className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-gold"
    >
      <Star className={cn("h-4 w-4", on && "fill-gold text-gold")} />
    </button>
  );
}

export function StockRow({ s }: { s: Stock }) {
  return (
    <Link
      to="/mercado/$ticker"
      params={{ ticker: s.ticker }}
      className="flex items-center gap-3 rounded-lg px-2 py-2.5 transition-colors hover:bg-accent"
    >
      <TickerLogo ticker={s.ticker} />
      <div className="min-w-0 flex-1">
        <div className="font-semibold">{s.ticker}</div>
        <div className="truncate text-xs text-muted-foreground">{s.name}</div>
      </div>
      <div className="text-right">
        <div className="num text-sm">{brl(s.price)}</div>
        <Change value={s.change} className="text-xs" />
      </div>
    </Link>
  );
}

export function SeriesChart({ data, height = 240, positive = true, compact = false }: { data: { date: string; value: number }[]; height?: number; positive?: boolean; compact?: boolean }) {
  const color = positive ? "var(--gain)" : "var(--loss)";
  const id = `g-${positive ? "up" : "dn"}-${compact ? "c" : "f"}`;
  return (
    <div style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.35} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          {!compact && (
            <>
              <XAxis dataKey="date" tickFormatter={(d) => dateBR(d).slice(0, 5)} tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} axisLine={false} tickLine={false} minTickGap={30} />
              <YAxis domain={["auto", "auto"]} tickFormatter={(v) => num(v)} tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} axisLine={false} tickLine={false} width={64} orientation="right" />
              <Tooltip
                contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }}
                labelStyle={{ color: "var(--muted-foreground)" }}
                labelFormatter={(d) => dateBR(String(d))}
                formatter={(v: number) => [num(v, 2), "Valor"]}
              />
            </>
          )}
          <Area type="monotone" dataKey="value" stroke={color} strokeWidth={2} fill={`url(#${id})`} dot={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
