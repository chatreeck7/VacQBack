const mongoose = require('mongoose');

// async function is used to connect to the database 
// by await mongoose.connect(process.env.MONGO_URI)
const connectDB = async () => {
    mongoose.set('strictQuery', true);
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`); 
    // conn.connection.host is the host name of the database
}

module.exports = connectDB;