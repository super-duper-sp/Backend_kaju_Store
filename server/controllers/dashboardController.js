
//@desc Get all OnlineSales of monthly wise
//@route GET /api/OnlineSales
//@access public
// json 
// {
//     "2023-11": 99864,
//     "2023-10": 0,
//     "2023-12": 32,
//     "2023-9": 1
// }

const  DailyTransactionModel = require('../model/dailyTransaction')
const User = require('../model/userModel');
const Shop = require('../model/shopModel');
const verifyToken = require("../utils/verifyToken.js");

const OfflineSalesAmount = async (req, res) => {
  try {

    const userToken = req.cookies.jwt;
    if (userToken) {
     // Verify the token using the utility function
     const decoded = verifyToken(userToken, process.env.JWT_SECRET);

     // Assuming the user ID is stored in the decoded object
     const userId = decoded.userId;

    const user = await User.findById(userId);

    const shopId = await Shop.findById(user.shop);

    // Fetch daily transaction data from the database
    const allTransactions = await DailyTransactionModel.find({ shop: shopId });



    const groupedData = {};

    allTransactions.forEach((transaction) => {
      // Assuming there is a 'date' property in the transaction object
      const transactionDate = new Date(transaction.date);
      
      // Extract year and month
      const year = transactionDate.getFullYear();
      const month = transactionDate.getMonth() + 1; // Months are zero-indexed, so add 1
      // console.log("full date:" ,transactionDate);
      // console.log("year:",year);
      // console.log("month:",month);
      // Create a unique key for the year-month combination
      const key = `${year}-${month}`;
     
      // Initialize the sum for the year-month if not already present
      if (!groupedData[key]) {
        groupedData[key] = 0; // You might want to initialize it differently based on your use case
      }
    
      // Add the sellAmount to the corresponding year-month sum
      groupedData[key] += transaction.sellAmount || 0; // Ensure sellAmount is present and numeric
    });
    

    // Send the grouped data as a JSON response
    res.status(200).json(groupedData);
  }
  } catch (error) {
    console.error('Error fetching or processing data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};





const OfflineSalesAmountYearly = async (req, res) => {
  try {
    const { year } = req.params;

    // Check if year is undefined
    if (!year) {
      return res.status(400).json({ error: 'Year is required' });
    }
    
    const userToken = req.cookies.jwt;
   
    if (!userToken) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Verify the token using the utility function
    const decoded = verifyToken(userToken, process.env.JWT_SECRET);

    // Assuming the user ID is stored in the decoded object
    const userId = decoded.userId;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const shopId = user.shop;

    const allTransactions = await DailyTransactionModel.find({ shop: shopId });

    // Calculate the yearly sum based on the transactions
    const yearlySum = calculateYearlySum(allTransactions, year);

   
    // Send the yearly sum as a JSON response
    res.status(200).json({ yearlySum });

  } catch (error) {
    console.error('Error fetching or processing data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const calculateYearlySum = (transactions, year) => {
  let yearlySum = 0;

  transactions.forEach((transaction) => {
    // Assuming there is a 'date' property in the transaction object
    const transactionDate = new Date(transaction.date);

    // Extract year
    const transactionYear = transactionDate.getFullYear();

    if (typeof year !== 'undefined' && transactionYear === parseInt(year, 10)) {
      yearlySum += transaction.sellAmount; // Adjust property name based on your data structure
    }
  });

  return yearlySum;
};


const OfflineSalesAmountMonthlyYearly = async(req,res) => {
  try {
    const { year } = req.params;

    // Check if year is undefined
    if (!year) {
      return res.status(400).json({ error: 'Year is required' });
    }
    
    const userToken = req.cookies.jwt;
   
    if (!userToken) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Verify the token using the utility function
    const decoded = verifyToken(userToken, process.env.JWT_SECRET);

    // Assuming the user ID is stored in the decoded object
    const userId = decoded.userId;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const shopId = user.shop;

    const allTransactions = await DailyTransactionModel.find({ shop: shopId });

    

   
    // Send the yearly sum as a JSON response
    res.status(200).json(calculateMontlyYearlySum(allTransactions, year));

  } catch (error) {
    console.error('Error fetching or processing data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const calculateMontlyYearlySum = (transactions, year) => {
  
  const result = {
    yearlySum: 0,
    monthlySums: {},
  };

  transactions.forEach((transaction) => {
    const transactionDate = new Date(transaction.date);
    const transactionYear = transactionDate.getFullYear();
    const transactionMonth = transactionDate.getMonth() + 1; // Months are zero-indexed

    if (typeof year !== 'undefined' && transactionYear === parseInt(year, 10)) {
      // Update yearly sum
      result.yearlySum += transaction.sellAmount; // Adjust property name based on your data structure

      // Update monthly sum
      if (!result.monthlySums[transactionMonth]) {
        result.monthlySums[transactionMonth] = 0;
      }
      result.monthlySums[transactionMonth] += transaction.sellAmount; // Adjust property name based on your data structure
    }
  });


  return result;
};



module.exports = { OfflineSalesAmount, OfflineSalesAmountYearly ,OfflineSalesAmountMonthlyYearly };


