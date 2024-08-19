const Shop = require('../model/shopModel');
const User = require('../model/userModel');
const verifyToken = require("../utils/verifyToken.js");

//@desc Create and save new shop information to the database
//@route POST /api/shopinfo
//@access public
const postShopInfo = async (req, res) => {
  try {
    const { name, address, contact_number, email, description } = req.body;

    // Find the user by ID (assuming user is authenticated and req.user._id is available)
    const user = await User.findById(req.user._id);

    // Check if the user already has a shop associated
    let shopData = await Shop.findById(user.shop);

    if (shopData) {
      // Update existing shop information
      shopData.name = name || shopData.name;
      shopData.email = email || shopData.email;
      shopData.address = address || shopData.address;
      shopData.contact_number = contact_number || shopData.contact_number;
      shopData.description = description || shopData.description;

      // Save the updated shop information
      const updatedShop = await shopData.save();

      // Respond with the updated shop information
      return res.json({
        name: updatedShop.name,
        email: updatedShop.email,
        address: updatedShop.address,
        contact_number: updatedShop.contact_number,
        description: updatedShop.description
      });
    } else {
      // If no existing shop data, create a new shop record
      const newShop = new Shop({
        name,
        email,
        address,
        contact_number,
        description,
        user: req.user._id // Assuming the Shop schema has a user reference
      });

      // Save the new shop information
      const createdShop = await newShop.save();

      // Update the user's shop reference
      user.shop = createdShop._id;
      await user.save();

      // Respond with the created shop information
      return res.status(201).json({
        name: createdShop.name,
        email: createdShop.email,
        address: createdShop.address,
        contact_number: createdShop.contact_number,
        description: createdShop.description
      });
    }
  } catch (error) {
    console.error('Error adding ShopInfo:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};


//@desc Get ShopInfo from database
//@route GET /api/shopinfo
//@access public
const getShopInfo = async (req, res) => {
  try {
    

    const user = await User.findById(req.user._id);

    const shopData = await Shop.findById(user.shop);
    
    res.status(200).json( shopData );
    
  } catch (error) {
    console.error('Error getting ShopInfo:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};

//@desc Put ShopInfo from database
//@route PUT /api/shopinfo
//@access public
const updateShopInfo = async (req, res) => {

  try {
    

    const user = await User.findById(req.user._id);

    const shop = await Shop.findById(user.shop);
   
    if (shop) {
      // Update user profile based on request body
      shop.name = req.body.name || shop.name;
      shop.address = req.body.address || shop.address;
      shop.contact_number = req.body.contact_number || shop.contact_number;
      shop.description = req.body.description || shop.description;
      // Add more fields to update as needed
      
      // Save the updated user profile
      const updatedShop = await shop.save();

      // Respond with the updated profile information
      res.json({
        name: updatedShop.name,
        email: updatedShop.address,
        contact_number: updatedShop.contact_number,
        description: updatedShop.description,
        
      });

    } 
    
  } catch (error) {
    console.error('Error getting ShopInfo:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};

module.exports = { postShopInfo , getShopInfo,updateShopInfo};
