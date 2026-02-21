const express = require('express');
const router = express.Router();
const { generatePortfolio } = require('../data/portfolioData');

// GET /api/portfolio
router.get('/', (req, res) => {
  try {
    const portfolio = generatePortfolio();
    res.json({ success: true, data: portfolio, timestamp: new Date().toISOString() });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to fetch portfolio data' });
  }
});

module.exports = router;
