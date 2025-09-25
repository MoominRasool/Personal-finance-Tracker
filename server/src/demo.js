require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

// In-memory stores
const db = {
  users: [],
  expenses: [],
  budgets: []
};

function createToken(userId) {
  const secret = process.env.JWT_SECRET || 'demo_secret';
  return jwt.sign({ sub: userId }, secret, { expiresIn: '7d' });
}

function authMiddleware(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) return res.status(401).json({ message: 'Missing token' });
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'demo_secret');
    const user = db.users.find((u) => u.id === payload.sub);
    if (!user) return res.status(401).json({ message: 'Invalid token' });
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
}

const app = express();
app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));

// Health
app.get('/api/health', (req, res) => res.json({ status: 'ok', mode: 'demo' }));

// Auth (demo: plaintext password for simplicity)
app.post('/api/auth/register', (req, res) => {
  const { name, email, password } = req.body || {};
  if (!name || !email || !password) return res.status(400).json({ message: 'Missing fields' });
  if (db.users.some((u) => u.email === email)) return res.status(409).json({ message: 'Email already in use' });
  const user = { id: String(Date.now()), name, email, password };
  db.users.push(user);
  const token = createToken(user.id);
  res.status(201).json({ token, user: { id: user.id, name: user.name, email: user.email } });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body || {};
  const user = db.users.find((u) => u.email === email && u.password === password);
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });
  const token = createToken(user.id);
  res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
});

app.get('/api/auth/me', authMiddleware, (req, res) => {
  const u = req.user;
  res.json({ user: { id: u.id, name: u.name, email: u.email } });
});

// Expenses
app.get('/api/expenses', authMiddleware, (req, res) => {
  const items = db.expenses.filter((e) => e.userId === req.user.id).sort((a, b) => new Date(b.date) - new Date(a.date));
  res.json({ items });
});

app.post('/api/expenses', authMiddleware, (req, res) => {
  const { amount, category, description, date } = req.body || {};
  if (amount == null || !category || !date) return res.status(400).json({ message: 'Missing fields' });
  const item = { _id: String(Date.now()), userId: req.user.id, amount: Number(amount), category, description, date };
  db.expenses.push(item);
  res.status(201).json({ item });
});

app.put('/api/expenses/:id', authMiddleware, (req, res) => {
  const idx = db.expenses.findIndex((e) => e._id === req.params.id && e.userId === req.user.id);
  if (idx === -1) return res.status(404).json({ message: 'Not found' });
  const existing = db.expenses[idx];
  const { amount, category, description, date } = req.body || {};
  const updated = { ...existing, amount: Number(amount ?? existing.amount), category: category ?? existing.category, description: description ?? existing.description, date: date ?? existing.date };
  db.expenses[idx] = updated;
  res.json({ item: updated });
});

app.delete('/api/expenses/:id', authMiddleware, (req, res) => {
  const before = db.expenses.length;
  db.expenses = db.expenses.filter((e) => !(e._id === req.params.id && e.userId === req.user.id));
  if (db.expenses.length === before) return res.status(404).json({ message: 'Not found' });
  res.status(204).end();
});

// Budgets
app.get('/api/budgets', authMiddleware, (req, res) => {
  const items = db.budgets.filter((b) => b.userId === req.user.id).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json({ items });
});

app.post('/api/budgets', authMiddleware, (req, res) => {
  const { category, amount, period = 'monthly' } = req.body || {};
  if (!category || amount == null) return res.status(400).json({ message: 'Missing fields' });
  const item = { _id: String(Date.now()), userId: req.user.id, category, amount: Number(amount), period, createdAt: new Date().toISOString() };
  db.budgets.push(item);
  res.status(201).json({ item });
});

app.put('/api/budgets/:id', authMiddleware, (req, res) => {
  const idx = db.budgets.findIndex((b) => b._id === req.params.id && b.userId === req.user.id);
  if (idx === -1) return res.status(404).json({ message: 'Not found' });
  const existing = db.budgets[idx];
  const { category, amount, period } = req.body || {};
  const updated = { ...existing, category: category ?? existing.category, amount: Number(amount ?? existing.amount), period: period ?? existing.period };
  db.budgets[idx] = updated;
  res.json({ item: updated });
});

app.delete('/api/budgets/:id', authMiddleware, (req, res) => {
  const before = db.budgets.length;
  db.budgets = db.budgets.filter((b) => !(b._id === req.params.id && b.userId === req.user.id));
  if (db.budgets.length === before) return res.status(404).json({ message: 'Not found' });
  res.status(204).end();
});

// Reports
app.get('/api/reports/category', authMiddleware, (req, res) => {
  const items = db.expenses.filter((e) => e.userId === req.user.id);
  const map = new Map();
  for (const e of items) {
    map.set(e.category, (map.get(e.category) || 0) + Number(e.amount));
  }
  res.json({ items: Array.from(map.entries()).map(([category, total]) => ({ category, total })) });
});

app.get('/api/reports/month', authMiddleware, (req, res) => {
  const items = db.expenses.filter((e) => e.userId === req.user.id);
  const map = new Map();
  for (const e of items) {
    const d = new Date(e.date);
    const key = `${d.getFullYear()}-${d.getMonth() + 1}`;
    map.set(key, (map.get(key) || 0) + Number(e.amount));
  }
  const out = Array.from(map.entries()).map(([k, total]) => {
    const [y, m] = k.split('-').map(Number);
    return { year: y, month: m, total };
  }).sort((a, b) => a.year - b.year || a.month - b.month);
  res.json({ items: out });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Demo API running on http://localhost:${PORT}`));


