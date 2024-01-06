const mongoose = require('mongoose');

const connectDB = (dbUri) => {
    try {
        return mongoose.createConnection(dbUri, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
            autoIndex: true
        });
    } catch (err) {
        console.error(err);
    }
};

const loginDBConn = connectDB(process.env.DATABASE_URI_Login);
const productsDBConn =  connectDB(process.env.DATABASE_URI_Products);

module.exports = { loginDBConn, productsDBConn };
