const User = require("../models/User");
const jwt = require("jsonwebtoken");
const {
  incrementRegistration,
  incrementLogin,
} = require("./analyticsController");
const sendEmail = require("../utils/sendEmail");

// 🔐 Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// 🔹 REGISTER (Send OTP, do NOT login yet)
exports.register = async (req, res) => {
  try {
    const { name, email, whatsapp, password, role } = req.body;

    // Check if whatsapp already exists
    const existingUser = await User.findOne({ whatsapp });
    if (existingUser) {
      return res.status(400).json({ message: "WhatsApp already registered" });
    }

    // Generate 6 digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const user = await User.create({
      name,
      email,
      whatsapp,
      password,
      role,
      otp,
      otpExpires: Date.now() + 10 * 60 * 1000, // 10 minutes
      isVerified: false,
    });

    // Send OTP email
    await sendEmail(
      email,
      "Your OTP Code - ZapTask",
      `Your verification code is: ${otp}`
    );

    // Increment registration analytics
    await incrementRegistration();

    res.status(200).json({
      message: "OTP sent to your email",
      userId: user._id,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔹 VERIFY OTP
exports.verifyOtp = async (req, res) => {
  try {
    const { userId, otp } = req.body;

    const user = await User.findById(userId);

    if (!user)
      return res.status(404).json({ message: "User not found" });

    if (user.otp !== otp)
      return res.status(400).json({ message: "Invalid OTP" });

    if (user.otpExpires < Date.now())
      return res.status(400).json({ message: "OTP expired" });

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;

    await user.save();

    res.status(200).json({
      message: "Account verified successfully",
      token: generateToken(user._id),
      user,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔹 LOGIN
exports.login = async (req, res) => {
  try {
    const { whatsapp, password } = req.body;

    const user = await User.findOne({ whatsapp });

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Login failed" });
    }

    // 🚨 Block login if not verified
    if (!user.isVerified) {
      return res.status(401).json({
        message: "Please verify your email before login",
      });
    }

    // Increment login analytics
    await incrementLogin();

    res.status(200).json({
      message: "Login successful",
      token: generateToken(user._id),
      user,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};