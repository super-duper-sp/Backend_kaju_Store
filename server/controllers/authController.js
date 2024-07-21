const User = require("../model/userModel");
const bcrypt = require("bcrypt");
const asyncHandler = require( 'express-async-handler');


const generateToken = require("../utils/generateToken.js");
const verifyToken = require("../utils/verifyToken.js");

//@desc Register a user
//@route POST /api/user/register
//@access public
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;
  
    const userExists = await User.findOne({ email });
  
    if (userExists) {
      res.status(400);
      throw new Error('User already exists');
    }
  
    const user = await User.create({
      name,
      email,
      password,
    });
  
    if (user) {
      generateToken(res, user._id);
  
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
      });
    } else {
      res.status(400);
      throw new Error('Invalid user data');
    }
  });


//@desc Login user
//@route POST /api/users/login
//@access public
const loginUser = asyncHandler (async (req, res) => {
    const { email, password } = req.body;
  
    const user = await User.findOne({ email });
  
    if (user && (await user.matchPassword(password))) {
      generateToken(res, user._id);
  
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
      });
    } else {
      res.status(401);
      throw new Error('Invalid email or password');
    }
  });



// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {

  const userToken = req.cookies.jwt;
    if (userToken) {

     // Verify the token using the utility function
     const decoded = verifyToken(userToken, process.env.JWT_SECRET);
     // Assuming the user ID is stored in the decoded object
     const userId = decoded.userId;
      // Find the user by ID
      const user = await User.findById(userId).populate("shop");

      if (user) {
        // If the user is found, respond with their profile information
        res.json({
          _id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
        });
      }
    }else {
    res.status(404)
    throw new Error('User not found')
  }
})

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const userToken = req.cookies.jwt;

  if (userToken) {
    // Verify the token using the utility function
    const decoded = verifyToken(userToken, process.env.JWT_SECRET);

    // Assuming the user ID is stored in the decoded object
    const userId = decoded.userId;

    // Find the user by ID
    const user = await User.findById(userId);

    if (user) {
      // Update user profile based on request body
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      // Add more fields to update as needed

      // Save the updated user profile
      const updatedUser = await user.save();

      // Respond with the updated profile information
      res.json({
        name: updatedUser.name,
        email: updatedUser.email,
        
      });

    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

const test = (req, res) => {
  res.json("test is working");
};



// @desc    Logout user / clear cookie
// @route   POST /api/users/logout
// @access  Public
const logoutUser = (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: "Logged out successfully" });
};

module.exports = { registerUser, loginUser, getUserProfile, updateUserProfile , logoutUser, test };
