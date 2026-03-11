const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const { applicationLimiter } = require("./middleware/abuseLimiter");
const morgan = require("morgan");
const http = require("http");
const { Server } = require("socket.io");

dotenv.config();

mongoose.set("strictQuery", true);

const app = express();
const server = http.createServer(app);

/* ===============================
LOGGING
================================ */
if (process.env.NODE_ENV !== "production") {
app.use(morgan("dev"));
}

if (process.env.NODE_ENV === "production") {
app.use(morgan("combined"));
}

/* ===============================
TRUST PROXY (Required for Render)
================================ */
app.set("trust proxy", 1);

/* ===============================
HELMET HARDENED CONFIG
================================ */
app.use(
helmet({
contentSecurityPolicy: {
directives: {
defaultSrc: ["'self'"],
scriptSrc: ["'self'"],
objectSrc: ["'none'"],
upgradeInsecureRequests: [],
},
},
crossOriginEmbedderPolicy: false,
})
);

/* ===============================
GLOBAL RATE LIMIT
================================ */
const globalLimiter = rateLimit({
windowMs: 15 * 60 * 1000,
max: process.env.NODE_ENV === "production" ? 200 : 1000,
standardHeaders: true,
legacyHeaders: false,
});

app.use(globalLimiter);

/* ===============================
AUTH RATE LIMIT
================================ */
const authLimiter = rateLimit({
windowMs: 15 * 60 * 1000,
max: process.env.NODE_ENV === "production" ? 8 : 50,
message: "Too many authentication attempts. Try later.",
standardHeaders: true,
legacyHeaders: false,
});

const registerLimiter = rateLimit({
windowMs: 60 * 60 * 1000,
max: 10,
message: "Too many accounts created from this IP.",
});

/* ===============================
BODY LIMIT + SANITIZATION
================================ */
app.use(express.json({ limit: "10kb" }));
app.use(mongoSanitize());

/* ===============================
CORS
================================ */
const allowedOrigins = [
"http://localhost:5173",
"https://earnminute.vercel.app"
];

app.use(
cors({
origin: function (origin, callback) {
if (!origin) return callback(null, true);


  if (allowedOrigins.includes(origin)) {
    return callback(null, true);
  }

  return callback(new Error("CORS not allowed"));
},
credentials: true,


})
);

/* ===============================
SOCKET.IO SETUP
================================ */
const io = new Server(server, {
cors: {
origin: allowedOrigins,
methods: ["GET", "POST"],
credentials: true,
},
});

app.set("io", io);

io.on("connection", (socket) => {
console.log("Socket connected:", socket.id);

socket.on("chat:join", (conversationId) => {
if (!conversationId) return;
socket.join(conversationId);
});

socket.on("chat:leave", (conversationId) => {
socket.leave(conversationId);
});

socket.on("disconnect", () => {
console.log("Socket disconnected:", socket.id);
});
});

/* ===============================
ROUTES
================================ */
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const userRoutes = require("./routes/userRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const chatRoutes = require("./routes/chatRoutes");

app.get("/", (req, res) => {
res.send("EarnMinute API Secure 🚀");
});

app.use("/api/v1/auth/login", authLimiter);
app.use("/api/v1/auth/register", registerLimiter);

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/tasks", taskRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/applications", applicationLimiter, applicationRoutes);
app.use("/api/v1/analytics", analyticsRoutes);
app.use("/api/v1/notifications", notificationRoutes);
app.use("/api/v1/chat", chatRoutes);

/* ===============================
CENTRAL ERROR HANDLER
================================ */
app.use((err, req, res, next) => {
console.error(err);

res.status(err.statusCode || 500).json({
message:
process.env.NODE_ENV === "production"
? "Something went wrong."
: err.message,
});
});

/* ===============================
DB CONNECTION
================================ */
mongoose
.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected Securely"))
.catch((err) => {
console.error("MongoDB connection error:", err);
process.exit(1);
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, "0.0.0.0", () => {
console.log(`Server running securely on port ${PORT}`);
});
