const Budget = require('../models/Budget');

exports.list = async (req, res) => {
  const items = await Budget.find({ userId: req.user.id }).sort({ createdAt: -1 });
  res.json({ items });
};

exports.create = async (req, res) => {
  const { category, amount, period } = req.body;
  if (!category || amount == null) return res.status(400).json({ message: 'Missing fields' });
  const item = await Budget.create({ userId: req.user.id, category, amount, period });
  res.status(201).json({ item });
};

exports.update = async (req, res) => {
  const { id } = req.params;
  const { category, amount, period } = req.body;
  const item = await Budget.findOneAndUpdate({ _id: id, userId: req.user.id }, { category, amount, period }, { new: true });
  if (!item) return res.status(404).json({ message: 'Not found' });
  res.json({ item });
};

exports.remove = async (req, res) => {
  const { id } = req.params;
  const r = await Budget.deleteOne({ _id: id, userId: req.user.id });
  if (r.deletedCount === 0) return res.status(404).json({ message: 'Not found' });
  res.status(204).end();
};


