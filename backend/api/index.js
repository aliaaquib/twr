const { app } = require("../app");
const connectDatabase = require("../utils/db");
const { seedInitialPosts } = require("../services/seedService");

let initialized = false;

const initialize = async () => {
  if (initialized) {
    return;
  }

  await connectDatabase();
  await seedInitialPosts();
  initialized = true;
};

module.exports = async (req, res) => {
  try {
    await initialize();
    return app(req, res);
  } catch (error) {
    console.error("Backend API initialization failed:", error);
    return res.status(500).json({
      message: "Backend failed to initialize.",
    });
  }
};
