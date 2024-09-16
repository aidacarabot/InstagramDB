require("dotenv").config();
const express = require("express");
const { connectDB } = require("./src/config/db");
const accountRouter = require("./src/api/routes/account");
const postRouter = require("./src/api/routes/post");
const cloudinary = require("cloudinary").v2;

//Cloudinary configuration:
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME, 
  api_key: process.env.API_KEY, 
  api_secret: process.env.API_SECRET
});

const app = express();

connectDB();
app.use(express.json());

app.use("/api/v1/account", accountRouter);
app.use("/api/v1/post", postRouter);

app.use("*", (req, res, next) => {
  return res.status(404).json("Route not found")
})

app.listen(3000, () => {
  console.log("Server working on: http://localhost:3000");
})