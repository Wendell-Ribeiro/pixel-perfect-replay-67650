<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Demo market data lives in `src/lib/demo-data.ts` and plan prices in `src/lib/plans.ts`; pages import from there so real data/APIs can replace them in one place later.
- Shared app shell (sidebar + mobile bottom nav) is `src/components/fin/AppShell.tsx`, mounted in `__root.tsx`; reusable finance UI lives in `src/components/fin/primitives.tsx`.
- Use browser-safe contracts in `src/lib/analysis.ts` for sourced financial snapshots, externally calculated metrics, analysis engines and append-only history; providers must remain separate so future integrations cannot turn demo data into verified results.
- Keep investor context and prepared requests in the session-only WorkspaceProvider until real persistence is authorized; do not store sensitive profile amounts in browser storage or represent prepared requests as completed analyses.
- Resolve market discovery through `src/lib/market.ts`, keeping alias search separate from demonstration quotes so a licensed catalog can replace it without changing the pages.
