const generateMarketData = () => {
  const symbols = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'NVDA', 'TSLA', 'META', 'JPM'];
  const now = Date.now();
  const data = {};

  symbols.forEach((symbol) => {
    const basePrice = {
      AAPL: 189.5, MSFT: 415.2, GOOGL: 175.8, AMZN: 198.3,
      NVDA: 875.6, TSLA: 245.9, META: 508.4, JPM: 198.7,
    }[symbol];

    const points = [];
    for (let i = 89; i >= 0; i--) {
      const time = new Date(now - i * 5 * 60 * 1000);
      const noise = (Math.random() - 0.5) * basePrice * 0.012;
      const trend = (89 - i) * basePrice * 0.0003;
      const price = parseFloat((basePrice + noise + trend).toFixed(2));
      points.push({
        time: time.toISOString(),
        timestamp: time.getTime(),
        price,
        volume: Math.floor(Math.random() * 2000000) + 500000,
        open: parseFloat((price - Math.random() * 2).toFixed(2)),
        high: parseFloat((price + Math.random() * 3).toFixed(2)),
        low: parseFloat((price - Math.random() * 3).toFixed(2)),
        close: price,
      });
    }

    const lastPrice = points[points.length - 1].price;
    const prevClose = basePrice;
    const change = parseFloat((lastPrice - prevClose).toFixed(2));
    const changePct = parseFloat(((change / prevClose) * 100).toFixed(2));

    data[symbol] = {
      symbol,
      name: {
        AAPL: 'Apple Inc.', MSFT: 'Microsoft Corp.', GOOGL: 'Alphabet Inc.',
        AMZN: 'Amazon.com Inc.', NVDA: 'NVIDIA Corp.', TSLA: 'Tesla Inc.',
        META: 'Meta Platforms', JPM: 'JPMorgan Chase',
      }[symbol],
      price: lastPrice,
      change,
      changePct,
      volume: Math.floor(Math.random() * 50000000) + 10000000,
      marketCap: parseFloat((lastPrice * (Math.random() * 5 + 1) * 1e9).toFixed(0)),
      high52w: parseFloat((basePrice * 1.35).toFixed(2)),
      low52w: parseFloat((basePrice * 0.72).toFixed(2)),
      history: points,
    };
  });

  return data;
};

module.exports = { generateMarketData };
