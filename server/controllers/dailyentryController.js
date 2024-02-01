const  DailyTransactionModel = require('../model/dailyTransaction')
const Shop = require('../model/shopModel');
const User = require('../model/userModel');
const verifyToken = require("../utils/verifyToken.js");


//@desc add DailyTransactions to database
//@route POST /api/DailyTransactions
//@access public
const DailyTransactions = async (req, res) => {

  try {
    const userToken = req.cookies.jwt;
    if (userToken) {
     // Verify the token using the utility function
     const decoded = verifyToken(userToken, process.env.JWT_SECRET);
     // Assuming the user ID is stored in the decoded object
     const userId = decoded.userId;

    const user = await User.findById(userId);

    const shopId = await Shop.findById(user.shop);

    const { date,
      buyAmount,
      buyNotes,
      sellAmount,
      sellNotes, } = req.body;
    // Create a new instance of the DailyTransactionModel with the request body data
    const newTransaction = new DailyTransactionModel({
      user: userId,
      shop: shopId,
      date,
      buyAmount,
      buyNotes,
      sellAmount,
      sellNotes,
    });
 

    await newTransaction.save();
    res.status(201).json({ success: true, data: newTransaction });
  } 
}
  catch (error) {
    console.error('Error adding DailyTransaction:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};



//@desc Get all DailyTransactions 
//@route GET /api/DailyTransactions
//@access public

const DailyTransactionsAll = async (req, res) => {
  try {

    const userToken = req.cookies.jwt;
    if (userToken) {
     // Verify the token using the utility function
     const decoded = verifyToken(userToken, process.env.JWT_SECRET);
     // Assuming the user ID is stored in the decoded object
     const userId = decoded.userId;

    const user = await User.findById(userId);
    const shopId = user.shop;
    
    const allTransactions = await DailyTransactionModel.find({ shop: shopId });

    res.status(200).json(allTransactions);

  }} catch (error) {
    console.error('Error fetching all DailyTransactions:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};

//@desc Edit a DailyTransaction by ID
//@route PUT /api/DailyTransactions/:id
//@access public
const editDailyTransaction = async (req, res) => {
  try {

    const { id } = req.params;

    const updateData = req.body;

    // Validate the update data if needed

    // Find the transaction by ID and update it
    const updatedTransaction = await DailyTransactionModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    if (!updatedTransaction) {
      return res
        .status(404)
        .json({ success: false, error: 'Transaction not found' });
    }

    res.status(200).json({ success: true, data: updatedTransaction });
  } catch (error) {
    console.error('Error editing DailyTransaction:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};


//@desc Delete a DailyTransaction by ID
//@route DELETE /api/DailyTransactions/:id
//@access public
const deleteDailyTransaction = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the transaction by ID and delete it
    const deletedTransaction = await DailyTransactionModel.findByIdAndDelete(id);

    if (!deletedTransaction) {
      return res
        .status(404)
        .json({ success: false, error: 'Transaction not found' });
    }

    res.status(200).json({ success: true, data: deletedTransaction, message: 'Transaction deleted successfully' });
  } catch (error) {
    console.error('Error deleting DailyTransaction:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};


module.exports = { DailyTransactions, DailyTransactionsAll, deleteDailyTransaction,editDailyTransaction };
