const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("./models/User");
const Task = require("./models/Task");

dotenv.config();
mongoose.connect(process.env.MONGO_URI);

const titles = [
  "Data Entry Work",
  "Excel Spreadsheet Cleanup",
  "Website Bug Fix",
  "React Frontend Improvements",
  "WordPress Setup",
  "SEO Blog Writing",
  "Logo Design",
  "Social Media Poster Design",
  "Video Editing for Reels",
  "Product Description Writing",
  "Market Research Task",
  "Email List Collection",
  "Landing Page Design",
  "Tailwind CSS Fixes",
  "E-commerce Product Upload",
  "YouTube Thumbnail Design",
  "Android App UI Design",
  "Figma UI Prototype",
  "Content Writing",
  "Basic Graphic Design"
];

const skillsPool = [
  "Excel",
  "React",
  "Node.js",
  "Tailwind",
  "WordPress",
  "SEO",
  "Canva",
  "Photoshop",
  "Video Editing",
  "Research",
  "Data Entry",
  "Figma",
  "UI/UX",
  "JavaScript"
];

const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

const getRandomSkills = () => {
  const shuffled = skillsPool.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 2);
};

const seedData = async () => {
  try {
    console.log("Seeding started...");

    await Task.deleteMany();

    // Create seed employer if not exists
    let employer = await User.findOne({ whatsapp: "01700000000" });

    if (!employer) {
      employer = await User.create({
        name: "Seed Employer",
        whatsapp: "01700000000",
        password: "123456",
        role: "employer",
      });
    }

    const tasks = [];

    for (let i = 0; i < 60; i++) {
      tasks.push({
        title: `${getRandom(titles)} #${i + 1}`,
        description:
          "This is a realistic freelance task generated for testing the platform. Must deliver quality work within deadline.",
        budgetAmount: Math.floor(Math.random() * 5000) + 500,
        budgetType: "fixed" ,
        skills: getRandomSkills(),
        employer: employer._id,
        status: "open",
        applicationsCount: 0,
      });
    }

    await Task.insertMany(tasks);

    console.log("60 tasks seeded successfully ✅");
    process.exit();
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
};

seedData();