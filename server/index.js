// backend/app.js
const express = require('express');
const mongoose = require('mongoose');
const fileUpload = require('express-fileupload');
// const aws = require('aws-sdk');
const ffmpeg = require('fluent-ffmpeg');
const app = express();
const cors = require('cors');
require('dotenv').config();
 
// Middleware
app.use(cors());
app.use(express.json());
app.use(fileUpload());
 
// MongoDB connection
mongoose.connect('mongodb://localhost:27017/mern-s3-filestore', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const fileRoutes = require('./routes/file');
app.use('/api/file', fileRoutes);
 
app.listen(5000, () => {
  console.log('Server is running on port 5000');
});

// module.exports = s3;
