const express = require("express");
require("dotenv").config();
require("./src/config/config");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const cookieParser = require("cookie-parser");

const app = express();

const userRoutes = require("./src/routes/user/user");

app.use(express.json());

app.use(
  cors({
    origin: process.env.FRONTEND_DEV_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

const upload = multer();

app.use(upload.none());

app.use(cookieParser());
app.use("/user", userRoutes);
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

const port = process.env.PORT || 5001;
const ip = process.env.IP || "127.0.0.1";

app.listen(port, ip, () => {
  console.log(`Server running on http://${ip}:${port}`);
});
