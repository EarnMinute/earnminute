const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");

const {
  incrementRegistration,
  incrementLogin,
} = require("./analyticsController");

const MAX_LOGIN_ATTEMPTS = 7;
const LOCK_TIME = 5 * 60 * 1000;

/* ===============================
   GENERATE JWT TOKEN
================================ */
const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
      issuer: "earnminute-api",
      audience: "earnminute-client",
    }
  );
};

/* ===============================
   REGISTER
================================ */
exports.register = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, role } = req.body;

    /* PASSWORD VALIDATION */
    if (!/^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(password)) {
      return res.status(400).json({
        message: "Password must contain letters and numbers (min 8 chars).",
      });
    }

    /* CHECK EXISTING USER */
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "Email already registered",
      });
    }

    console.log("New registration attempt from IP:", req.ip);

    /* CREATE USER */
    const user = await User.create({
      name,
      email,
      password,
      role,
    });

    /* ANALYTICS TRACKING */
    try {
      await incrementRegistration();
    } catch (err) {
      console.error("Registration analytics error:", err.message);
    }

    /* SAFE USER OBJECT */
    const safeUser = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    res.status(201).json({
      message: "Registration successful",
      token: generateToken(user._id),
      user: safeUser,
    });

  } catch (error) {
    res.status(500).json({
      message: "Registration failed",
      error: error.message,
    });
  }
};

/* ===============================
   LOGIN
================================ */
exports.login = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    /* FIND USER */
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    /* ACCOUNT LOCK CHECK */
    if (user.isLocked) {
      return res.status(423).json({
        message: "Account temporarily locked due to failed attempts.",
      });
    }

    /* PASSWORD MATCH */
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      user.loginAttempts += 1;

      if (user.loginAttempts >= MAX_LOGIN_ATTEMPTS) {
        user.lockUntil = Date.now() + LOCK_TIME;
        user.loginAttempts = 0;
      }

      await user.save();

      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    /* SUCCESSFUL LOGIN RESET */
    user.loginAttempts = 0;
    user.lockUntil = undefined;

    await user.save();

    /* ANALYTICS TRACKING */
    try {
      await incrementLogin();
    } catch (err) {
      console.error("Login analytics error:", err.message);
    }

    const safeUser = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    res.status(200).json({
      message: "Login successful",
      token: generateToken(user._id),
      user: safeUser,
    });

  } catch (error) {
    res.status(500).json({
      message: "Login failed",
      error: error.message,
    });
  }
};