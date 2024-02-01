var express = require('express');
var router = express.Router();
const {protect} = require("../middleware/check-auth");

const { postShopInfo , getShopInfo ,updateShopInfo} = require("../controllers/shopController")


router.get('/',protect,getShopInfo);
router.post('/',protect,postShopInfo);
router.put('/',protect,updateShopInfo);




module.exports = router;
