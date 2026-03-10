const { validationResult } = require("express-validator");

const authService = require("../services/authService");

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

    if (!/^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(password)) {
      return res.status(400).json({
        message: "Password must contain letters and numbers (min 8 chars).",
      });
    }

    const result = await authService.registerUser({
      name,
      email,
      password,
      role
    });

    res.status(201).json({
      message: "Registration successful",
      token: result.token,
      user: result.user
    });

  } catch (error) {

    res.status(error.status || 500).json({
      message: error.message || "Registration failed"
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

    const result = await authService.loginUser({
      email,
      password
    });

    res.status(200).json({
      message: "Login successful",
      token: result.token,
      user: result.user
    });

  } catch (error) {

    res.status(error.status || 401).json({
      message: error.message || "Login failed"
    });

  }

};