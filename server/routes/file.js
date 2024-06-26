// backend/routes/upload.js
const express = require("express");
const router = express.Router();
const ffmpeg = require("fluent-ffmpeg");
const File = require("../models/File");
const s3 = require("../config/s3Config");
//const s3 = require('../index')

// Endpoint to get list of uploaded files
router.get("/", async (req, res) => {
  try {
    const files = await File.find();
    res.status(200).json(files);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// File upload endpoint
router.post("/", async (req, res) => {
  const file = req.files.file;
  const metadata = req.body;
  console.log(req.body)

  // Check file duration (assuming video file here)
//   ffmpeg.ffprobe(file.data, (err, metadata) => {
//     if (err) {
//       return res.status(500).send(err);
//     }

//     const duration = metadata.format.duration;
//     if (duration > 1800) {
//       // 30 minutes = 1800 seconds
//       return res.status(400).send("File duration exceeds 30 minutes");
//     }

    // Upload to S3
    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: `${Date.now()}_${file.name}`,
      Body: file.data,
      ContentType: file.mimetype,
    };

    s3.upload(params, async(err, data) => {
      if (err) {
        return res.status(500).send(err);
      }

    console.log(data.Location)

      // Save metadata to MongoDB
      const newFile = new File({
        title: metadata.title,
        description: metadata.description,
        s3Url: data.Location,
      });

      try {
        await newFile.save();
    
        res.status(200).send(newFile);
      } catch (err) {
        res.status(500).json({ message: err.message });
      }


    });
  });
// });

module.exports = router;
