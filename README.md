# Flyzer Dashboard

A Next.js 15 portfolio tracking dashboard for crypto, NFT, and derivative assets. Provides distribution visualizations, holdings tracking, profit/loss calculations, and trend charts.
This project is purely frontend. 

---

## Architecture

```
dashboard/
└── webfrontend/                  # Next.js application
    ├── src/
    │   ├── app/                  # Next.js App Router
    │   │   ├── tracker/          # Main dashboard shell (sidebar layout)
    │   │   │   ├── (distribution)/   # Asset distribution pages
    │   │   │   ├── dashboard/
    │   │   │   ├── transactions/
    │   │   │   ├── nfts/
    │   │   │   ├── defi/
    │   │   │   ├── watchlist/
    │   │   │   ├── snapshots/
    │   │   │   ├── explorer/
    │   │   │   ├── derivatives/
    │   │   │   ├── reports/
    │   │   │   └── settings/
    │   │   └── api/logging/      # Next.js API route for log ingestion
    │   ├── api/                  # Mock API (Mockoon config + Dockerfile)
    │   │   ├── Dockerfile
    │   │   └── flyzer-api.json
    │   └── utility/lib/          # Shared library
    │       ├── data-fetching/    # React Query hooks & fetch layer
    │       ├── data-table/       # TanStack Table components & column defs
    │       ├── charts/           # Chart.js components
    │       ├── page-components/  # Page-specific UI components
    │       ├── trackerlayout/    # Sidebar & header layout components
    │       ├── stores/           # Zustand client state
    │       ├── types/            # TypeScript interfaces
    │       ├── helpers/          # Utility/formatter functions
    │       └── logging/          # OpenTelemetry tracing & Pino logger
    └── __tests__/                # Jest test suite (mirrors src structure)
```

### Key Technology Choices

| Concern | Library |
|---|---|
| Framework | Next.js 15 (App Router) |
| UI | React 18, Tailwind CSS, shadcn/ui |
| Tables | TanStack React Table v8 |
| Charts | Chart.js 4 + react-chartjs-2 |
| Server state | TanStack React Query v5 |
| Client state | Zustand v5 |
| HTTP | fetch (queries), Axios (mutations) |
| Observability | OpenTelemetry + Pino + Pino-Loki |

---

## Running Locally

### 1. Start the mock API

The mock API is a Mockoon CLI container that serves portfolio data on port 3001.

```bash
cd webfrontend

# Build the image
docker build -f src/api/Dockerfile -t flyzer-api:latest .

# Run the container
docker run -p 3001:3001 flyzer-api:latest
```

The mock API exposes:

| Endpoint | Description |
|---|---|
| `GET /1` | Full asset distribution for portfolio 1 |
| `GET /1/assetgroups` | Asset group distribution |
| `GET /1/holdings` | Holdings distribution |

### 2. Start the dev server

```bash
cd webfrontend

npm install
npm run dev
```

The app is available at `http://localhost:3000`. It expects the mock API running at `http://localhost:3001`.

### Other Useful Commands

```bash
npm run build       # Production build
npm start           # Start production server
npm run lint        # ESLint
npm run docs        # Generate TypeDoc API documentation
```

---

## Test Strategy

Tests live in `webfrontend/__tests__/` and mirror the `src/utility/lib/` structure. The suite uses Jest 29 with jsdom, React Testing Library, and jest-fetch-mock.

### Test Types

**Unit tests** cover isolated logic:
- `__helper__/` — formatter and utility functions
- `__charts__/` — chart component rendering
- `__data-fetching__/layer.test.*` — fetch layer with mocked fetch

**Integration tests** wire multiple layers together:
- `__data-table__/integration.test.jsx` — full `AssetTableComponent` with a live `QueryClient`, exercising filtering, sorting, and row expansion end-to-end
- `__data-fetching__/client-hooks.test.jsx` — React Query hooks against a mocked API layer
- `__pages__/assetdistribution.test.jsx` — page-level component with data fetching

**Snapshot tests** guard layout structure:
- `layout.test.jsx` — sidebar folded/unfolded states

### Running Tests

```bash
npm run test          # Run all tests with coverage (clover.xml + lcov)
npm run test:watch    # Watch mode
npm run clearj        # Clear Jest cache
```

Coverage reports are written to `webfrontend/coverage/`. Current statement coverage is ~83%.

### What is Not Covered

- No end-to-end tests (e.g. Playwright/Cypress)
- No CI pipeline configured — tests must be run locally
