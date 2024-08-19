const jwt = require("jsonwebtoken");
const User = require("../model/userModel");
const asyncHandler = require("express-async-handler");

const protect = asyncHandler(async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      res.status(401);
      throw new Error("Not Authorised, please login");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    user = await User.findById(decoded.id).select("-password");

    if (!user) {
      res.status(401);
      throw Error("User not found");
    }

    req.user = user;

    next();
  } catch (error) {
    res.status(401);
    throw new Error("Not authorized, token failed");
  }
});

module.exports = { protect };
