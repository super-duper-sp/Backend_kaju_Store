const mongoose = require('mongoose');


const shopSchema = new mongoose.Schema({
     
  name: {
    type: String,
    required: true,
    default: 'your-shop-name',

  },
  address: {
    type: String,
    required: true,
    default: 'your-shop-address',
  },
  contact_number: {
    type: String,
    required: true,
    default: 'your-shop-number',
  },
  description: {
    type: String,
    default: 'your-shop-description',
  },
  email: {
    type: String,
    required: true,
    default: 'your-shop-email@gmail.com',
  },

}, {
  timestamps: true,
});

const Shop = mongoose.model('ShopProfile', shopSchema);

module.exports = Shop;
