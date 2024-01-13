var express = require('express');
var router = express.Router();
const {protect} = require("../middleware/check-auth");

const {DailyTransactions,DailyTransactionsAll,editDailyTransaction} = require("../controllers/dailyentryController")
const {OnlineSales} = require("../controllers/dashboardController")
const {PersonsWithDue} = require("../controllers/khatabookController")




router.get('/online-sales/monthly/',protect,OnlineSales);


router.get('/PersonsWithDue',protect,PersonsWithDue);

router.post('/DailyTransactions',DailyTransactions);
router.get('/DailyTransactions/all',DailyTransactionsAll);
router.put('/DailyTransactions/:id', editDailyTransaction);


module.exports = router;
