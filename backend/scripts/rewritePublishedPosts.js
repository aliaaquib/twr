require("dotenv").config();

const connectDatabase = require("../utils/db");
const Post = require("../models/Post");
const { rewritePostAsExplainer } = require("../services/aiService");

const run = async () => {
  await connectDatabase();

  const posts = await Post.find({}).sort({ createdAt: 1 });

  if (posts.length === 0) {
    console.log("No posts found. Nothing to rewrite.");
    return;
  }

  for (const post of posts) {
    console.log(`Rewriting: ${post.title}`);

    const rewritten = await rewritePostAsExplainer(post);

    if (!rewritten) {
      console.log(`Skipped: ${post.title}`);
      continue;
    }

    post.title = rewritten.title;
    post.week = rewritten.week;
    post.excerpt = rewritten.excerpt;
    post.thisWeek = rewritten.thisWeek;
    post.idea = rewritten.idea;
    post.content = rewritten.content;
    post.signals = rewritten.signals;

    await post.save();
    console.log(`Updated: ${post.title}`);
  }

  console.log("Finished rewriting published posts.");
};

run()
  .catch((error) => {
    console.error("Failed to rewrite published posts:", error);
    process.exit(1);
  })
  .finally(async () => {
    const mongoose = require("mongoose");
    await mongoose.connection.close();
  });
