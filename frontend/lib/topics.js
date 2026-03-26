const TOPIC_RULES = [
  {
    label: "AI Interfaces",
    matchers: ["interface", "interfaces", "ux", "workflow", "invisible"],
  },
  {
    label: "AI Agents",
    matchers: ["agent", "agents", "agentic", "autonomous"],
  },
  {
    label: "AI Products",
    matchers: ["product", "products", "tool", "tools", "startup", "startups"],
  },
  {
    label: "AI Infrastructure",
    matchers: ["infrastructure", "system", "systems", "stack", "api", "native"],
  },
  {
    label: "AI Work",
    matchers: ["work", "skill", "skills", "team", "teammate", "job", "roles"],
  },
];

export const getTopicForPost = (post) => {
  const text = [post?.title, post?.thisWeek, post?.idea, ...(post?.signals || [])]
    .join(" ")
    .toLowerCase();

  const matchedRule = TOPIC_RULES.find((rule) =>
    rule.matchers.some((matcher) => text.includes(matcher))
  );

  return matchedRule?.label || "AI Trends";
};

export const groupPostsByTopic = (posts) => {
  const groups = posts.reduce((accumulator, post) => {
    const topic = getTopicForPost(post);

    if (!accumulator[topic]) {
      accumulator[topic] = [];
    }

    accumulator[topic].push(post);
    return accumulator;
  }, {});

  return Object.entries(groups)
    .map(([topic, topicPosts]) => ({
      topic,
      posts: topicPosts,
    }))
    .sort((left, right) => right.posts.length - left.posts.length || left.topic.localeCompare(right.topic));
};
