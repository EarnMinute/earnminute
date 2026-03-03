const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");

dotenv.config();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: "Too many login attempts. Try again later.",
});
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const { incrementVisit } = require("./controllers/analyticsController");

const app = express();

// 🔐 Helmet Security Headers
app.use(helmet());

// 🚦 Rate Limiting (Global)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // limit each IP to 200 requests per window
  message: "Too many requests from this IP, please try again later.",
});

app.use(limiter);
app.use(mongoSanitize());

// 🔐 Environment-based CORS
const allowedOrigins =
  process.env.NODE_ENV === "production"
    ? ["https://earnminute.vercel.app"]
    : ["http://localhost:5173"];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Body parser
app.use(express.json());

// Analytics visit tracking
app.use(async (req, res, next) => {
  if (req.method === "GET" && req.path === "/api/v1/analytics/public") {
    await incrementVisit();
  }
  next();
});

// Root route
app.get("/", (req, res) => {
  res.send("EarnMinute API is running 🚀");
});

// Routes
app.use("/api/v1/auth", authLimiter, authRoutes);
app.use("/api/v1/tasks", taskRoutes);
app.use("/api/v1/applications", applicationRoutes);
app.use("/api/v1/analytics", analyticsRoutes);

// 🛑 Central Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);

  res.status(500).json({
    message:
      process.env.NODE_ENV === "production"
        ? "Something went wrong."
        : err.message,
  });
});

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});