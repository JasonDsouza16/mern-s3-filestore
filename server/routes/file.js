const express = require("express");
const router = express.Router();
const ffmpeg = require("fluent-ffmpeg");
const File = require("../models/File");
const s3 = require("../config/s3Config");
const { PassThrough } = require("stream");

// Endpoint to get list of uploaded files
router.get("/", async (req, res) => {
  try {
    const files = await File.find();
    res.status(200).json(files);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch files", error: err.message });
  }
});

// Function to get file duration using fluent-ffmpeg
const getFileDuration = (stream) => {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(stream, (err, metadata) => {
      if (err) {
        return reject(err);
      }
      const duration = metadata.format.duration;
      resolve(duration);
    });
  });
};

// Function to check if file is audio or video
const isAudioOrVideo = (mimetype) => {
  const allowedTypes = ["audio/", "video/"];
  return allowedTypes.some((type) => mimetype.startsWith(type));
};

// File upload endpoint
router.post("/", async (req, res) => {
  const file = req.files.file;
  const metadata = req.body;

  // Check file type
  if (!isAudioOrVideo(file.mimetype)) {
    return res.status(400).json({
      message: "Invalid file type. Please upload a valid audio or video file.",
    });
  }

  // Create a PassThrough stream from the file buffer
  const passThroughStream = new PassThrough();
  passThroughStream.end(file.data);

  try {
    // Get the file duration
    const duration = await getFileDuration(passThroughStream);
    console.log("Duration:", duration);
    if (duration === undefined) {
      return res.status(400).json({
        message:
          "Could not determine file duration. Please ensure the file is a valid video or audio format.",
      });
    }
    if (duration > 1800) {
      // 30 minutes = 1800 seconds
      console.log("File greater than 30 mins");
      return res
        .status(400)
        .json({ message: "Please upload a file below 30 mins." });
    }

    // Upload to S3
    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: `${Date.now()}_${file.name}`,
      Body: file.data,
      ContentType: file.mimetype,
    };

    s3.upload(params, async (err, data) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "Failed to upload file to S3", error: err.message });
      }
      console.log(data.Location);

      // Save metadata to MongoDB
      const newFile = new File({
        title: metadata.title,
        description: metadata.description,
        s3Url: data.Location,
      });

      try {
        await newFile.save();
        res.status(200).json({ message: "File uploaded successfully" });
      } catch (err) {
        res.status(500).json({
          message: "Failed to save file metadata to database",
          error: err.message,
        });
      }
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to process file", error: err.message });
  }
});

module.exports = router;
