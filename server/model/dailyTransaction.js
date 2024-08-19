const mongoose = require('mongoose');

const DailyTransactionSchema = mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  
  normalizedDate: {
    type: String,
    required: true,
  },

  buyAmount: { type: Number, required: true, min: 0 },
  buyNotes: { type: String, required: true },
  sellAmount: { type: Number, required: true, min: 0 },
  sellNotes: { type: String, required: true },
  shop: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ShopProfile',
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserProfile',
    required: true,
  },
});

// Compound index on user, shop, and normalizedDate to ensure uniqueness for creation
DailyTransactionSchema.index({ shop: 1, normalizedDate: 1 }, { unique: true });

const DailyTransactionModel = mongoose.model('DailyTransactions', DailyTransactionSchema);

module.exports = DailyTransactionModel;
