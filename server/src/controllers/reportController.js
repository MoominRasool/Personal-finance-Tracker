const Expense = require('../models/Expense');

exports.spendByCategory = async (req, res) => {
  const { start, end } = req.query;
  const match = { userId: req.user.id };
  if (start || end) {
    match.date = {};
    if (start) match.date.$gte = new Date(start);
    if (end) match.date.$lte = new Date(end);
  }
  const data = await Expense.aggregate([
    { $match: match },
    { $group: { _id: '$category', total: { $sum: '$amount' } } },
    { $sort: { total: -1 } }
  ]);
  res.json({ items: data.map(d => ({ category: d._id, total: d.total })) });
};

exports.spendByMonth = async (req, res) => {
  const { year } = req.query;
  const match = { userId: req.user.id };
  if (year) {
    const y = Number(year);
    match.date = { $gte: new Date(y, 0, 1), $lte: new Date(y, 11, 31, 23, 59, 59, 999) };
  }
  const data = await Expense.aggregate([
    { $match: match },
    { $group: { _id: { y: { $year: '$date' }, m: { $month: '$date' } }, total: { $sum: '$amount' } } },
    { $sort: { '_id.y': 1, '_id.m': 1 } }
  ]);
  res.json({ items: data.map(d => ({ year: d._id.y, month: d._id.m, total: d.total })) });
};


