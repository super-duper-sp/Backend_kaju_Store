const  mongoose = require('mongoose')

const DuePersonSchema = new mongoose.Schema({
  Name: {
    type: String
  },
  DueAmount: Number,
  Phone: Number,
});

const DuePersonModel = mongoose.model('DuePerson', DuePersonSchema);

module.exports= DuePersonModel;