# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start dev server (port 3000)
npm run build        # Production build
npm run lint         # ESLint
npm run test         # Jest with coverage
npm run test:watch   # Jest watch mode
npm run clearj       # Clear Jest cache
npm run docs         # Generate TypeDoc docs
```

## Architecture

**Flyzer** — a Next.js 15 (App Router) portfolio tracking dashboard for crypto, NFT, and derivative assets.

### Stack
- **UI**: React 18, Tailwind CSS 3.4, shadcn/ui primitives
- **Server state**: TanStack React Query v5
- **Client state**: Zustand v5 (sync status only)
- **Tables**: TanStack React Table v8
- **Charts**: Chart.js + react-chartjs-2
- **HTTP**: Axios (mutations), native fetch (queries)
- **Observability**: OpenTelemetry + Pino → Grafana Loki

### Code Organization

```
src/
  app/                        # Next.js App Router pages
    tracker/                  # Main app (sidebar layout)
      (distribution)/         # Route group: asset/group/holdings distribution pages
  utility/lib/
    data-fetching/            # React Query hooks + API layer
    types/                    # TypeScript interfaces
    charts/                   # Chart components
    data-table/               # Table components + column defs
    page-components/          # Distribution page components
    trackerlayout/            # Sidebar + header
    stores/                   # Zustand stores
    helpers/                  # Utility functions
    logging/                  # Tracing + logger setup
```

### Data Fetching Pattern

API calls live in `src/utility/lib/data-fetching/layer.tsx` and call `http://localhost:3001/{portfolioId}` (portfolioId hardcoded as `"1"`).

Custom React Query hooks in `client-hooks.tsx` wrap all queries/mutations. Error convention: functions return `["failed", error]` on failure.

Query keys follow the pattern `["PortfolioAD", "Assets"]`, `["PortfolioAD", "Holdings"]`, etc.

### Asset Type System

Assets use a discriminated union: `Asset = CryptoAsset | NFTAsset | DerivativeAsset`, narrowed via the `assettype` field. All distribution components handle these three variants.

### Path Alias

`@/*` maps to `src/*` — use for all imports.
