// OLIVE FITNESS — light enquiry backend (Express). No secrets in frontend.
// Run: cd backend && npm install && node server.js  (serves API + static site on :3000)
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'enquiries.json');
const SITE_ROOT = path.join(__dirname, '..');

app.use(cors());
app.use(express.json({ limit: '32kb' }));

// Simple in-memory rate limit: 20 req / 10 min per IP
const hits = new Map();
app.use('/api/', (req, res, next) => {
  const ip = req.ip || 'unknown';
  const now = Date.now();
  const arr = (hits.get(ip) || []).filter(t => now - t < 10 * 60 * 1000);
  arr.push(now); hits.set(ip, arr);
  if (arr.length > 20) return res.status(429).json({ error: 'Too many requests. Please try again later.' });
  next();
});

function esc(s) { return String(s == null ? '' : s).slice(0, 2000).replace(/[<>&"']/g, c => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&#39;' }[c])); }
function readAll() { try { return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8')); } catch { return []; } }

app.post('/api/enquiries', (req, res) => {
  const b = req.body || {};
  // Honeypot (field "company" must be empty) — bots fill it
  if (b.company) return res.json({ ok: true });
  const type = ['contact', 'trial', 'membership'].includes(b.type) ? b.type : 'general';
  const name = String(b.name || '').trim();
  const phone = String(b.phone || '').trim();
  const email = String(b.email || '').trim();
  const plan = String(b.plan || '').trim().slice(0, 60);
  const classId = String(b.classId || '').trim().slice(0, 60);
  const message = String(b.message || '').trim().slice(0, 2000);
  if (name.length < 2) return res.status(400).json({ error: 'Please enter your name.' });
  if (!/^[+\d][\d\s-]{6,16}$/.test(phone)) return res.status(400).json({ error: 'Enter a valid phone number.' });
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ error: 'Enter a valid email or leave it blank.' });
  const rec = { id: Date.now(), at: new Date().toISOString(), type, name: esc(name), phone: esc(phone), email: esc(email), plan: esc(plan), classId: esc(classId), message: esc(message), ip: req.ip };
  const all = readAll(); all.push(rec);
  try { fs.writeFileSync(DATA_FILE, JSON.stringify(all, null, 2)); } catch (e) { return res.status(500).json({ error: 'Could not save. Please WhatsApp us.' }); }
  res.json({ ok: true, id: rec.id });
});

app.get('/api/health', (req, res) => res.json({ ok: true, service: 'olive-fitness', time: new Date().toISOString() }));

// Serve static site (so one `node server.js` runs everything locally)
app.use(express.static(SITE_ROOT, { extensions: ['html'] }));
app.use((req, res) => res.status(404).sendFile(path.join(SITE_ROOT, '404.html')));

app.listen(PORT, () => console.log('OLIVE FITNESS running on http://localhost:' + PORT));
