
const dns = require("node:dns");
// Fix DNS SRV lookup
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const express = require("express");
const mongoose = require("mongoose");
const authRouter = require("./Routes/authRouter");


require("dotenv").config();

const app = express();

app.use(express.json());
app.use("/api/auth", authRouter);

mongoose.connect(process.env.Atlas_URL)
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch(err => {
    console.log(err);
  });

app.get("/", (req, res) => {
  res.send("Welcome to the Backend");
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});



    
