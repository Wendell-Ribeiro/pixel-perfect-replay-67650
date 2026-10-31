// Preços configuráveis — defina os valores finais aqui (null = "A definir").
export const PLAN_PRICES: { free: number; premiumMonthly: number | null; premiumYearly: number | null } = {
  free: 0,
  premiumMonthly: 25.90,
  premiumYearly: null,
};

// Undefined Free quotas are not arbitrarily invented; subscriptions are not active.
export const PLAN_LIMITS = {
  free: { aiQueries: null, watchlist: null, status: "pending_definition" },
  premium: { watchlist: Infinity, status: "not_active" },
} as const;
