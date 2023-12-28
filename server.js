require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const connectDB = require('./config/dbConnect');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');

const app = express();
const PORT = process.env.PORT || 3501;

connectDB();

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Define routes
// For static files
app.use('/images', express.static('images'));

app.use('/products', require('./routes/api/productsApi'));
app.use('/product', require('./routes/api/productApi'));
app.use('/brands', require('./routes/api/brandsApi'));

mongoose.connection.once('open', () => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});