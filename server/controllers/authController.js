const User = require("../model/userModel");
const bcrypt = require("bcrypt");
const asyncHandler = require("express-async-handler");

const generateToken = require("../utils/generateToken.js");
const verifyToken = require("../utils/verifyToken.js");

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
 

  // Check if the user already exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  // Create a new user
  const user = await User.create({
    name,
    email,
    password,
  });

  // Check if user was created successfully
  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      message: "Account created successfully!",
    });
    return; // Ensure no further code is executed
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

//@desc Login user
//@route POST /api/users/login
//@access public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  console.log('login');

  // Find the user by email
  const user = await User.findOne({ email });

  if (!user) {
    // If the user does not exist, return an error response
    return res.status(401).json( "Invalid email or password" );
  }

  // Check if the provided password matches the user's password
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    // If the password is incorrect, return an error response
    return res.status(401).json("Invalid email or password" );
  }

  // Generate a token for the user

  const token = generateToken(user._id);

  //send httponly cookie
  res.cookie("token", token, {
    path: "/", // Cookie is available throughout the entire site
    httpOnly: true, // Cookie cannot be accessed via client-side scripts (helps prevent XSS attacks)
    expires: new Date(Date.now() + 1000 * 86400), // Cookie expires in 1 day (86400 seconds = 24 hours)
    //sameSite: "none",        // Cross-site cookie requests are allowed (use "lax" or "strict" for increased security)
    //secure: true             // Cookie is only sent over HTTPS (ensure this is true in production)
  });

  // Respond with user information or success message
  res.status(200).json({ message: "Login successful" , token: token});
});

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  // Find the user by ID
  const user = await User.findById(req.user._id).populate("shop");
  const { _id, name, email,role, isAdmin , shop } = user;
  
  console.log(user);
  if (user) {
    // If the user is found, respond with their profile information
    res.status(200).json({
      _id, name, email,role, isAdmin , shop
     
    });
  } else {
    res.status(400);
    throw new Error("User not found");
  }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  // Find the user by ID
  const user = await User.findById(req.user._id);
  const { _id, name, email, isAdmin } = user;

  if (user) {
    // Update user profile based on request body
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    // Save the updated user profile
    const updatedUser = await user.save();

    // Respond with the updated profile information
    res.json({
      name: updatedUser.name,
      email: updatedUser.email,
    });
  } else {
    res.status(404);
    throw new Error("Not updated profile");
  }
});

// @desc    Logout user / clear cookie
// @route   POST /api/users/logout
// @access  Public
const logoutUser = (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0), // Set the expiration date to the past to effectively delete the cookie
    secure: process.env.NODE_ENV === 'production', // Use 'secure' option in production
    sameSite: 'strict', // Use 'strict' to prevent CSRF attacks
  });
  res.status(200).json({ message: "Logged out successfully" });
};


module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  logoutUser,
};
