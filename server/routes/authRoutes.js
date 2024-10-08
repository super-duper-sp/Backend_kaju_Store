var express = require('express');
var router = express.Router();
const cors = require("cors");

const { protect } =require('../middleware/check-auth')


// app.use(
//     cors({
//         credentials: true,
//         origin: 'http://localhost:3001/'
//     })
//     );


const {registerUser , getUserProfile , updateUserProfile,logoutUser, loginUser } = require('../controllers/authController');
// const validateToken = require('../middleware/validateTokenHandler');
// router.get('/current', validateToken ,currentUser);


router.post('/register',registerUser);
router.post('/login',loginUser);
router.post('/logout', logoutUser);

router.get("/profile",protect,getUserProfile)
router.put("/profile",protect,updateUserProfile)







module.exports = router;