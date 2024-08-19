const  DailyTransactionModel = require('../model/dailyTransaction')
const Shop = require('../model/shopModel');
const User = require('../model/userModel');
const verifyToken = require("../utils/verifyToken.js");


//@desc Add DailyTransactions to database
//@route POST /api/DailyTransactions
//@access public
const DailyTransactions = async (req, res) => {

  try{
    const user = await User.findById(req.user._id);
  
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    const shop = await Shop.findById(user.shop);
    if (!shop) {
      return res.status(404).json({ success: false, error: 'Shop not found' });
    }

    const { date, buyAmount, buyNotes, sellAmount, sellNotes } = req.body;

    // Create a new instance of the DailyTransactionModel with the request body data
    const newTransaction = new DailyTransactionModel({
      user: user._id,
      shop: shop._id,
      date,
      buyAmount,
      buyNotes,
      sellAmount,
      sellNotes,
    });

    // Save the new transaction to the database
    await newTransaction.save();

    res.status(201).json({ success: true, data: newTransaction });
  } catch (error) {
    console.error('Error adding DailyTransaction:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};




//@desc Get all DailyTransactions with pagination
//@route GET /api/DailyTransactions
//@access public
const DailyTransactionsAll = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const shopId = user.shop;

    // Pagination parameters
    const page = parseInt(req.query.page, 10) || 1; // Default to page 1 if not provided
    const limit = parseInt(req.query.limit, 10) || 10; // Default to 10 results per page if not provided

    // Filter parameters
    const year = parseInt(req.query.year, 10);
    const month = parseInt(req.query.month, 10);

    

    // Ensure page and limit are positive numbers
    if (page < 1 || limit < 1) {
      return res.status(400).json({ success: false, error: 'Page and limit must be positive numbers' });
    }

    // Calculate skip value
    const skip = (page - 1) * limit;

    // Build the query object
    const query = { shop: shopId };

    if (!isNaN(year)) {
      query.date = { $gte: new Date(`${year}-01-01`), $lt: new Date(`${year + 1}-01-01`) };
    }

    if (!isNaN(month)) {
      // Assuming month is a 1-based index (1 for January, 2 for February, etc.)
      if (!isNaN(year)) {
        query.date = {
          ...query.date,
          $gte: new Date(`${year}-${month.toString().padStart(2, '0')}-01`),
          $lt: new Date(`${year}-${(month + 1).toString().padStart(2, '0')}-01`)
        };
      } else {
        // If year is not provided, you might want to filter based on the current year
        const currentYear = new Date().getFullYear();
        query.date = {
          $gte: new Date(`${currentYear}-${month.toString().padStart(2, '0')}-01`),
          $lt: new Date(`${currentYear}-${(month + 1).toString().padStart(2, '0')}-01`)
        };
      }
    }

    // Get the total count of transactions
    const totalTransactions = await DailyTransactionModel.countDocuments(query);

    // Fetch the transactions with pagination
    const transactions = await DailyTransactionModel.find(query)
      .skip(skip)
      .limit(limit)
      .exec();

    // Respond with paginated results
    res.status(200).json({
      success: true,
      data: transactions,
      pagination: {
        total: totalTransactions,
        page,
        limit,
        totalPages: Math.ceil(totalTransactions / limit),
        hasNextPage: page * limit < totalTransactions,
        hasPrevPage: page > 1
      }
    });

  } catch (error) {
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
console.log(id);
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
