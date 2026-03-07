const express = require("express");
const { body } = require("express-validator");

const authController = require("../controllers/authController");

const router = express.Router();

/* ======================================
   VALIDATORS
====================================== */

const registerValidator = [
  body("name").notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Valid email required"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  body("role").isIn(["freelancer", "employer"])
];

const loginValidator = [
  body("email").isEmail().withMessage("Valid email required"),
  body("password").notEmpty().withMessage("Password required")
];

/* ======================================
   ROUTES
====================================== */

router.post("/register", registerValidator, authController.register);

router.post("/login", loginValidator, authController.login);

module.exports = router;