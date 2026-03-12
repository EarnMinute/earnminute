const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 60,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false,
    },

    role: {
      type: String,
      enum: ["freelancer", "employer", "admin"],
      required: true,
      index: true,
    },

    /* ===============================
       PROFILE FIELDS
    ================================ */

    bio: {
      type: String,
      maxlength: 1000,
      default: "",
    },

    skills: {
      type: [String],
      default: [],
    },

    company: {
      type: String,
      trim: true,
      maxlength: 120,
      default: "",
    },

    website: {
      type: String,
      trim: true,
      maxlength: 200,
      default: "",
    },

    loginAttempts: {
      type: Number,
      default: 0,
    },

    lockUntil: Date,

    rating: {
      total: { type: Number, default: 0 },
      count: { type: Number, default: 0 },
      average: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

/* ===============================
   INDEXES
================================ */
userSchema.index({ createdAt: -1 });

/* ===============================
   ACCOUNT LOCK LOGIC
================================ */
userSchema.virtual("isLocked").get(function () {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

/* ===============================
   PASSWORD HASHING
================================ */
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

/* ===============================
   PASSWORD MATCH
================================ */
userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);