import { Link, useRouterState } from "@tanstack/react-router";
import { BarChart3, BookOpen, Crown, LayoutDashboard, Newspaper, Sparkles, Star, User, Menu, Clock, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, type ReactNode } from "react";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/mercado", label: "Mercado", icon: BarChart3 },
  { to: "/noticias", label: "Notícias", icon: Newspaper },
  { to: "/indicadores", label: "Indicadores", icon: BookOpen },
  { to: "/assistente", label: "Assistente IA", icon: Sparkles, premium: true },
  { to: "/acompanhamento", label: "Minha lista", icon: Star },
  { to: "/historico", label: "Histórico", icon: Clock },
  { to: "/alertas", label: "Alertas", icon: Bell },
  { to: "/planos", label: "Planos", icon: Crown },
  { to: "/perfil", label: "Perfil", icon: User },
] as const;

const MOBILE = ["/", "/mercado", "/assistente", "/acompanhamento", "/perfil"];

function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2.5">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M3 17l5-6 4 3 7-9" /></svg>
      </div>
      <span className="font-display text-lg font-semibold tracking-tight">Pregão<span className="text-primary">IA</span></span>
    </Link>
  );
}

function useActive() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  return (to: string) => (to === "/" ? path === "/" : path.startsWith(to));
}

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  const isActive = useActive();
  return (
    <nav className="flex flex-col gap-1">
      {NAV.map((n) => (
        <Link
          key={n.to}
          to={n.to}
          onClick={onNavigate}
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
            isActive(n.to) ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
          )}
        >
          <n.icon className={cn("h-4 w-4", isActive(n.to) && "text-primary")} />
          {n.label}
          {"premium" in n && <span className="ml-auto rounded bg-gold px-1.5 py-0.5 text-[9px] font-bold uppercase text-gold-foreground">Pro</span>}
        </Link>
      ))}
    </nav>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const isActive = useActive();
  return (
    <div className="min-h-screen lg:pl-64">
      <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col border-r border-sidebar-border bg-sidebar p-5 lg:flex">
        <Logo />
        <div className="mt-8 flex-1 overflow-y-auto"><NavList /></div>
        <Link to="/planos" className="bg-premium rounded-xl border border-gold/30 p-4">
          <Crown className="h-5 w-5 text-gold" />
          <p className="mt-2 text-sm font-semibold">Seja Premium</p>
          <p className="mt-1 text-xs text-muted-foreground">Inteligência especializada em ações da B3.</p>
        </Link>
      </aside>

      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-background/85 px-4 py-3 backdrop-blur lg:hidden">
        <Logo />
        <Button variant="ghost" size="icon" onClick={() => setOpen(true)} aria-label="Abrir menu"><Menu className="h-5 w-5" /></Button>
      </header>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-72 border-sidebar-border bg-sidebar p-5">
          <SheetTitle className="sr-only">Menu</SheetTitle>
          <Logo />
          <div className="mt-8"><NavList onNavigate={() => setOpen(false)} /></div>
        </SheetContent>
      </Sheet>

      <main className="mx-auto max-w-7xl px-4 pb-28 pt-6 sm:px-6 lg:px-8 lg:pb-12 lg:pt-8">{children}</main>

      <nav className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 border-t border-border bg-sidebar/95 backdrop-blur lg:hidden">
        {NAV.filter((n) => MOBILE.includes(n.to)).map((n) => (
          <Link key={n.to} to={n.to} className={cn("flex flex-col items-center gap-1 py-2.5 text-[10px] font-medium", isActive(n.to) ? "text-primary" : "text-muted-foreground")}>
            <n.icon className="h-5 w-5" />
            {n.label.replace("Assistente IA", "IA")}
          </Link>
        ))}
      </nav>
    </div>
  );
}
