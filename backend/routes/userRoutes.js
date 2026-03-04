const express = require("express");
const router = express.Router();
const { getFreelancerProfile } = require("../controllers/userController");

router.get("/freelancer/:id", getFreelancerProfile);

module.exports = router;