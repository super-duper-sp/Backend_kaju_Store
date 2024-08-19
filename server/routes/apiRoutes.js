var express = require('express');
var router = express.Router();
const {protect} = require("../middleware/check-auth");

const {DailyTransactions,DailyTransactionsAll,deleteDailyTransaction,editDailyTransaction} = require("../controllers/dailyentryController")
const {OfflineSalesAmount ,OfflineSalesAmountYearly,OfflineSalesAmountMonthlyYearly , TotalRevenue,getHighestMonthlySales , getLowestMonthlySales , getAverageSales} = require("../controllers/dashboardController")
const {PersonsWithDue} = require("../controllers/khatabookController")
const {getAllMembers , updateMember , deleteMember , addMember} = require("../controllers/memberController")

router.get('/offline-sales-monthly/',protect,OfflineSalesAmount);
router.get('/offline-sales-yearly/:year',protect,OfflineSalesAmountYearly)
router.get('/offline-sales-month-year/:year',protect,OfflineSalesAmountMonthlyYearly)

//analysis
router.get('/total-revenue',protect,TotalRevenue)

// Get highest monthly sales
router.get('/highest-monthly-sales', protect,getHighestMonthlySales);

// Get lowest monthly sales
router.get('/lowest-monthly-sales',protect, getLowestMonthlySales);


router.get('/average-sales', protect, getAverageSales);


router.get('/shopmember',protect,getAllMembers);
router.put('/shopmember/:id',protect,updateMember)
router.delete('/shopmember/:id',protect,deleteMember)
router.post('/shopmember',protect,addMember)


router.get('/PersonsWithDue',protect,PersonsWithDue);

router.post('/DailyTransactions',protect,DailyTransactions);
router.get('/DailyTransactions',protect,DailyTransactionsAll);
router.put('/DailyTransactions/:id',protect,editDailyTransaction);
router.delete('/DailyTransactions/:id', protect,deleteDailyTransaction);




module.exports = router;
