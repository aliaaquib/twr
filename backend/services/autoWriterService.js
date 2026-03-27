const cron = require("node-cron");

const Post = require("../models/Post");
const { createPost, getPostByWeek } = require("./postService");
const { generateWeeklyEditorial } = require("./aiService");
const { formatEditorialWeek } = require("../utils/week");

const WEEKLY_CRON_EXPRESSION = "0 10 * * 6";
const DAILY_FEATURED_CRON_EXPRESSION = "5 0 * * *";
const WEEKLY_LOCAL_DAY = 6;
const WEEKLY_LOCAL_HOUR = 10;
const WEEKLY_LOCAL_MINUTE = 0;

const getTimezoneDateParts = (date = new Date(), timezone = process.env.CRON_TIMEZONE || "UTC") => {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  const parts = formatter.formatToParts(date);
  const year = Number(parts.find((part) => part.type === "year")?.value);
  const month = Number(parts.find((part) => part.type === "month")?.value);
  const day = Number(parts.find((part) => part.type === "day")?.value);

  return { year, month, day };
};

const getTimezoneClockParts = (date = new Date(), timezone = process.env.CRON_TIMEZONE || "UTC") => {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const weekdayToIndex = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
  };
  const parts = formatter.formatToParts(date);

  return {
    weekday: weekdayToIndex[parts.find((part) => part.type === "weekday")?.value] ?? 0,
    hour: Number(parts.find((part) => part.type === "hour")?.value),
    minute: Number(parts.find((part) => part.type === "minute")?.value),
  };
};

const getDailyFeaturedIndex = (date = new Date()) => {
  const { year, month, day } = getTimezoneDateParts(date);
  return Math.floor(Date.UTC(year, month - 1, day) / 86400000);
};

const rotateFeaturedArticleForDay = async (date = new Date()) => {
  const posts = await Post.find({}).sort({ createdAt: -1, _id: -1 });

  if (posts.length === 0) {
    return {
      changed: false,
      reason: "no_posts",
      post: null,
    };
  }

  const dailyIndex = getDailyFeaturedIndex(date) % posts.length;
  const targetPost = posts[dailyIndex];
  const currentFeatured = posts.find((post) => post.isFeatured) || null;

  if (currentFeatured && String(currentFeatured._id) === String(targetPost._id)) {
    return {
      changed: false,
      reason: "already_set",
      post: targetPost.toObject(),
    };
  }

  await Post.updateMany({ isFeatured: true }, { $set: { isFeatured: false } });
  await Post.updateOne({ _id: targetPost._id }, { $set: { isFeatured: true } });

  return {
    changed: true,
    reason: "rotated",
    post: targetPost.toObject(),
  };
};

const shouldRunStartupAutoWriter = (date = new Date()) => {
  const current = getTimezoneClockParts(date);

  if (current.weekday !== WEEKLY_LOCAL_DAY) {
    return false;
  }

  if (current.hour > WEEKLY_LOCAL_HOUR) {
    return true;
  }

  return current.hour === WEEKLY_LOCAL_HOUR && current.minute >= WEEKLY_LOCAL_MINUTE;
};

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

const startDailyFeaturedRotation = () => {
  cron.schedule(
    DAILY_FEATURED_CRON_EXPRESSION,
    async () => {
      try {
        const result = await rotateFeaturedArticleForDay();

        if (result.changed) {
          console.log(`Clario rotated featured article to "${result.post.title}"`);
        } else if (result.reason === "already_set") {
          console.log(`Clario kept featured article as "${result.post.title}"`);
        } else {
          console.log("Clario skipped featured rotation because there are no posts yet.");
        }
      } catch (error) {
        console.error("Featured rotation failed:", error);
      }
    },
    {
      timezone: process.env.CRON_TIMEZONE || "UTC",
    }
  );

  console.log(
    `Daily featured rotation scheduled for "${DAILY_FEATURED_CRON_EXPRESSION}" in ${process.env.CRON_TIMEZONE || "UTC"}`
  );
};

const startWeeklyAutoWriter = () => {
  cron.schedule(
    WEEKLY_CRON_EXPRESSION,
    async () => {
      try {
        const result = await publishWeeklyArticleIfMissing();

        if (result.created) {
          console.log(`Auto-writer published ${result.post.week}`);
          const featuredResult = await rotateFeaturedArticleForDay();

          if (featuredResult.changed) {
            console.log(`Clario set featured article to "${featuredResult.post.title}"`);
          }
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

const runStartupFeaturedRotationCheck = async () => {
  const featuredResult = await rotateFeaturedArticleForDay();

  if (featuredResult.changed) {
    console.log(`Startup featured article set to "${featuredResult.post.title}"`);
  } else if (featuredResult.reason === "already_set") {
    console.log(`Startup featured article already set to "${featuredResult.post.title}"`);
  } else {
    console.log("Startup featured rotation skipped because there are no posts yet.");
  }
};

const runStartupAutoWriterCheck = async () => {
  if (!shouldRunStartupAutoWriter()) {
    console.log("Startup auto-writer skipped because the scheduled Saturday publish time has not arrived yet.");
    return;
  }

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
  publishWeeklyArticleIfMissing,
  rotateFeaturedArticleForDay,
  runStartupFeaturedRotationCheck,
  runStartupAutoWriterCheck,
  shouldRunStartupAutoWriter,
  startDailyFeaturedRotation,
  startWeeklyAutoWriter,
};
