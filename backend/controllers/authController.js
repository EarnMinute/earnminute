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

if (existingUser && existingUser.isVerified) {
  return res.status(400).json({ message: "WhatsApp already registered" });
}

if (existingUser && !existingUser.isVerified) {
  // regenerate OTP instead of blocking
  existingUser.otp = Math.floor(100000 + Math.random() * 900000).toString();
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
  user.email,
  "Verify Your Email - EarnMinute",
  `
  <div style="font-family: Arial, sans-serif; background:#f4f6f8; padding:40px 0;">
    <div style="max-width:500px; margin:auto; background:white; padding:30px; border-radius:8px; box-shadow:0 5px 15px rgba(0,0,0,0.05);">

      <h2 style="color:#111; text-align:center;">Welcome to EarnMinute</h2>

      <p>Hello <strong>${user.name}</strong>,</p>

      <p>Thank you for registering with <strong>EarnMinute</strong>.</p>

      <p>Your verification code is:</p>

      <div style="text-align:center; margin:20px 0;">
        <span style="font-size:28px; letter-spacing:6px; font-weight:bold;">
          ${otp}
        </span>
      </div>

      <p style="color:#d9534f; font-weight:bold;">
        ⚠️ Do not share this code with anyone.
      </p>

      <p>This code will expire in 10 minutes.</p>

      <hr style="margin:25px 0;" />

      <p style="font-size:13px; color:#777;">
        If you did not request this verification, you can safely ignore this email.
      </p>

      <p style="font-size:13px; color:#777;">
        © ${new Date().getFullYear()} EarnMinute. All rights reserved.
      </p>

    </div>
  </div>
  `
);

    // Increment registration analytics
    await incrementRegistration();

    res.status(200).json({
      message: "OTP sent to your email",
      userId: user._id,
    });

  } catch (error) {
    console.error("REGISTER ERROR:", error);  // 👈 ADD THIS LINE
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
