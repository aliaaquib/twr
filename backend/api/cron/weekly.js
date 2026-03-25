const connectDatabase = require("../../utils/db");
const { seedInitialPosts } = require("../../services/seedService");
const { publishWeeklyArticleIfMissing } = require("../../services/autoWriterService");

let initialized = false;

const initialize = async () => {
  if (initialized) {
    return;
  }

  await connectDatabase();
  await seedInitialPosts();
  initialized = true;
};

module.exports = async (_req, res) => {
  try {
    await initialize();

    if (process.env.ENABLE_AUTO_WRITER !== "true") {
      return res.status(200).json({
        success: true,
        skipped: true,
        reason: "disabled",
      });
    }

    const result = await publishWeeklyArticleIfMissing();

    return res.status(200).json({
      success: true,
      created: result.created,
      reason: result.reason,
      week: result.post?.week || null,
    });
  } catch (error) {
    console.error("Vercel weekly cron failed:", error);
    return res.status(500).json({
      success: false,
      message: "Weekly cron failed.",
    });
  }
};
