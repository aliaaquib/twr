const Post = require("../models/Post");

const INITIAL_POSTS = [
  {
    title: "The Shift from AI Tools to AI Systems",
    week: "Week 1",
    thisWeek:
      "AI is no longer just tools — it's becoming systems that operate across workflows.",
    idea:
      "The biggest shift isn't intelligence, it's integration.",
    signals: [
      "Rise of multi-agent systems",
      "AI embedded into workflows",
      "Less prompting, more automation",
    ],
    isFeatured: true,
    isSeeded: true,
  },
  {
    title: "Why AI Interfaces Are Disappearing",
    week: "Week 2",
    thisWeek:
      "AI is moving from visible tools into invisible layers inside products.",
    idea:
      "The best AI feels like it isn't there.",
    signals: [
      "AI inside existing tools",
      "Less standalone apps",
      "More automation layers",
    ],
    isFeatured: false,
    isSeeded: true,
  },
  {
    title: "The Rise of AI Agents in Daily Work",
    week: "Week 3",
    thisWeek:
      "AI agents are starting to complete tasks independently.",
    idea: "Execution is replacing assistance.",
    signals: [
      "Task automation increasing",
      "Less human input needed",
      "Agents handling workflows",
    ],
    isFeatured: false,
    isSeeded: true,
  },
  {
    title: "Small AI Tools Are Winning",
    week: "Week 4",
    thisWeek:
      "Focused AI tools are outperforming large platforms.",
    idea: "Depth beats breadth.",
    signals: [
      "Niche AI startups growing",
      "Simpler UX winning",
      "Faster adoption cycles",
    ],
    isFeatured: false,
    isSeeded: true,
  },
  {
    title: "AI Is Becoming Infrastructure",
    week: "Week 5",
    thisWeek:
      "AI is becoming a default layer in software stacks.",
    idea: "Soon, every product will be AI-native.",
    signals: [
      "AI APIs everywhere",
      "Backend automation rising",
      "Invisible intelligence layer",
    ],
    isFeatured: false,
    isSeeded: true,
  },
  {
    title: "The New Skill: Working With AI",
    week: "Week 6",
    thisWeek:
      "Knowing how to work with AI is becoming a core skill.",
    idea: "Prompting is temporary, thinking is permanent.",
    signals: [
      "AI literacy increasing",
      "Shift in job roles",
      "Human + AI collaboration",
    ],
    isFeatured: false,
    isSeeded: true,
  },
];

const seedInitialPosts = async () => {
  const count = await Post.countDocuments();

  if (count > 0) {
    console.log("Posts already exist, skipping seed.");
    return;
  }

  console.log("Seeding initial content...");
  await Post.insertMany(INITIAL_POSTS);
  console.log("Seeded featured + 5 weekly articles.");
};

module.exports = {
  seedInitialPosts,
};
