import React, { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, BarChart, Bar, Legend,
} from 'recharts';

import { fetchMarketData, fetchSymbolDetail, setSelectedSymbol } from '../redux/slices/marketDataSlice';
import { fetchPortfolio } from '../redux/slices/portfolioSlice';
import { fetchTrades } from '../redux/slices/tradesSlice';

import MetricCard from '../components/MetricCard';
import ChartContainer from '../components/ChartContainer';
import DataTable from '../components/DataTable';
import Card from '../components/Card';
import SymbolTicker from '../components/SymbolTicker';

import './Dashboard.css';

const fmtCurrency = (n) =>
  n == null
    ? '--'
    : new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 2
      }).format(n);

const fmtCompact = (n) =>
  n == null
    ? '--'
    : new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        notation: 'compact',
        maximumFractionDigits: 2
      }).format(n);



const fmtTime = (iso) => {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
};

const fmtDate = (iso) => {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
};

// Custom recharts tooltip
const PriceTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip">
      <div className="chart-tooltip__time">{label}</div>
      <div className="chart-tooltip__price">{fmtCurrency(payload[0]?.value)}</div>
      {payload[1] && <div className="chart-tooltip__vol">Vol: {(payload[1]?.value / 1e6).toFixed(2)}M</div>}
    </div>
  );
};

const StatusBadge = ({ status }) => {
  const cls = {
    FILLED: 'badge--green',
    PARTIALLY_FILLED: 'badge--yellow',
    CANCELLED: 'badge--red',
  }[status] || 'badge--gray';
  return <span className={`badge ${cls}`}>{status.replace('_', ' ')}</span>;
};

const SideBadge = ({ side }) => (
  <span className={`badge ${side === 'BUY' ? 'badge--blue' : 'badge--orange'}`}>{side}</span>
);

const TRADE_COLUMNS = [
  { key: 'id', label: 'Order ID', width: 110, render: (v) => <span className="mono text-dim">{v}</span> },
  { key: 'timestamp', label: 'Time', width: 130, render: (v) => <span className="mono">{fmtDate(v)}</span> },
  { key: 'symbol', label: 'Symbol', width: 70, render: (v) => <strong className="symbol">{v}</strong> },
  { key: 'side', label: 'Side', width: 60, render: (v) => <SideBadge side={v} /> },
  { key: 'orderType', label: 'Type', width: 90, render: (v) => <span className="text-dim">{v}</span> },
  { key: 'price', label: 'Price', width: 90, align: 'right', render: (v) => <span className="mono">{fmtCurrency(v)}</span> },
  { key: 'quantity', label: 'Qty', width: 60, align: 'right', render: (v) => <span className="mono">{v}</span> },
  { key: 'notional', label: 'Notional', width: 110, align: 'right', render: (v) => <span className="mono">{fmtCurrency(v)}</span> },
  {
    key: 'pnl', label: 'P&L', width: 100, align: 'right',
    render: (v) => v == null ? <span className="text-dim">--</span> : (
      <span className={`mono ${v >= 0 ? 'text-green' : 'text-red'}`}>
        {v >= 0 ? '+' : ''}{fmtCurrency(v)}
      </span>
    ),
  },
  { key: 'status', label: 'Status', width: 130, render: (v) => <StatusBadge status={v} /> },
  { key: 'trader', label: 'Trader', width: 100, render: (v) => <span className="text-muted">{v}</span> },
];

const POSITION_COLUMNS = [
  { key: 'symbol', label: 'Symbol', width: 70, render: (v) => <strong className="symbol">{v}</strong> },
  { key: 'shares', label: 'Shares', width: 70, align: 'right', render: (v) => <span className="mono">{v}</span> },
  { key: 'avgCost', label: 'Avg Cost', width: 90, align: 'right', render: (v) => <span className="mono">{fmtCurrency(v)}</span> },
  { key: 'currentPrice', label: 'Price', width: 90, align: 'right', render: (v) => <span className="mono">{fmtCurrency(v)}</span> },
  { key: 'marketValue', label: 'Mkt Value', width: 110, align: 'right', render: (v) => <span className="mono">{fmtCurrency(v)}</span> },
  {
    key: 'unrealizedPnL', label: 'Unrealized P&L', width: 130, align: 'right',
    render: (v, row) => (
      <span className={`mono ${v >= 0 ? 'text-green' : 'text-red'}`}>
        {v >= 0 ? '+' : ''}{fmtCurrency(v)} ({row.unrealizedPnLPct >= 0 ? '+' : ''}{row.unrealizedPnLPct}%)
      </span>
    ),
  },
  {
    key: 'dayChange', label: 'Day P&L', width: 100, align: 'right',
    render: (v) => <span className={`mono ${v >= 0 ? 'text-green' : 'text-red'}`}>{v >= 0 ? '+' : ''}{fmtCurrency(v)}</span>,
  },
  { key: 'weight', label: 'Weight', width: 70, align: 'right', render: (v) => <span className="mono">{v}%</span> },
  { key: 'sector', label: 'Sector', width: 120, render: (v) => <span className="text-muted">{v}</span> },
];

const Dashboard = () => {
  const dispatch = useDispatch();

  const { symbols, selectedSymbol, selectedSymbolData, status: mktStatus, symbolStatus } = useSelector((s) => s.marketData);
  const { data: portfolio, status: portStatus } = useSelector((s) => s.portfolio);
  const { items: trades, status: tradesStatus } = useSelector((s) => s.trades);

  const portfolioLoading = portStatus === 'idle' || portStatus === 'loading';
  const marketLoading = mktStatus === 'idle' || mktStatus === 'loading';

  useEffect(() => {
    dispatch(fetchMarketData());
    dispatch(fetchPortfolio());
    dispatch(fetchTrades({ limit: 20 }));
  }, [dispatch]);

  // Auto-load symbol detail when selectedSymbol changes
  useEffect(() => {
    if (selectedSymbol) {
      dispatch(fetchSymbolDetail(selectedSymbol));
    }
  }, [selectedSymbol, dispatch]);

  // Auto-refresh every 60s
  // Auto-refresh market, portfolio, and trades every 10s
useEffect(() => {
  const interval = setInterval(() => {
    dispatch(fetchMarketData());
    dispatch(fetchPortfolio());
    dispatch(fetchTrades({ limit: 20 }));
  }, 10000); // 10 seconds

  return () => clearInterval(interval);
}, [dispatch]);

  // Chart data from selected symbol history
  const chartData = selectedSymbolData?.history?.map((pt) => ({
    time: fmtTime(pt.time),
    price: pt.price,
    volume: pt.volume,
  })) || [];

  // Portfolio history for area chart
  const portfolioHistory = portfolio?.historicalValues?.map((pt) => ({
    date: pt.date,
    value: pt.value,
  })) || [];

  const selectedInfo = symbols.find((s) => s.symbol === selectedSymbol);

  return (
    <div className="dashboard">
      {/* Symbol ticker bar */}
      <div className="ticker-bar">
        <div className="ticker-bar__scroll">
          {marketLoading
            ? [...Array(8)].map((_, i) => <div key={i} className="ticker-skeleton" />)
            : symbols.map((s) => <SymbolTicker key={s.symbol} symbol={s} />)
          }
        </div>
      </div>

      <div className="dashboard__content">
        {/* Portfolio Summary Row */}
        <section className="section">
          <div className="section__header">
            <h2 className="section__title">Portfolio Summary</h2>
            <span className="section__time">
              {portfolio ? `Updated ${new Date().toLocaleTimeString()}` : ''}
            </span>
          </div>
          <div className="metrics-grid">
            <MetricCard
              label="Total Portfolio Value"
              value={fmtCompact(portfolio?.totalPortfolioValue)}
              sub={`${portfolio?.positionsCount ?? '--'} positions + cash`}
              loading={portfolioLoading}
            />
            <MetricCard
              label="Equity Value"
              value={fmtCompact(portfolio?.totalValue)}
              sub="Invested positions"
              loading={portfolioLoading}
            />
            <MetricCard
              label="Cash Balance"
              value={fmtCompact(portfolio?.cashBalance)}
              sub="Available to trade"
              loading={portfolioLoading}
            />
            <MetricCard
              label="Unrealized P&L"
              value={fmtCompact(portfolio?.totalUnrealizedPnL)}
              change={portfolio?.totalUnrealizedPnL}
              changePercent={portfolio?.totalUnrealizedPnLPct}
              loading={portfolioLoading}
            />
            <MetricCard
              label="Day P&L"
              value={fmtCurrency(portfolio?.totalDayPnL)}
              change={portfolio?.totalDayPnL}
              changePercent={portfolio?.totalDayPnLPct}
              loading={portfolioLoading}
            />
            <MetricCard
              label="Sharpe Ratio"
              value={portfolio?.sharpeRatio?.toFixed(2) ?? '--'}
              sub={`Beta: ${portfolio?.beta ?? '--'}`}
              loading={portfolioLoading}
            />
          </div>
        </section>

        {/* Charts row */}
        <div className="charts-row">
          {/* Price chart */}
          <ChartContainer
            title={selectedSymbol ? `${selectedSymbol} — ${selectedInfo?.name || ''}` : 'Select a symbol'}
            subtitle={
              selectedInfo
                ? `$${selectedInfo.price?.toFixed(2)}  ${selectedInfo.change >= 0 ? '+' : ''}${selectedInfo.change?.toFixed(2)} (${selectedInfo.changePct}%)`
                : '5-minute interval · 7.5h of data'
            }
            height={280}
          >
            {symbolStatus === 'loading' ? (
              <div className="chart-loading">Loading chart data...</div>
            ) : chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 4, right: 12, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="priceGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="var(--accent)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="var(--border-subtle)" strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="time"
                    tick={{ fontSize: 10, fill: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}
                    interval={14}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    domain={['auto', 'auto']}
                    tick={{ fontSize: 10, fill: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}
                    tickFormatter={(v) => `$${v.toFixed(0)}`}
                    axisLine={false}
                    tickLine={false}
                    width={52}
                  />
                  <Tooltip content={<PriceTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="price"
                    stroke="var(--accent)"
                    strokeWidth={1.5}
                    fill="url(#priceGrad)"
                    dot={false}
                    activeDot={{ r: 4, fill: 'var(--accent)', stroke: 'var(--surface-0)', strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="chart-loading">Select a symbol to view chart</div>
            )}
          </ChartContainer>

          {/* Portfolio value chart */}
          <ChartContainer
            title="Portfolio Value — 30D"
            subtitle="Historical equity curve"
            height={280}
          >
            {portfolioLoading ? (
              <div className="chart-loading">Loading...</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={portfolioHistory} margin={{ top: 4, right: 12, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="portGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--teal)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="var(--teal)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="var(--border-subtle)" strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 9, fill: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}
                    interval={6}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    domain={['auto', 'auto']}
                    tick={{ fontSize: 10, fill: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}
                    tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`}
                    axisLine={false}
                    tickLine={false}
                    width={56}
                  />
                  <Tooltip
                    formatter={(v) => [fmtCurrency(v), 'Portfolio Value']}
                    contentStyle={{
                      background: 'var(--surface-2)',
                      border: '1px solid var(--border)',
                      borderRadius: 8,
                      fontSize: 12,
                      color: 'var(--text-primary)',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="var(--teal)"
                    strokeWidth={1.5}
                    fill="url(#portGrad)"
                    dot={false}
                    activeDot={{ r: 4, fill: 'var(--teal)', stroke: 'var(--surface-0)', strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </ChartContainer>
        </div>

        {/* Positions Table */}
        <section className="section">
          <div className="section__header">
            <h2 className="section__title">Open Positions</h2>
            <span className="section__badge">{portfolio?.positionsCount ?? 0} positions</span>
          </div>
          <Card>
            <DataTable
              columns={POSITION_COLUMNS}
              data={portfolio?.positions || []}
              loading={portfolioLoading}
              emptyMessage="No open positions"
            />
          </Card>
        </section>

        {/* Trades Table */}
        <section className="section">
          <div className="section__header">
            <h2 className="section__title">Trade History</h2>
            <span className="section__badge">{trades.length} trades</span>
          </div>
          <Card>
            <DataTable
              columns={TRADE_COLUMNS}
              data={trades}
              loading={tradesStatus === 'loading' || tradesStatus === 'idle'}
              emptyMessage="No trades found"
            />
          </Card>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
