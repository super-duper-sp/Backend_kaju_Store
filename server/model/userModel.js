const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const  Shop = require('../model/shopModel')

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    Role: {
      type:String,
      required:true,
      enum : ['admin', 'shopmember'],
      default:"shopmember",
  },
    shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ShopProfile',
    },
    profilePic: {
      type: String, // Assuming you'll store the URL or file path
    },
  },
  {
    timestamps: true,
  }
);

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Encrypt password using bcrypt
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);


// If user is admin, create a ShopProfile and associate it with the user
if (this.isAdmin && !this.shop) {
  const shop = new Shop();
  await shop.save();
  this.shop = shop._id;
  
  console.log('ShopProfile created and associated with user');
} else {
  console.log('ShopProfile creation skipped');
}

next();







});

const User = mongoose.model('UserProfile', userSchema);

module.exports = User;
