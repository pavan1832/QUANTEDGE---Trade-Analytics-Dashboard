const generatePortfolio = () => {
  const positions = [
    { symbol: 'AAPL', shares: 150, avgCost: 162.4, currentPrice: 189.5, sector: 'Technology' },
    { symbol: 'MSFT', shares: 80, avgCost: 380.1, currentPrice: 415.2, sector: 'Technology' },
    { symbol: 'NVDA', shares: 45, avgCost: 620.0, currentPrice: 875.6, sector: 'Semiconductors' },
    { symbol: 'JPM', shares: 120, avgCost: 178.5, currentPrice: 198.7, sector: 'Financials' },
    { symbol: 'AMZN', shares: 60, avgCost: 185.2, currentPrice: 198.3, sector: 'Consumer Disc.' },
    { symbol: 'TSLA', shares: 90, avgCost: 265.8, currentPrice: 245.9, sector: 'Automotive' },
    { symbol: 'META', shares: 55, avgCost: 420.0, currentPrice: 508.4, sector: 'Technology' },
    { symbol: 'GOOGL', shares: 70, avgCost: 158.3, currentPrice: 175.8, sector: 'Technology' },
  ];

  const enriched = positions.map((p) => {
    const marketValue = parseFloat((p.shares * p.currentPrice).toFixed(2));
    const costBasis = parseFloat((p.shares * p.avgCost).toFixed(2));
    const unrealizedPnL = parseFloat((marketValue - costBasis).toFixed(2));
    const unrealizedPnLPct = parseFloat(((unrealizedPnL / costBasis) * 100).toFixed(2));
    const dayChange = parseFloat(((Math.random() - 0.4) * p.currentPrice * 0.025 * p.shares).toFixed(2));

    return {
      ...p,
      marketValue,
      costBasis,
      unrealizedPnL,
      unrealizedPnLPct,
      dayChange,
      weight: 0,
    };
  });

  const totalValue = enriched.reduce((sum, p) => sum + p.marketValue, 0);
  const totalCost = enriched.reduce((sum, p) => sum + p.costBasis, 0);
  const totalUnrealizedPnL = parseFloat((totalValue - totalCost).toFixed(2));
  const totalDayPnL = parseFloat(enriched.reduce((sum, p) => sum + p.dayChange, 0).toFixed(2));
  const cashBalance = 48320.75;

  enriched.forEach((p) => {
    p.weight = parseFloat(((p.marketValue / totalValue) * 100).toFixed(2));
  });

  const historicalValues = [];
  const now = Date.now();
  let runningValue = totalValue * 0.78;
  for (let i = 29; i >= 0; i--) {
    const date = new Date(now - i * 24 * 60 * 60 * 1000);
    runningValue *= 1 + (Math.random() - 0.42) * 0.022;
    historicalValues.push({
      date: date.toISOString().split('T')[0],
      value: parseFloat(runningValue.toFixed(2)),
    });
  }
  historicalValues.push({ date: new Date().toISOString().split('T')[0], value: parseFloat(totalValue.toFixed(2)) });

  return {
    totalValue: parseFloat(totalValue.toFixed(2)),
    cashBalance,
    totalPortfolioValue: parseFloat((totalValue + cashBalance).toFixed(2)),
    totalUnrealizedPnL,
    totalUnrealizedPnLPct: parseFloat(((totalUnrealizedPnL / totalCost) * 100).toFixed(2)),
    totalDayPnL,
    totalDayPnLPct: parseFloat(((totalDayPnL / totalValue) * 100).toFixed(2)),
    positionsCount: enriched.length,
    beta: 1.24,
    sharpeRatio: 2.18,
    positions: enriched,
    historicalValues,
  };
};

module.exports = { generatePortfolio };
