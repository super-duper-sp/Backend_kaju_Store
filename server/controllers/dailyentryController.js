const  DailyTransactionModel = require('../model/dailyTransaction')
const Shop = require('../model/shopModel');
const User = require('../model/userModel');
const verifyToken = require("../utils/verifyToken.js");


//@desc Add DailyTransactions to database
//@route POST /api/DailyTransactions
//@access public
const DailyTransactions = async (req, res) => {
  try {
    // Fetch the user based on the request's user ID
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    // Fetch the shop based on the user's shop ID
    const shop = await Shop.findById(user.shop);
    if (!shop) {
      return res.status(404).json({ success: false, error: 'Shop not found' });
    }

    // Ensure date is provided and correctly formatted
    const { date, buyAmount, buyNotes, sellAmount, sellNotes } = req.body;
    if (!date) {
      return res.status(400).json({ success: false, error: 'Date is required' });
    }
    console.log("aur-pehle"+date);

    // Parse and normalize the date (set time to 00:00:00)
    const transactionDate = new Date(date);
    if (isNaN(transactionDate.getTime())) {
      return res.status(400).json({ success: false, error: 'Invalid date format' });
    }

    console.log("pehle"+transactionDate);

    // Normalize the date to just the date part (e.g., YYYY-MM-DD)
    const normalizedDate = transactionDate.toISOString().split('T')[0];
    console.log("bad"+normalizedDate);

    // Check if a transaction already exists for the given shop and normalized date
    const existingTransaction = await DailyTransactionModel.findOne({
      shop: shop._id,
      normalizedDate,
    });

    if (existingTransaction) {
      if (existingTransaction.user.equals(user._id)) {
        // Allow updates if the transaction belongs to the current user
        existingTransaction.buyAmount = buyAmount;
        existingTransaction.buyNotes = buyNotes;
        existingTransaction.sellAmount = sellAmount;
        existingTransaction.sellNotes = sellNotes;

        // Save the updated transaction
        await existingTransaction.save();

        return res.status(200).json({ success: true, data: existingTransaction });
      } else {
        // Prevent creation if a transaction with the same shop and normalized date already exists, but allow updates
        return res.status(403).json({ success: false, error: 'Transaction for this date already exists and cannot be created by another user' });
      }
    } else {
      // Create a new transaction if none exists for the given shop and normalized date
      const newTransaction = new DailyTransactionModel({
        user: user._id,
        shop: shop._id,
        date: normalizedDate, // Store the full date with time
        normalizedDate,       // Store the normalized date (YYYY-MM-DD)
        buyAmount,
        buyNotes,
        sellAmount,
        sellNotes,
      });

      // Save the new transaction to the database
      await newTransaction.save();

      return res.status(201).json({ success: true, data: newTransaction });
    }
  } catch (error) {
    console.error('Error processing DailyTransaction:', error);
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
    const limit = parseInt(req.query.limit,10) || 10; // Default to 10 results per page if not provided

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
          $lt: new Date(
            `${month === 12 ? year + 1 : year}-${(month === 12 ? 1 : month + 1)
              .toString()
              .padStart(2, '0')}-01`)
        };
      } else {
      
        query.normalizedDate = {
         
            $regex: `^\\d{4}-${month}-`, // Matches the specific month dynamically
            $options: "i"
          
          
          
        };
      }
    }

    // Get the total count of transactions
    const totalTransactions = await DailyTransactionModel.countDocuments(query);

    console.log("my query",query)
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

    console.log("okok");

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
