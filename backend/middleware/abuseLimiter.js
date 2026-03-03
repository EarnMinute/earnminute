const rateLimit = require("express-rate-limit");

/* =====================================
   APPLICATION ABUSE LIMITER
===================================== */
const applicationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 30, // max 30 applications per hour per IP
  message: "Application limit exceeded. Try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  applicationLimiter,
};