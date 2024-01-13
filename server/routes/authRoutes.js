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


const {registerUser , currentUser , logoutUser, loginUser , test} = require('../controllers/authController');
// const validateToken = require('../middleware/validateTokenHandler');
// router.get('/current', validateToken ,currentUser);


router.post('/register',registerUser);
router.post('/login',loginUser);
router.post('/logout', logoutUser);

router.get('/', protect ,test);




module.exports = router;