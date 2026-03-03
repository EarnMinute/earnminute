const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const analyticsRoutes = require("./routes/analyticsRoutes");
const { incrementVisit } = require("./controllers/analyticsController");

dotenv.config();

const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
const applicationRoutes = require("./routes/applicationRoutes");

const app = express();

app.use(cors({
  origin: "https://earnminute.vercel.app",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

// VERY IMPORTANT — handle preflight
app.options("*", cors());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "https://earnminute.vercel.app");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  next();
});

app.use(express.json());
app.use(async (req, res, next) => {
  if (req.method === "GET" && req.path === "/api/v1/analytics/public") {
    await incrementVisit();
  }
  next();
});

app.get("/", (req, res) => {
  res.send("TaskForce BD API is running 🚀");
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/tasks", taskRoutes);
app.use("/api/v1/applications", applicationRoutes);
app.use("/api/v1/analytics", analyticsRoutes);

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
