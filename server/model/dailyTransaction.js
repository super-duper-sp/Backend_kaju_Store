
const  mongoose = require('mongoose')


const DailyTransactionSchema = mongoose.Schema({
  date: {
    type: Date,
    required: true,
    unique: true,
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


const DailyTransactionModel = mongoose.model('DailyTransactions', DailyTransactionSchema);


module.exports= DailyTransactionModel;