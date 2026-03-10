const jwt = require("jsonwebtoken");
const userRepository = require("../repositories/userRepository");

const {
  incrementRegistration,
  incrementLogin
} = require("./analyticsService");

const MAX_LOGIN_ATTEMPTS = 7;
const LOCK_TIME = 5 * 60 * 1000;

/* ===============================
   GENERATE TOKEN
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
   REGISTER USER
================================ */
const registerUser = async ({ name, email, password, role }) => {

  const existingUser = await userRepository.findByEmail(email);

  if (existingUser) {
    throw new Error("Email already registered");
  }

  const user = await userRepository.createUser({
    name,
    email,
    password,
    role
  });

  try {
    await incrementRegistration();
  } catch (err) {
    console.error("Registration analytics error:", err.message);
  }

  const safeUser = {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  return {
    token: generateToken(user._id),
    user: safeUser
  };
};

/* ===============================
   LOGIN USER
================================ */
const loginUser = async ({ email, password }) => {

  const user = await userRepository.findByEmail(email);

  if (!user) {
    throw new Error("Invalid credentials");
  }

  if (user.isLocked) {
    const error = new Error("Account temporarily locked due to failed attempts.");
    error.status = 423;
    throw error;
  }

  const isMatch = await user.matchPassword(password);

  if (!isMatch) {

    user.loginAttempts += 1;

    if (user.loginAttempts >= MAX_LOGIN_ATTEMPTS) {
      user.lockUntil = Date.now() + LOCK_TIME;
      user.loginAttempts = 0;
    }

    await userRepository.saveUser(user);

    throw new Error("Invalid credentials");
  }

  user.loginAttempts = 0;
  user.lockUntil = undefined;

  await userRepository.saveUser(user);

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

  return {
    token: generateToken(user._id),
    user: safeUser
  };
};

module.exports = {
  registerUser,
  loginUser
};