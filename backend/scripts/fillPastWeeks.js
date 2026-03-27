require("dotenv").config();

const mongoose = require("mongoose");

const Post = require("../models/Post");
const connectDatabase = require("../utils/db");
const { generateExplainerForTopic } = require("../services/aiService");

const TARGET_WEEKS = [
  {
    week: "Week 1",
    topic: "How Recommendation Systems Work",
    createdAt: "2026-01-03T04:00:00.000Z",
  },
  {
    week: "Week 2",
    topic: "What AI Agents Actually Are",
    createdAt: "2026-01-10T04:00:00.000Z",
  },
  {
    week: "Week 3",
    topic: "How LLMs Actually Work",
    createdAt: "2026-01-17T04:00:00.000Z",
  },
  {
    week: "Week 4",
    topic: "What Fine-Tuning Really Changes",
    createdAt: "2026-01-24T04:00:00.000Z",
  },
  {
    week: "Week 5",
    topic: "How Vector Databases Work",
    createdAt: "2026-01-31T04:00:00.000Z",
  },
  {
    week: "Week 6",
    topic: "What RAG Actually Does",
    createdAt: "2026-02-07T04:00:00.000Z",
  },
  {
    week: "Week 7",
    topic: "How AI Search Is Changing",
    createdAt: "2026-02-14T04:00:00.000Z",
  },
];

const run = async () => {
  await connectDatabase();

  for (const target of TARGET_WEEKS) {
    const existing = await Post.findOne({ week: target.week }).lean();

    if (existing) {
      console.log(`Skipping ${target.week}; already exists as "${existing.title}"`);
      continue;
    }

    console.log(`Generating ${target.week}: ${target.topic}`);

    const generated = await generateExplainerForTopic({
      week: target.week,
      topic: target.topic,
    });

    if (!generated) {
      console.log(`Skipped ${target.week}; generation failed.`);
      continue;
    }

    await Post.create({
      ...generated,
      isFeatured: false,
      isSeeded: true,
      createdAt: new Date(target.createdAt),
      updatedAt: new Date(target.createdAt),
    });

    console.log(`Inserted ${target.week}: ${generated.title}`);
  }
};

run()
  .catch((error) => {
    console.error("Failed to fill past weeks:", error);
    process.exit(1);
  })
  .finally(async () => {
    await mongoose.connection.close();
  });
