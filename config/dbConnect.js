const mongoose = require('mongoose');

const connectDB = (dbUri) => {
    try {
        return mongoose.createConnection(dbUri, {
            autoIndex: true
        });
    } catch (err) {
        console.error(err);
    }
};

const productsDBConn =  connectDB(process.env.DATABASE_URI_Products);

module.exports = { productsDBConn };