const express = require("express");
const mongoose = require("mongoose");
const fileUpload = require("express-fileupload");
const app = express();
const cors = require("cors");
require("dotenv").config();

// Middleware
app.use(cors());
app.use(express.json());
app.use(fileUpload());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const fileRoutes = require("./routes/file");
app.use("/api/file", fileRoutes);

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
