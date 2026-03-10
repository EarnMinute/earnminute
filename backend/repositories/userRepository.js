const User = require("../models/User");

/* ===============================
   FIND USER BY EMAIL
================================ */
const findByEmail = async (email) => {
  return User.findOne({ email }).select("+password");
};

/* ===============================
   FIND USER BY ID
================================ */
const findById = async (id) => {
  return User.findById(id);
};

/* ===============================
   CREATE USER
================================ */
const createUser = async (data) => {
  return User.create(data);
};

/* ===============================
   SAVE USER
================================ */
const saveUser = async (user) => {
  return user.save();
};

module.exports = {
  findByEmail,
  findById,
  createUser,
  saveUser
};