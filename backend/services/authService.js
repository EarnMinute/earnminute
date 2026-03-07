const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userRepository = require("../repositories/userRepository");
const ApiError = require("../utils/ApiError");

class AuthService {

  async register(userData) {

    const existingUser = await userRepository.findByEmail(userData.email);

    if (existingUser) {
      throw new ApiError(400, "Email already registered");
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const user = await userRepository.createUser({
      ...userData,
      password: hashedPassword
    });

    return this.generateToken(user);

  }


  async login(email, password) {

    const user = await userRepository.findByEmailWithPassword(email);

    if (!user) {
      throw new ApiError(401, "Invalid credentials");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new ApiError(401, "Invalid credentials");
    }

    return this.generateToken(user);

  }


  generateToken(user) {

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return {
      user,
      token
    };

  }

}

module.exports = new AuthService();