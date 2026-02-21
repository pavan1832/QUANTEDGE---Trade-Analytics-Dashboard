const http = require("http");
const WebSocket = require("ws");

const express = require('express');
const cors = require('cors');

const marketDataRouter = require('./routes/marketData');
const portfolioRouter = require('./routes/portfolio');
const tradesRouter = require('./routes/trades');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime(), timestamp: new Date().toISOString() });
});

// API routes
app.use('/api/market-data', marketDataRouter);
app.use('/api/portfolio', portfolioRouter);
app.use('/api/trades', tradesRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, error: `Route ${req.path} not found` });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('[Server Error]', err.message);
  res.status(500).json({ success: false, error: 'Internal server error' });
});

const server = http.createServer(app);

const wss = new WebSocket.Server({ server });

wss.on("connection", (ws) => {
  console.log("📡 WebSocket client connected");

  const sendMarketUpdate = () => {
    const marketData = require("./data/marketData.json");
    ws.send(
      JSON.stringify({
        type: "MARKET_UPDATE",
        data: marketData,
        timestamp: new Date().toISOString()
      })
    );
  };

  // Send immediately
  sendMarketUpdate();

  // Send every 5 seconds
  const interval = setInterval(sendMarketUpdate, 5000);

  ws.on("close", () => {
    clearInterval(interval);
    console.log("❌ WebSocket client disconnected");
  });
});

server.listen(PORT, () => {
  console.log(`\n🚀 Trading API + WebSocket running on http://localhost:${PORT}`);
  console.log(`   REST: /api/market-data`);
  console.log(`   WS  : ws://localhost:${PORT}\n`);
});