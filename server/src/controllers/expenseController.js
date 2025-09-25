const Expense = require('../models/Expense');

exports.list = async (req, res) => {
  const items = await Expense.find({ userId: req.user.id }).sort({ date: -1 });
  res.json({ items });
};

exports.create = async (req, res) => {
  const { amount, category, description, date } = req.body;
  if (amount == null || !category || !date) return res.status(400).json({ message: 'Missing fields' });
  const item = await Expense.create({ userId: req.user.id, amount, category, description, date });
  res.status(201).json({ item });
};

exports.update = async (req, res) => {
  const { id } = req.params;
  const { amount, category, description, date } = req.body;
  const item = await Expense.findOneAndUpdate({ _id: id, userId: req.user.id }, { amount, category, description, date }, { new: true });
  if (!item) return res.status(404).json({ message: 'Not found' });
  res.json({ item });
};

exports.remove = async (req, res) => {
  const { id } = req.params;
  const r = await Expense.deleteOne({ _id: id, userId: req.user.id });
  if (r.deletedCount === 0) return res.status(404).json({ message: 'Not found' });
  res.status(204).end();
};


