const PersonsWithDueData = [
    { Name: "John Doe", DueAmount: 50, Phone: 9993620170 },
    { Name: "Jane Smith", DueAmount: 2000, Phone: 7987206794 },
   
    // Add more persons as needed
  ];

//@desc Get all PersonsWithDue
//@route GET /api/PersonsWithDue
//@access public

const  PersonsWithDueModel = require('../model/personWithDue')

const PersonsWithDue = (req, res) => {

      
       
        res.status(201).json(PersonsWithDueData);
};


module.exports = {PersonsWithDue};
