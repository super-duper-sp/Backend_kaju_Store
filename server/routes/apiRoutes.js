var express = require('express');
var router = express.Router();
const {protect} = require("../middleware/check-auth");

const {DailyTransactions,DailyTransactionsAll,deleteDailyTransaction,editDailyTransaction} = require("../controllers/dailyentryController")
const {OnlineSales} = require("../controllers/dashboardController")
const {PersonsWithDue} = require("../controllers/khatabookController")




router.get('/online-sales/monthly/',protect,OnlineSales);


router.get('/PersonsWithDue',protect,PersonsWithDue);

router.post('/DailyTransactions',DailyTransactions);
router.get('/DailyTransactions',DailyTransactionsAll);
router.put('/DailyTransactions/:id',editDailyTransaction);
router.delete('/DailyTransactions/:id', deleteDailyTransaction);



module.exports = router;
