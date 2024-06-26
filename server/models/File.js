// backend/models/File.js
const mongoose = require('mongoose');
 
const fileSchema = new mongoose.Schema({
  title: {type:String, required: true },
  description: {type:String, required: true },
  s3Url: {type:String, required: true },
});
 
module.exports = mongoose.model('File', fileSchema);