require('dotenv').config();
const express = require('express');
const { adminProductsDBConn, userProductsDBConn } = require('./config/dbConnect');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const multer = require('multer');
const path = require('path');
const axios = require('axios');

const { logger } = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler');
const verifyJWT = require('./middleware/verifyJWT');
const cookieParser = require('cookie-parser');
const credentials = require('./middleware/credentials');
const verifyRoles = require('./middleware/verifyRoles');
const ROLES_LIST = require('./config/roles_list');
const { getBrandsByCategory } = require('./controller/brandController');
const { addProduct } = require('./controller/productController');

const app = express();
const PORT = process.env.PORT || 3501;

app.use(logger);
app.use(credentials);
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
const storage = multer.memoryStorage();
const upload = multer({ storage }).array('images');

app.use('/products', require('./routes/api/productsApi'));
app.use('/product', require('./routes/api/productApi'));

app.use(verifyJWT);

app.post('/product/add-product/:category', verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), async (req, res, next) => {
  try {
    upload(req, res, async (err) => {
      if (err) {
        console.error('Error uploading images:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
      const images = req.files;
      const formDataToSend = new FormData();
      images.forEach((image, index) => {
        const blob = new Blob([image.buffer], { type: image.mimetype });
        formDataToSend.append('images', blob, image.originalname);
      });
      const imageServerResponse = await axios.post(
        'http://localhost:3502/images/add',
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `${req.headers.authorization || req.headers.Authorization}`,
          },
        }
      );
      req.imageFiles = imageServerResponse?.data?.uploadedFiles;
      next();
    });
  } catch (error) {
    console.error('Error uploading data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
},
  addProduct
);

app.get('/get-brands-by-category/:category', verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), getBrandsByCategory);
app.use('/brands', require('./routes/api/brandsApi'));
app.use('/categories', require('./routes/api/categoryApi'));

app.use(errorHandler);

Promise.all([
  new Promise(resolve => adminProductsDBConn.once('connected', resolve)),
  new Promise(resolve => userProductsDBConn.once('connected', resolve))
])
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.log("Error in connecting");
  });