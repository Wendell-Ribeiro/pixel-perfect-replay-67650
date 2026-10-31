import { ShieldAlert } from "lucide-react";

export function Readiness({ children }: { children: React.ReactNode }) {
  return <div role="status" className="mb-4 flex items-start gap-3 rounded-lg border border-gold/30 bg-gold/10 p-4 text-sm text-muted-foreground"><ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-gold" /><div className="min-w-0">{children}</div></div>;
}