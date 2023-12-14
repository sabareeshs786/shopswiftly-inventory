require('dotenv').config()
const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const connectDB = require('./config/dbConnect');
const Mobile = require('./models/mobiles');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const { getNonNullUndefinedProperties } = require('./utils');

const app = express();
const PORT = process.env.PORT || 3501;

// Connect to MongoDB (make sure your MongoDB server is running)
connectDB();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

const Image = Mobile;

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));
app.use('/items', require('./routes/api/items'));

app.post('/upload', upload.single('image'), async (req, res) => {
  try {
    const { name, description, price, brand, ram, storage, batteryCapacity } = req.body;
    const imageUrl = req.file.filename;
    const notNullUndefined = getNonNullUndefinedProperties({name, description, price, brand, ram, storage, batteryCapacity, imageUrl});
    
    const newImage = new Image(notNullUndefined);
    await newImage.save();
    
    res.status(201).json({ message: 'Image uploaded successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
