
const  mongoose = require('mongoose')
const moment = require('moment');


const DailyTransactionSchema = mongoose.Schema({
  date: {
    type: Date,
    required: true,
    unique: true,
    validate: {
      validator: function (value) {
        // Validate that the value is a valid date
        return moment(value, 'DD-MM-YYYY', true).isValid();
      },
      message: 'Invalid date format, use DD-MM-YYYY',
    },
    get: (value) => moment(value).format('DD-MM-YYYY'), // Format the date when retrieving from the database
    set: (value) => moment(value, 'DD-MM-YYYY').toDate(), // Parse and set the date when saving to the database
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