require("dotenv").config();

const mongoose = require("mongoose");

const Post = require("../models/Post");
const connectDatabase = require("../utils/db");
const { generateExplainerForTopic } = require("../services/aiService");

const TIMELINE_WEEKS = [
  {
    week: "Week 1",
    topic: "How Recommendation Systems Work",
    createdAt: "2026-01-03T04:00:00.000Z",
    isFeatured: true,
  },
  {
    week: "Week 2",
    topic: "Why AI Interfaces Are Disappearing",
    createdAt: "2026-01-10T04:00:00.000Z",
  },
  {
    week: "Week 3",
    topic: "What AI Agents Actually Are",
    createdAt: "2026-01-17T04:00:00.000Z",
  },
  {
    week: "Week 4",
    topic: "Why Specialized AI Tools Are Winning",
    createdAt: "2026-01-24T04:00:00.000Z",
  },
  {
    week: "Week 5",
    topic: "How AI Is Becoming Infrastructure",
    createdAt: "2026-01-31T04:00:00.000Z",
  },
  {
    week: "Week 6",
    topic: "Why Working With AI Is Becoming a Core Skill",
    createdAt: "2026-02-07T04:00:00.000Z",
  },
  {
    week: "Week 7",
    topic: "How AI Search Is Changing",
    createdAt: "2026-02-14T04:00:00.000Z",
  },
  {
    week: "Week 8",
    topic: "How Fine-Tuning Actually Changes a Model",
    createdAt: "2026-02-21T04:00:00.000Z",
  },
  {
    week: "Week 9",
    topic: "How Vector Databases Work",
    createdAt: "2026-02-28T04:00:00.000Z",
  },
  {
    week: "Week 10",
    topic: "What RAG Actually Does",
    createdAt: "2026-03-07T04:00:00.000Z",
  },
  {
    week: "Week 11",
    topic: "How AI Memory Works",
    createdAt: "2026-03-14T04:00:00.000Z",
  },
  {
    week: "Week 12",
    topic: "Why AI Is Starting to Feel Invisible",
    createdAt: "2026-03-21T04:00:00.000Z",
  },
];

const legacyWeekAliases = {
  "Week 13, 2026": "Week 12",
};

const normalizeTimeline = async () => {
  for (const [legacyWeek, normalizedWeek] of Object.entries(legacyWeekAliases)) {
    const legacyPost = await Post.findOne({ week: legacyWeek });
    const targetPost = await Post.findOne({ week: normalizedWeek });

    if (!legacyPost || targetPost) {
      continue;
    }

    const targetWeek = TIMELINE_WEEKS.find((item) => item.week === normalizedWeek);

    legacyPost.week = normalizedWeek;
    legacyPost.isFeatured = false;
    legacyPost.isSeeded = true;
    await legacyPost.save();

    if (targetWeek) {
      await Post.collection.updateOne(
        { _id: legacyPost._id },
        {
          $set: {
            createdAt: new Date(targetWeek.createdAt),
            updatedAt: new Date(targetWeek.createdAt),
          },
        }
      );
    }

    console.log(`Renamed ${legacyWeek} to ${normalizedWeek}`);
  }

  for (const target of TIMELINE_WEEKS) {
    const existing = await Post.findOne({ week: target.week });

    if (existing) {
      const updates = {
        isFeatured: Boolean(target.isFeatured),
        isSeeded: true,
      };

      await Post.updateOne({ _id: existing._id }, { $set: updates });
      await Post.collection.updateOne(
        { _id: existing._id },
        {
          $set: {
            createdAt: new Date(target.createdAt),
            updatedAt: new Date(target.createdAt),
          },
        }
      );

      console.log(`Normalized ${target.week}: ${existing.title}`);
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

    const created = await Post.create({
      ...generated,
      isFeatured: Boolean(target.isFeatured),
      isSeeded: true,
      createdAt: new Date(target.createdAt),
      updatedAt: new Date(target.createdAt),
    });

    await Post.collection.updateOne(
      { _id: created._id },
      {
        $set: {
          createdAt: new Date(target.createdAt),
          updatedAt: new Date(target.createdAt),
        },
      }
    );

    console.log(`Inserted ${target.week}: ${generated.title}`);
  }

  const featuredWeek = TIMELINE_WEEKS.find((item) => item.isFeatured)?.week || "Week 1";

  await Post.updateMany(
    { week: { $ne: featuredWeek } },
    { $set: { isFeatured: false } }
  );

  await Post.updateOne({ week: featuredWeek }, { $set: { isFeatured: true } });
};

const run = async () => {
  await connectDatabase();
  await normalizeTimeline();
};

run()
  .catch((error) => {
    console.error("Failed to fill homepage timeline:", error);
    process.exit(1);
  })
  .finally(async () => {
    await mongoose.connection.close();
  });
