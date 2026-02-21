const express = require('express');
const router = express.Router();
const { generateMarketData } = require('../data/marketData');

let cachedData = null;
let lastGenerated = null;

// Regenerate data every 30 seconds to simulate live prices
const getData = () => {
  if (!cachedData || Date.now() - lastGenerated > 30000) {
    cachedData = generateMarketData();
    lastGenerated = Date.now();
  }
  return cachedData;
};

// GET /api/market-data — all symbols overview
router.get('/', (req, res) => {
  try {
    const data = getData();
    const overview = Object.values(data).map(({ history, ...rest }) => rest);
    res.json({ success: true, data: overview, timestamp: new Date().toISOString() });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to fetch market data' });
  }
});

// GET /api/market-data/:symbol — detailed with history
router.get('/:symbol', (req, res) => {
  try {
    const { symbol } = req.params;
    const data = getData();
    const symbolData = data[symbol.toUpperCase()];
    if (!symbolData) {
      return res.status(404).json({ success: false, error: `Symbol ${symbol} not found` });
    }
    res.json({ success: true, data: symbolData, timestamp: new Date().toISOString() });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to fetch symbol data' });
  }
});

module.exports = router;
