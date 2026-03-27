require("dotenv").config();

const mongoose = require("mongoose");

const Post = require("../models/Post");

const updates = {
  "Week 1": "2026-01-03T04:00:00.000Z",
  "Week 2": "2026-01-10T04:00:00.000Z",
  "Week 3": "2026-01-17T04:00:00.000Z",
  "Week 4": "2026-01-24T04:00:00.000Z",
  "Week 5": "2026-01-31T04:00:00.000Z",
  "Week 6": "2026-02-07T04:00:00.000Z",
};

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 10000,
  });

  for (const [week, isoDate] of Object.entries(updates)) {
    const date = new Date(isoDate);
    const result = await Post.collection.updateOne(
      { week },
      {
        $set: {
          createdAt: date,
          updatedAt: date,
        },
      }
    );

    console.log(`${week}: matched=${result.matchedCount} modified=${result.modifiedCount} date=${isoDate}`);
  }

  const posts = await Post.find(
    { week: { $in: Object.keys(updates) } },
    "title week createdAt"
  )
    .sort({ createdAt: 1 })
    .lean();

  console.log(JSON.stringify(posts, null, 2));
};

run()
  .catch((error) => {
    console.error("Failed to normalize dates:", error);
    process.exit(1);
  })
  .finally(async () => {
    await mongoose.connection.close();
  });
