
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
const OnlineSales = async (req, res) => {
  try {
    // Fetch daily transaction data from the database
    const allTransactions = await DailyTransactionModel.find();

    // Process the data: Calculate sum of sell amounts grouped by year and month
    const groupedData = {};

    allTransactions.forEach((transaction) => {
      // Assuming there is a 'date' property in the transaction object
      const transactionDate = new Date(transaction.date);
      
      // Extract year and month
      const year = transactionDate.getFullYear();
      const month = transactionDate.getMonth() + 1;

      // Create a unique key for the year-month combination
      const key = `${year}-${month}`;

      // Initialize the sum for the year-month if not already present
      if (!groupedData[key]) {
        groupedData[key] = 0;
      }

      // Add the sellAmount to the corresponding year-month sum
      groupedData[key] += transaction.sellAmount;
    });

    // Send the grouped data as a JSON response
    res.status(200).json(groupedData);
  } catch (error) {
    console.error('Error fetching or processing data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};








  


module.exports = {OnlineSales};

