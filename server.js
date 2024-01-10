require('dotenv').config();
const express = require('express');
const { loginDBConn, productsDBConn } = require('./config/dbConnect');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const multer = require('multer');
const path = require('path');

const { logger } = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler');
const verifyJWT = require('./middleware/verifyJWT');
const cookieParser = require('cookie-parser');
const credentials = require('./middleware/credentials');
const verifyRoles = require('./middleware/verifyRoles');
const ROLES_LIST = require('./config/roles_list');

const app = express();
const PORT = process.env.PORT || 3501;

app.use(logger);
app.use(credentials);
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './images');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
var upload = multer({ storage: storage });

// Define routes
// For static files
app.use('/images', express.static('images'));

app.use('/signup', require('./routes/authRoutes/signup'));
app.use('/login', require('./routes/authRoutes/auth'));
app.use('/refresh', require('./routes/authRoutes/refresh'));
app.use('/logout', require('./routes/authRoutes/logout'));

app.use(verifyJWT);

app.post('/product/add-product/:category', verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), upload.array('images', 10), require('./controller/productController').addProduct);
app.use('/products', require('./routes/api/productsApi'));
app.use('/product', require('./routes/api/productApi'));
app.use('/brands', require('./routes/api/brandsApi'));
app.use('/categories', require('./routes/api/categoryApi'));

app.use(errorHandler);

Promise.all([
  new Promise(resolve => loginDBConn.once('connected', resolve)),
  new Promise(resolve => productsDBConn.once('connected', resolve)),
])
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.log("Error in connecting");
  });