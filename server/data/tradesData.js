const generateTrades = () => {
  const symbols = ['AAPL', 'MSFT', 'NVDA', 'JPM', 'AMZN', 'TSLA', 'META', 'GOOGL', 'AMD', 'NFLX'];
  const sides = ['BUY', 'SELL'];
  const statuses = ['FILLED', 'FILLED', 'FILLED', 'PARTIALLY_FILLED', 'CANCELLED'];
  const orderTypes = ['MARKET', 'LIMIT', 'STOP_LIMIT'];
  const traders = ['Algo-MM-01', 'Quant-Alpha', 'DeltaHedge', 'MomentumBot', 'Manual'];

  const now = Date.now();
  const trades = [];

  for (let i = 0; i < 50; i++) {
    const symbol = symbols[Math.floor(Math.random() * symbols.length)];
    const side = sides[Math.floor(Math.random() * sides.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const orderType = orderTypes[Math.floor(Math.random() * orderTypes.length)];
    const trader = traders[Math.floor(Math.random() * traders.length)];

    const basePrice = {
      AAPL: 189.5, MSFT: 415.2, NVDA: 875.6, JPM: 198.7, AMZN: 198.3,
      TSLA: 245.9, META: 508.4, GOOGL: 175.8, AMD: 168.4, NFLX: 628.9,
    }[symbol];

    const price = parseFloat((basePrice * (1 + (Math.random() - 0.5) * 0.04)).toFixed(2));
    const quantity = Math.floor(Math.random() * 200) + 10;
    const filledQty = status === 'FILLED' ? quantity : status === 'PARTIALLY_FILLED' ? Math.floor(quantity * 0.6) : 0;
    const commission = parseFloat((Math.random() * 8 + 1).toFixed(2));
    const pnl = side === 'SELL' ? parseFloat(((price - basePrice * 0.97) * filledQty - commission).toFixed(2)) : null;

    trades.push({
      id: `TRD-${String(10000 + i).padStart(6, '0')}`,
      symbol,
      side,
      orderType,
      status,
      price,
      quantity,
      filledQuantity: filledQty,
      commission,
      pnl,
      trader,
      timestamp: new Date(now - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)).toISOString(),
      notional: parseFloat((price * filledQty).toFixed(2)),
    });
  }

  trades.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  return trades;
};

module.exports = { generateTrades };
