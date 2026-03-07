require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const helmet = require("helmet");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const userRoutes = require("./routes/userRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");

const ApiError = require("./utils/ApiError");

const app = express();


// -------------------------
// Database Connection
// -------------------------

connectDB();


// -------------------------
// Security Middleware
// -------------------------

app.use(helmet());

app.use(cors({
  origin: ["http://localhost:5173"],
  credentials: true
}));

app.use(express.json());

app.use(mongoSanitize());


// -------------------------
// Rate Limiting
// -------------------------

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  message: "Too many requests from this IP, please try again later."
});

app.use(globalLimiter);


// -------------------------
// Routes
// -------------------------

app.get("/", (req, res) => {
  res.status(200).json({
    message: "EarnMinute API Running"
  });
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/tasks", taskRoutes);
app.use("/api/v1/applications", applicationRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/analytics", analyticsRoutes);


// -------------------------
// 404 Handler
// -------------------------

app.use((req, res, next) => {
  next(new ApiError(404, "Route not found"));
});


// -------------------------
// Global Error Handler
// -------------------------

app.use((err, req, res, next) => {

  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    message: err.message || "Server Error"
  });

});


// -------------------------
// Server Start
// -------------------------

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running securely on port ${PORT}`);
});