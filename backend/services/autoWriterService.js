const cron = require("node-cron");

const { createPost, getPostByWeek } = require("./postService");
const { generateWeeklyEditorial } = require("./aiService");
const { formatEditorialWeek } = require("../utils/week");

const WEEKLY_CRON_EXPRESSION = "42 23 * * 3";

const publishWeeklyArticleIfMissing = async (date = new Date()) => {
  const week = formatEditorialWeek(date);
  const existingPost = await getPostByWeek(week);

  if (existingPost) {
    return {
      created: false,
      reason: "exists",
      post: existingPost,
    };
  }

  let generatedPost;

  try {
    generatedPost = await generateWeeklyEditorial(date);
  } catch (error) {
    console.log("AI skipped:", error.message);
    return {
      created: false,
      reason: "ai_skipped",
      post: null,
    };
  }

  if (!generatedPost) {
    return {
      created: false,
      reason: "ai_skipped",
      post: null,
    };
  }

  const createdPost = await createPost({
    ...generatedPost,
    isFeatured: false,
    isSeeded: false,
  });

  return {
    created: true,
    reason: "published",
    post: createdPost,
  };
};

const startWeeklyAutoWriter = () => {
  cron.schedule(
    WEEKLY_CRON_EXPRESSION,
    async () => {
      try {
        const result = await publishWeeklyArticleIfMissing();

        if (result.created) {
          console.log(`Auto-writer published ${result.post.week}`);
        } else if (result.reason === "ai_skipped") {
          console.log("Auto-writer skipped publishing because the AI provider returned no article.");
        } else {
          console.log(`Auto-writer skipped ${result.post.week} because it already exists.`);
        }
      } catch (error) {
        console.error("Auto-writer failed:", error);
      }
    },
    {
      timezone: process.env.CRON_TIMEZONE || "UTC",
    }
  );

  console.log(
    `Weekly auto-writer scheduled for "${WEEKLY_CRON_EXPRESSION}" in ${process.env.CRON_TIMEZONE || "UTC"}`
  );
};

const runStartupAutoWriterCheck = async () => {
  const result = await publishWeeklyArticleIfMissing();

  if (result.created) {
    console.log(`Startup auto-writer published ${result.post.week}`);
  } else if (result.reason === "ai_skipped") {
    console.log("Startup auto-writer skipped because the AI provider returned no article.");
  } else {
    console.log(`Startup auto-writer found existing post for ${result.post.week}`);
  }
};

module.exports = {
  runStartupAutoWriterCheck,
  startWeeklyAutoWriter,
};
