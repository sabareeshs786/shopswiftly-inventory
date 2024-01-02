require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const connectDB = require('./config/dbConnect');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');

const { logger } = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler');
const verifyJWT = require('./middleware/verifyJWT');
const cookieParser = require('cookie-parser');
const credentials = require('./middleware/credentials');

const app = express();
const PORT = process.env.PORT || 3501;

connectDB();

app.use(logger);
app.use(credentials);
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// Define routes
// For static files
app.use('/images', express.static('images'));

app.use('/signup', require('./routes/authRoutes/signup'));
app.use('/login', require('./routes/authRoutes/auth'));
app.use('/refresh', require('./routes/authRoutes/refresh'));
app.use('/logout', require('./routes/authRoutes/logout'));

app.use(verifyJWT);

app.use('/products', require('./routes/api/productsApi'));
app.use('/product', require('./routes/api/productApi'));
app.use('/brands', require('./routes/api/brandsApi'));
app.use('/categories', require('./routes/api/categoryApi'));

app.use(errorHandler);

mongoose.connection.once('open', () => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});