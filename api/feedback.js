const fs = require('fs');
const path = require('path');

const DATA_PATH = '/tmp/server-feedbacks.json';

module.exports = async (req, res) => {
  const method = req.method.toUpperCase();
  if (method === 'POST') {
    try {
      const { name, email, message } = req.body || {};
      if (!name || !message) return res.status(400).json({ error: 'name and message required' });
      let arr = [];
      try { arr = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8') || '[]'); } catch(e) { arr = []; }
      arr.push({ name, email: email||'', message, ts: Date.now() });
      fs.writeFileSync(DATA_PATH, JSON.stringify(arr, null, 2), 'utf8');
      return res.status(200).json({ ok: true });
    } catch (err) {
      return res.status(500).json({ error: 'server error' });
    }
  }
  if (method === 'GET') {
    // admin read (pw in query or header)
    const pw = req.query.pw || req.headers['x-admin-pw'];
    if (!pw || pw !== process.env.ADMIN_PASSWORD) return res.status(401).json({ error: 'unauthorized' });
    try {
      let arr = [];
      try { arr = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8') || '[]'); } catch(e) { arr = []; }
      return res.status(200).json({ feedbacks: arr });
    } catch (err) { return res.status(500).json({ error: 'server error' }); }
  }
  res.status(405).json({ error: 'method not allowed' });
};
