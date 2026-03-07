const User = require("../models/User");

class UserRepository {

  async createUser(userData) {
    return await User.create(userData);
  }

  async findByEmail(email) {
    return await User.findOne({ email });
  }

  async findByEmailWithPassword(email) {
  return await User.findOne({ email }).select("+password");
  }

  async findById(userId) {
    return await User.findById(userId);
  }

  async findAll(filter = {}) {
    return await User.find(filter);
  }

  async updateById(userId, updateData) {
    return await User.findByIdAndUpdate(userId, updateData, { new: true });
  }

  async deleteById(userId) {
    return await User.findByIdAndDelete(userId);
  }

}

module.exports = new UserRepository();