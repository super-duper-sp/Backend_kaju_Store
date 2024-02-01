const Shop = require('../model/shopModel');
const User = require('../model/userModel');
const verifyToken = require("../utils/verifyToken.js");

//@desc Create and save new shop information to the database
//@route POST /api/shopinfo
//@access public
const postShopInfo = async (req, res) => {
  try {
    const { name, address, contact_number,email, description } = req.body;

    const userToken = req.cookies.jwt;

    if (userToken) {
      // Verify the token using the utility function
      const decoded = verifyToken(userToken, process.env.JWT_SECRET);
  
      // Assuming the user ID is stored in the decoded object
      const userId = decoded.userId;
  
      // Find the user by ID
      const user = await User.findById(userId);
      const shopData = await Shop.findById(user.shop)
  
      if (shopData) {
        // Update user profile based on request body
        shopData.name = req.body.name || shopData.name;
        shopData.email = req.body.email || shopData.email;
        shopData.address = req.body.address || shopData.address;
        shopData.contact_number = req.body.emcontact_numberail || shopData.contact_number;
        shopData.description = req.body.description || shopData.description;
        // Add more fields to update as needed
  
        // Save the updated user profile
        const updatedShop = await shopData.save();
  
        // Respond with the updated profile information
        res.json({
          name :shopData.name,
          email :shopData.email,
          address :shopData.address,
          contact_number :shopData.contact_number,
          description :shopData.description
        });
      }
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
    const userToken = req.cookies.jwt;
    if (userToken) {

     // Verify the token using the utility function
     const decoded = verifyToken(userToken, process.env.JWT_SECRET);
     // Assuming the user ID is stored in the decoded object
     const userId = decoded.userId;

    const user = await User.findById(userId);

    const shopData = await Shop.findById(user.shop);
    
    res.status(200).json( shopData );
    }
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
    const userToken = req.cookies.jwt;
    if (userToken) {

     // Verify the token using the utility function
     const decoded = verifyToken(userToken, process.env.JWT_SECRET);
     // Assuming the user ID is stored in the decoded object
     const userId = decoded.userId;

    const user = await User.findById(userId);

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
    }
  } catch (error) {
    console.error('Error getting ShopInfo:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};

module.exports = { postShopInfo , getShopInfo,updateShopInfo};
