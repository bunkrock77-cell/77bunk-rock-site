const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const DATA_FILE = path.join(__dirname, 'server-feedbacks.json');
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'change-me-please';

// ensure file exists
if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, '[]', 'utf8');

app.post('/api/feedback', (req, res) => {
  const { name, email, message } = req.body || {};
  if (!name || !message) return res.status(400).json({ error: 'name and message required' });
  const feedbacks = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8') || '[]');
  feedbacks.push({ name, email: email || '', message, ts: Date.now() });
  fs.writeFileSync(DATA_FILE, JSON.stringify(feedbacks, null, 2), 'utf8');
  res.json({ ok: true });
});

// admin view (password via query param or header)
app.get('/api/admin/feedbacks', (req, res) => {
  const pw = req.query.pw || req.headers['x-admin-pw'];
  if (!pw || pw !== ADMIN_PASSWORD) return res.status(401).json({ error: 'unauthorized' });
  const feedbacks = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8') || '[]');
  res.json({ feedbacks });
});

const port = process.env.PORT || 3000;
app.listen(port, ()=> console.log('Feedback server running on port', port));
