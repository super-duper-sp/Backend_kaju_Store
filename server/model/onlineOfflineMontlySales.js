const  mongoose = require('mongoose')

const OnlineOfflineMontlySalesSchema = mongoose.Schema({
  Month: { type: String, required: true },
  OnlineSales: { type: Number, required: true },
  OfflineSales: { type: Number, required: true },
});

const OnlineOfflineMontlySalesModel = mongoose.model('OnlineOfflineMontlySales', OnlineOfflineMontlySalesSchema);

module.exports= OnlineOfflineMontlySalesModel;