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
  origin: "*"
}));
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

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
    app.listen(process.env.PORT || 5000, () => {
      console.log("Server running on port 5000");
    });
  })
  .catch((err) => console.log(err));
