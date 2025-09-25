const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    category: { type: String, required: true, trim: true },
    amount: { type: Number, required: true, min: 0 },
    period: { type: String, enum: ['monthly', 'weekly', 'yearly'], default: 'monthly' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Budget', budgetSchema);


