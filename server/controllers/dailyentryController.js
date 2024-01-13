const  DailyTransactionModel = require('../model/dailyTransaction')

//@desc add DailyTransactions to database
//@route POST /api/DailyTransactions
//@access public
const DailyTransactions = async (req, res) => {
  try {
    const postData = req.body;
    const newTransaction = new DailyTransactionModel(postData);
    await newTransaction.save();
    res.status(201).json({ success: true, data: newTransaction });
  } catch (error) {
    console.error('Error adding DailyTransaction:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};



//@desc Get all DailyTransactions on frontend
//@route GET /api/DailyTransactions/all
//@access public

const DailyTransactionsAll = async (req, res) => {
  try {
    const allTransactions = await DailyTransactionModel.find();

    res.status(200).json(allTransactions);
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

module.exports = { DailyTransactions, DailyTransactionsAll, editDailyTransaction };
