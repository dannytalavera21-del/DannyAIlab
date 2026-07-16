const express = require('express');
const manifest = require('./product/manifest');
const webhookRoutes = require('./routes/webhookRoutes');

const app = express();

app.use(express.json());

app.get('/health', (req, res) => {
  res.json({
    ok: true,
    service: manifest.id,
    version: manifest.version
  });
});

app.use(webhookRoutes);

app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

module.exports = app;
