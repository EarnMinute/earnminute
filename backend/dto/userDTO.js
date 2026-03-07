class UserDTO {

  static sanitize(user) {

    return {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      rating: user.rating,
      createdAt: user.createdAt
    };

  }

}

module.exports = UserDTO;