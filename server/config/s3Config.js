const AWS = require('aws-sdk');
 
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: process.env.AWS_REGION,  // Ensure this is in your .env file
});
 
module.exports = s3;