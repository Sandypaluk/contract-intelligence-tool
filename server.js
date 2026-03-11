require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const analyzeHandler = require('./api/analyze');
const chatHandler = require('./api/chat');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// API routes
app.post('/api/analyze', analyzeHandler);
app.post('/api/chat', chatHandler);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    claudeConfigured: !!process.env.ANTHROPIC_API_KEY,
    timestamp: new Date().toISOString(),
  });
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log('\n╔══════════════════════════════════════════╗');
  console.log('║   MYNE Homes — Contract Intelligence     ║');
  console.log('╚══════════════════════════════════════════╝');
  console.log(`\n📡  API Server:   http://localhost:${PORT}`);
  console.log(`🔑  Claude API:   ${process.env.ANTHROPIC_API_KEY ? '✓ Configured' : '✗ Missing — set ANTHROPIC_API_KEY in .env'}`);
  console.log('\n💡  Frontend dev server: run  npm run dev\n');
});
