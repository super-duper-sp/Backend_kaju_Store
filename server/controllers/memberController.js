const Shop = require('../model/shopModel');
const User = require('../model/userModel');// @desc Add a new member
// @route POST /api/members
// @access private
const addMember = async (req, res) => {
  try {
    // Find the user making the request
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    // Extract member details from request body
    const { name, email, password } = req.body;

    // Determine the role of the new user based on the role of the requester
    const role = user.role === 'admin' ? 'shopmember' : 'shopmember'; // Default to shopmember

    // Create a new user instance
    const newUser = new User({
      name,
      email,
      password,
      shop: user.shop, // Assign the shop of the user making the request
      role, // Assign the role based on the requester
    });

    // Save the new user to the database
    await newUser.save();

    res.status(201).json({ success: true, data: newUser });
  } catch (error) {
    console.error('Error adding member:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};


// @desc Get all members
// @route GET /api/members
// @access private
const getAllMembers = async (req, res) => {
  try {
    // Extract page and limit from query parameters
    const page = parseInt(req.query.page, 10) || 1; // Default to page 1 if not provided
    const limit = parseInt(req.query.limit, 10) || 10; // Default to 10 items per page if not provided

    // Validate page and limit
    if (page < 1 || limit < 1) {
      return res.status(400).json({ success: false, error: 'Page and limit must be positive numbers' });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    const shopId = user.shop;

    // Calculate the number of items to skip
    const skip = (page - 1) * limit;

    // Fetch the members for the current page
    const members = await User.find({ shop: shopId })
      .skip(skip)
      .limit(limit);

    // Fetch the total number of members
    const totalMembers = await User.countDocuments({ shop: shopId });

    // Calculate total pages
    const totalPages = Math.ceil(totalMembers / limit);

    res.status(200).json({
      success: true,
      members,
      pagination: {
        page,
        limit,
        totalMembers,
        totalPages,
        hasNextPage: page * limit < totalMembers,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    console.error('Error fetching all members:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};

// @desc Edit a member by ID
// @route PUT /api/members/:id
// @access private
const updateMember = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    console.log(id);
    console.log(req.body);

    // Find the member by ID and update it
    const updatedMember = await User.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedMember) {
      return res.status(404).json({ success: false, error: 'Member not found' });
    }

    res.status(200).json({ success: true, data: updatedMember });
  } catch (error) {
    console.error('Error editing member:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};

// @desc Delete a member by ID
// @route DELETE /api/members/:id
// @access private
const deleteMember = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the member by ID and delete it
    const deletedMember = await User.findByIdAndDelete(id);

    if (!deletedMember) {
      return res.status(404).json({ success: false, error: 'Member not found' });
    }

    res.status(200).json({ success: true, data: deletedMember, message: 'Member deleted successfully' });
  } catch (error) {
    console.error('Error deleting member:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};

module.exports = { getAllMembers, updateMember, deleteMember, addMember, };
