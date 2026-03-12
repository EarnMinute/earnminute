const userRepository = require("../repositories/userRepository");

/* ==================================
   GET FREELANCER PROFILE
================================== */
const getFreelancerProfile = async (userId) => {

  const freelancer = await userRepository.findById(userId);

  if (!freelancer || freelancer.role !== "freelancer") {
    throw new Error("Freelancer not found");
  }

  return {
    _id: freelancer._id,
    name: freelancer.name,
    rating: freelancer.rating,
    bio: freelancer.bio,
    skills: freelancer.skills,
    createdAt: freelancer.createdAt
  };
};

/* ==================================
   GET EMPLOYER PROFILE
================================== */
const getEmployerProfile = async (userId) => {

  const employer = await userRepository.findById(userId);

  if (!employer || employer.role !== "employer") {
    throw new Error("Employer not found");
  }

  return {
    _id: employer._id,
    name: employer.name,
    bio: employer.bio,
    company: employer.company,
    website: employer.website,
    createdAt: employer.createdAt
  };
};

/* ==================================
   UPDATE OWN PROFILE
================================== */
const updateProfile = async (userId, data) => {

  const user = await userRepository.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  /* ===============================
     ALLOWED FIELDS
  ================================ */

  if (data.name !== undefined) user.name = data.name;
  if (data.bio !== undefined) user.bio = data.bio;
  if (data.skills !== undefined) user.skills = data.skills;
  if (data.company !== undefined) user.company = data.company;
  if (data.website !== undefined) user.website = data.website;

  await userRepository.saveUser(user);

  return {
    _id: user._id,
    name: user.name,
    bio: user.bio,
    skills: user.skills,
    company: user.company,
    website: user.website
  };
};

module.exports = {
  getFreelancerProfile,
  getEmployerProfile,
  updateProfile
};