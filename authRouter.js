const express = require('express');
const User = require('../models/User')
const jwt = require('jwt-simple');
const bycrpt = require('bcrypt')
const auth = require('../Auth')

const router = express.Router();

//Protected Route
router.get("/profile", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select("name email");

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    return res.status(200).json({
      message: "Authenticated successfully",
      user
    });

  } catch (err) {
    return res.status(500).json({
      message: "Internal server error"
    });
  }
});

//get routes
router.get('/',async function (req,res) {
       try {
    const users = await User.find().select("name email password");

    return res.status(200).json({
      message: "Users fetched successfully",
      users: users
    });
  } catch (err) {
    console.error("Fetch users error:", err);

    return res.status(500).json({
      message: "Internal server error"
    });
  }
})

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email});

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    const isMatch = await bycrpt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    const payload = {
      id: user._id,
      exp: Math.floor(Date.now() / 1000) + 60 * 60
    };
    const key = process.env.SERCRET_key
    const token = jwt.encode(payload,key);

    return res.status(200).json({
      message: "Login successful",
      token:token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (err) {
    console.error("Login error:", err);

    return res.status(500).json({
      message: "Internal server error"
    });
  }
});

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required"
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        message: "Email already registered"
      });
    }

    const user = new User({ name, email, password });
    await user.save();

    return res.status(201).json({
      message: "User registered successfully"
    });
  } catch (err) {
    console.error("Registration error:", err);

    if (err.code === 11000) {
      return res.status(409).json({
        message: "Email already registered"
      });
    }

    return res.status(500).json({
      message: "Internal server error"
    });
  }
});



module.exports = router;
