const express = require('express');
const router = express.Router();
const { generateTrades } = require('../data/tradesData');

// GET /api/trades
router.get('/', (req, res) => {
  try {
    const { symbol, side, status, limit = 20, offset = 0 } = req.query;
    let trades = generateTrades();

    if (symbol) trades = trades.filter((t) => t.symbol === symbol.toUpperCase());
    if (side) trades = trades.filter((t) => t.side === side.toUpperCase());
    if (status) trades = trades.filter((t) => t.status === status.toUpperCase());

    const total = trades.length;
    const paginated = trades.slice(Number(offset), Number(offset) + Number(limit));

    res.json({
      success: true,
      data: paginated,
      meta: { total, limit: Number(limit), offset: Number(offset) },
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to fetch trades' });
  }
});

module.exports = router;
