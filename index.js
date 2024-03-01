const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const userRoute=require("./routes/users")
const authRoute=require("./routes/auth")
const postRoute=require("./routes/post")
dotenv.config();

// MongoDB connection
mongoose.connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });

// Middleware
app.use(express.json());
app.use(helmet()); // Enhance security with Helmet
app.use(morgan("common")); // Log HTTP requests

// Routes
app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/post", postRoute);
// Define your routes here...

  
// Start the server
const PORT = 8800;
app.listen(PORT, () => {
  console.log(`Backend Server is running on port ${PORT}`);
});
