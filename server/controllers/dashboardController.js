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

const DailyTransactionModel = require("../model/dailyTransaction");
const User = require("../model/userModel");
const Shop = require("../model/shopModel");
const geminiAI = require("../utils/geminiAI");

const OfflineSalesAmount = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    console.log(user);

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
  } catch (error) {
    console.error("Error fetching or processing data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const OfflineSalesAmountYearly = async (req, res) => {
  try {
    const { year } = req.params;

    // Check if year is undefined
    if (!year) {
      return res.status(400).json({ error: "Year is required" });
    }


    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const shopId = user.shop;

    const allTransactions = await DailyTransactionModel.find({ shop: shopId });

    // Calculate the yearly sum based on the transactions
    const yearlySum = calculateYearlySum(allTransactions, year);

    // Send the yearly sum as a JSON response
    res.status(200).json({ yearlySum });
  } catch (error) {
    console.error("Error fetching or processing data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const calculateYearlySum = (transactions, year) => {
  let yearlySum = 0;

  transactions.forEach((transaction) => {
    // Assuming there is a 'date' property in the transaction object
    const transactionDate = new Date(transaction.date);

    // Extract year
    const transactionYear = transactionDate.getFullYear();

    if (typeof year !== "undefined" && transactionYear === parseInt(year, 10)) {
      yearlySum += transaction.sellAmount; // Adjust property name based on your data structure
    }
  });

  return yearlySum;
};

const OfflineSalesAmountMonthlyYearly = async (req, res) => {
  try {
    const { year } = req.params;

    // Check if year is undefined
    if (!year) {
      return res.status(400).json({ error: "Year is required" });
    }

    

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const shopId = user.shop;

    const allTransactions = await DailyTransactionModel.find({ shop: shopId });

    // Send the yearly sum as a JSON response
    res.status(200).json(calculateMontlyYearlySum(allTransactions, year));
  } catch (error) {
    console.error("Error fetching or processing data:", error);
    res.status(500).json({ error: "Internal Server Error" });
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

    if (typeof year !== "undefined" && transactionYear === parseInt(year, 10)) {
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


// Total Revenue Function: Calculate revenue for all years
const TotalRevenue = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const shopId = user.shop;
    const allTransactions = await DailyTransactionModel.find({ shop: shopId });

    // Calculate the total revenue for all available data
    const totalRevenue = calculateTotalRevenue(allTransactions);

    const today = new Date(); // Get today's date
 
    // Format today's date
    const formattedToday = today.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });

    const prompt = `
    Analyze the following data:
   
    - Target: ₹${10000000}
    - Date Range: 12 January 2020 - ${formattedToday}
    Provide a brief performance remark. in hindi only in 10 words`;

    const aiComment = await geminiAI(prompt);

    res.status(200).json({ totalRevenue , aiComment});
  } catch (error) {
    console.error("Error fetching or processing data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const calculateTotalRevenue = (transactions) => {
  return transactions.reduce((total, transaction) => total + (transaction.sellAmount || 0), 0);
};


// Helper function to get the year and month from a date
const getYearMonth = (date) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // Months are zero-based
  return `${year}-${month < 10 ? '0' + month : month}`;
};

// Helper function to aggregate sales by month
const aggregateMonthlySales = (transactions) => {
  const monthlySales = {};

  transactions.forEach((transaction) => {
    const monthKey = getYearMonth(new Date(transaction.date));
    if (!monthlySales[monthKey]) {
      monthlySales[monthKey] = 0;
    }
    monthlySales[monthKey] += transaction.sellAmount; // Adjust if you need to aggregate differently
  });

  return monthlySales;
};

// API to get highest monthly sales
const getHighestMonthlySales = async (req, res) => {
  try {
   
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const shopId = user.shop;
    const allTransactions = await DailyTransactionModel.find({ shop: shopId });

    if (!allTransactions.length) {
      return res.status(404).json({ error: "No transactions found" });
    }

    const monthlySales = aggregateMonthlySales(allTransactions);

    const highestMonth = Object.keys(monthlySales).reduce((a, b) => monthlySales[a] > monthlySales[b] ? a : b);
    const highestSales = monthlySales[highestMonth];

    res.status(200).json({ month: highestMonth, sales: highestSales });
  } catch (error) {
    console.error("Error fetching highest monthly sales:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// API to get lowest monthly sales
const getLowestMonthlySales = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const shopId = user.shop;
    const allTransactions = await DailyTransactionModel.find({ shop: shopId });

    if (!allTransactions.length) {
      return res.status(404).json({ error: "No transactions found" });
    }

    const monthlySales = aggregateMonthlySales(allTransactions);

    const lowestMonth = Object.keys(monthlySales).reduce((a, b) => monthlySales[a] < monthlySales[b] ? a : b);
    const lowestSales = monthlySales[lowestMonth];

    res.status(200).json({ month: lowestMonth, sales: lowestSales });
  } catch (error) {
    console.error("Error fetching lowest monthly sales:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


// Calculate average daily sales
const calculateAverageDailySales = (transactions) => {
  const days = new Set();

  transactions.forEach((transaction) => {
    const transactionDate = new Date(transaction.date).toDateString();
    days.add(transactionDate);
  });

  const totalDays = days.size;
  const totalRevenue = transactions.reduce((total, transaction) => total + (transaction.sellAmount || 0), 0);

  return totalDays > 0 ? totalRevenue / totalDays : 0;
};

// Calculate average monthly sales
const calculateAverageMonthlySales = (transactions) => {
  const monthlySales = aggregateMonthlySales(transactions);
  const totalMonths = Object.keys(monthlySales).length;
  const totalRevenue = Object.values(monthlySales).reduce((total, amount) => total + amount, 0);

  return totalMonths > 0 ? totalRevenue / totalMonths : 0;
};

// Calculate average yearly sales
const calculateAverageYearlySales = (transactions) => {
  const yearlySales = {};

  transactions.forEach((transaction) => {
    const transactionDate = new Date(transaction.date);
    const year = transactionDate.getFullYear();

    if (!yearlySales[year]) {
      yearlySales[year] = 0;
    }
    yearlySales[year] += transaction.sellAmount || 0;
  });

  const totalYears = Object.keys(yearlySales).length;
  const totalRevenue = Object.values(yearlySales).reduce((total, amount) => total + amount, 0);

  return totalYears > 0 ? totalRevenue / totalYears : 0;
};

// API to get average daily, monthly, and yearly sales
const getAverageSales = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const shopId = user.shop;
    const allTransactions = await DailyTransactionModel.find({ shop: shopId });

    const averageDailySales = calculateAverageDailySales(allTransactions);
    const averageMonthlySales = calculateAverageMonthlySales(allTransactions);
    const averageYearlySales = calculateAverageYearlySales(allTransactions);

    res.status(200).json({
      averageDailySales,
      averageMonthlySales,
      averageYearlySales,
    });
  } catch (error) {
    console.error("Error fetching average sales:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};



module.exports = {

  getAverageSales,
  getHighestMonthlySales,
  getLowestMonthlySales,
  OfflineSalesAmount,
  OfflineSalesAmountYearly,
  OfflineSalesAmountMonthlyYearly,
  TotalRevenue
};
