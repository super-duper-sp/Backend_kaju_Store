const mongoose = require('mongoose');
const connectDb = async ()=>{
    try {
        const connect = await mongoose.connect(process.env.CONNECTION_STRING);
        console.log("Database Connected:",
        connect.connection.host,
        connect.connection.name
        
        );
        
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
}

module.exports = connectDb;


// mongoose.connect(uri)
// .then(()=>console.log("connected"))
// .catch((e)=>console.log("error",err)); 
