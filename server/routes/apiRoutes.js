var express = require('express');
var router = express.Router();
const {protect} = require("../middleware/check-auth");

const {DailyTransactions,DailyTransactionsAll,deleteDailyTransaction,editDailyTransaction} = require("../controllers/dailyentryController")
const {OfflineSalesAmount ,OfflineSalesAmountYearly,OfflineSalesAmountMonthlyYearly} = require("../controllers/dashboardController")
const {PersonsWithDue} = require("../controllers/khatabookController")
const {getAllMembers , updateMember , deleteMember , addMember} = require("../controllers/memberController")

router.get('/offline-sales-monthly/',protect,OfflineSalesAmount);
router.get('/offline-sales-yearly/:year',protect,OfflineSalesAmountYearly)
router.get('/offline-sales-month-year/:year',protect,OfflineSalesAmountMonthlyYearly)


router.get('/shopmember',protect,getAllMembers);
router.put('/shopmember/:id',protect,updateMember)
router.delete('/shopmember/:id',protect,deleteMember)
router.post('/shopmember',protect,addMember)


router.get('/PersonsWithDue',protect,PersonsWithDue);

router.post('/DailyTransactions',DailyTransactions);
router.get('/DailyTransactions',DailyTransactionsAll);
router.put('/DailyTransactions/:id',editDailyTransaction);
router.delete('/DailyTransactions/:id', deleteDailyTransaction);



module.exports = router;
