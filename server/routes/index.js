var express = require('express');
var router = express.Router();



/* GET home page. */
router.get('/', function(req, res, next) {
  res.send("hello, from backend");
});






// router.post("/create", async (req, res)=>{
// const createdusers = await  userModel.create({
//     username: "shu,knlknlkbham15362",
//     name: "shubihinnnham",
//     age: 23
//   });
//   res.send(createdusers); 
// })



// // router.get('/allusers', async (req,res) => {
// //   let allusers = await userModel.find();
// //   res.send(allusers);
// // })


// router.get('/', async (req,res) => {
//   res.send("hello, from backend");  
// })

// // router.get('/user', async (req,res) => {
// //   let user = await dailyTransactionModel.findOne({username:"shubham15362"});
// //   res.send(user);
// // })

// // router.get('/delete', async (req,res) => {
// //   let  deleteduser = await userModel.findOneAndDelete({username:"shubham15362"});
// //   res.send(deleteduser);
// // })


module.exports = router;
