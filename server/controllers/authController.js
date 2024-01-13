const User = require("../model/userModel");
const bcrypt = require("bcrypt");
const asyncHandler = require( 'express-async-handler');

const generateToken = require("../utils/generateToken.js");

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



//@desc user info
//@route POST /api/users/current
//@access private
const currentUser = (req, res) => {
  res.json(req.user);
};

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

module.exports = { registerUser, loginUser, currentUser, logoutUser, test };

// @desc Register a user
// @route POST /api/users/register
// @access public
// const registerUser =  async (req,res)=>{
//     const { username , email , password }= req.body;
//     if( !username || !email || !password){
//         res.status(400);
//         throw new Error("All fields are mandatory");
//     }
//     const userAvailable = await User.findOne({email});
//     if(userAvailable){
//         res.status(400);
//         throw new Error("User already register!");
//     }

//     //has password
//     const hashedPassword = await bcrpyt.hash(password,10);
//     console.log("hashed password: "+hashedPassword);
//     const user = await User.create({
//         username,
//         email,
//         password:hashedPassword,
//     });

//     console.log(`user created ${user}`);
//     if(user){
//         res.status(201).json({_id: user.id, email: user.email });
//     }
//     else{
//         res.status(400);
//         throw new Error("User data is not valid");
//     }
//     res.json({message: "register user"});

// };
