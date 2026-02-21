# QuantEdge — Trading Analytics Dashboard

A production-grade full-stack Trading Analytics Dashboard built with React, Redux Toolkit, Node.js, and Recharts.

---

## Tech Stack

| Layer      | Technology                                  |
|------------|---------------------------------------------|
| Frontend   | React 18, Redux Toolkit, Recharts, Axios    |
| Styling    | Plain CSS (CSS custom properties, no framework) |
| Backend    | Node.js, Express.js, REST APIs              |
| Data       | Mock financial market data (JSON-based)      |
| Fonts      | JetBrains Mono (data), Syne (UI)            |

---

## Project Structure

```
trading-dashboard/
├── package.json              ← Frontend dependencies (React)
├── public/
│   └── index.html
├── src/
│   ├── App.js
│   ├── index.js
│   ├── index.css             ← Global CSS variables, reset
│   ├── components/
│   │   ├── Card.jsx          ← Reusable card container
│   │   ├── ChartContainer.jsx← Chart wrapper with header
│   │   ├── DataTable.jsx     ← Generic sortable table with skeleton loader
│   │   ├── MetricCard.jsx    ← KPI metric display with P&L change
│   │   ├── Navbar.jsx        ← Top nav with live clock + market status
│   │   └── SymbolTicker.jsx  ← Clickable ticker pill
│   ├── pages/
│   │   └── Dashboard.jsx     ← Main dashboard (all sections)
│   ├── redux/
│   │   ├── store.js
│   │   └── slices/
│   │       ├── marketDataSlice.js  ← createAsyncThunk for market data
│   │       ├── portfolioSlice.js   ← createAsyncThunk for portfolio
│   │       └── tradesSlice.js      ← createAsyncThunk + filters for trades
│   └── services/
│       └── api.js            ← Axios instance + service methods
└── server/
    ├── package.json
    ├── index.js              ← Express app entry point
    ├── routes/
    │   ├── marketData.js     ← GET /api/market-data, GET /api/market-data/:symbol
    │   ├── portfolio.js      ← GET /api/portfolio
    │   └── trades.js         ← GET /api/trades (with query params)
    └── data/
        ├── marketData.js     ← 8 symbols, 90 OHLCV data points each
        ├── portfolioData.js  ← 8 positions, 30-day equity curve
        └── tradesData.js     ← 50 realistic trade records
```

---

## Setup & Run

### Prerequisites
- Node.js v18+
- npm v9+

### Step 1 — Install Backend Dependencies
```bash
cd server
npm install
```

### Step 2 — Start the Backend Server
```bash
# From the server/ directory
npm start
# or for auto-reload:
npm run dev
```
Server runs at: **http://localhost:5000**

### Step 3 — Install Frontend Dependencies
```bash
# From the project root (trading-dashboard/)
npm install
```

### Step 4 — Start the React App
```bash
npm start
```
App runs at: **http://localhost:3000**

> The `"proxy": "http://localhost:5000"` in `package.json` forwards all `/api/*` requests to the Express server — no CORS issues during development.

---

## API Endpoints

| Method | Endpoint                      | Description                              |
|--------|-------------------------------|------------------------------------------|
| GET    | `/api/health`                 | Server health check                      |
| GET    | `/api/market-data`            | All 8 symbols — price, change, volume    |
| GET    | `/api/market-data/:symbol`    | Symbol detail + 90 historical OHLCV pts  |
| GET    | `/api/portfolio`              | Portfolio summary, positions, 30D curve  |
| GET    | `/api/trades`                 | Trade history (supports `limit`, `offset`, `symbol`, `side`, `status` query params) |

---

## Features

### Dashboard
- **Symbol Ticker Bar** — 8 live symbols (AAPL, MSFT, NVDA, etc.) with % change, click to load chart
- **Portfolio Summary** — 6 KPI metric cards: total value, equity, cash, unrealized P&L, day P&L, Sharpe ratio
- **Price Chart** — Area chart with gradient fill, custom tooltip, 7.5 hours of 5-min interval data
- **Portfolio Equity Curve** — 30-day area chart showing portfolio growth
- **Open Positions Table** — All positions with unrealized P&L, day change, weight, sector
- **Trade History Table** — 20 most recent trades with status badges, P&L, notional value

### State Management (Redux Toolkit)
- `marketDataSlice` — `fetchMarketData`, `fetchSymbolDetail` thunks; selected symbol tracking
- `portfolioSlice` — `fetchPortfolio` thunk
- `tradesSlice` — `fetchTrades` thunk with filter support; `setFilter` / `clearFilters` actions

### Auto-refresh
Market data and portfolio refresh every 60 seconds automatically.

### UI
- Dark fintech theme — deep navy/charcoal palette, `#00d4aa` accent
- Live market status indicator (NYSE open/closed based on ET time)
- Skeleton loaders for all data-dependent UI
- Sticky table headers, horizontal scroll for wide tables
- Responsive grid: 6-col → 3-col → 2-col metrics on smaller viewports

---

## Design Decisions

- **No Tailwind / UI kits** — every style is hand-crafted CSS with custom properties
- **Separation of concerns** — services handle HTTP, slices handle state, components are pure presentational
- **Realistic mock data** — prices, P&L, commissions, and historical curves are all algorithmically generated to look authentic
- **Error boundaries** — each thunk uses `rejectWithValue` for predictable error state
