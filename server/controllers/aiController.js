const  DailyTransactionModel = require('../model/dailyTransaction')
const Shop = require('../model/shopModel');
const User = require('../model/userModel');
const axios = require('axios');
const geminiAI = require('../utils/geminiAI');

//@desc Get all DailyTransactions with pagination
//@route GET /api/DailyTransactions
//@access public
const getAll = async (req, res) => {
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


 



  const getAI = async (req, res) => {
    try {
      // Validate request body
      const prompt = req.body.prompt;
      // Call the Gemini AI function
      const aiResponse = await geminiAI(prompt);
  
      // Send AI response back to the client
      res.status(200).json({ "result": aiResponse });
    } catch (error) {
      console.error("Error fetching AI response:", error);
  
      // Return error details with status code 500
      res.status(500).json({ error: "An error occurred while processing your request", details: error.message });
    }
  };
  

  




  module.exports = {
    getAll , getAI
  };