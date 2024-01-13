
const  mongoose = require('mongoose')

const DailyTransactionSchema = mongoose.Schema({
  date: { type: Date, required: true, unique: true }, // Date of the transaction, unique constraint
  buyAmount: { type: Number, unique: true,required: true, min: 0 }, // Amount of purchases, minimum value is 0
  buyNotes: { type: String, required: true }, // Notes related to purchases
  sellAmount: { type: Number, required: true, min: 0 }, // Amount of sales, minimum value is 0
  sellNotes: { type: String, required: true }, // Notes related to sales
});

const DailyTransactionModel = mongoose.model('DailyTransactions', DailyTransactionSchema);


module.exports= DailyTransactionModel;