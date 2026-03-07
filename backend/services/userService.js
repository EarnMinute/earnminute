const userRepository = require("../repositories/userRepository");
const ApiError = require("../utils/ApiError");

class UserService {

  async getUserById(userId) {

    const user = await userRepository.findById(userId);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    return user;
  }

  async getAllUsers() {
    return await userRepository.findAll();
  }

  async updateUserRole(userId, role) {

    const user = await userRepository.updateById(userId, { role });

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    return user;
  }

  async deleteUser(userId) {

    const user = await userRepository.deleteById(userId);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    return user;
  }

}

module.exports = new UserService();