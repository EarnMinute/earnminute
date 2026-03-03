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

// 🔹 REGISTER (Email Only - Dev Mode)
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if email already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      // If verified user exists → block
      if (existingUser.isVerified) {
        return res.status(400).json({
          message: "Email already registered",
        });
      }

      // If not verified → regenerate OTP
      existingUser.otp = Math.floor(
        100000 + Math.random() * 900000
      ).toString();
      existingUser.otpExpires = Date.now() + 10 * 60 * 1000;

      await existingUser.save();

      await sendEmail(
        existingUser.email,
        "Verify Your Email - EarnMinute",
        `Your new OTP is: ${existingUser.otp}`
      );

      return res.status(200).json({
        message: "New OTP sent to your email",
        userId: existingUser._id,
      });
    }

    // Create new user
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const user = await User.create({
      name,
      email,
      password,
      role,
      otp,
      otpExpires: Date.now() + 10 * 60 * 1000,
      isVerified: false,
    });

    await sendEmail(
      user.email,
      "Verify Your Email - EarnMinute",
      `Your OTP is: ${otp}`
    );

    await incrementRegistration();

    res.status(200).json({
      message: "OTP sent to your email",
      userId: user._id,
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);
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

// 🔹 LOGIN (Email Only)
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Login failed" });
    }

    if (!user.isVerified) {
      return res.status(401).json({
        message: "Please verify your email before login",
      });
    }

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