var express = require('express');
var router = express.Router();
const { getAll , getAI } = require('../controllers/aiController');
const {protect} = require("../middleware/check-auth");

router.get('/all', protect,getAll);


router.get('/chat' , getAI)


module.exports = router;