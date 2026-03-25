const getMockHotItems = async () => {
  return [
    {
      title: "Open-source agent tooling is getting dramatically simpler",
      source: "GitHub",
      tag: "TOOL",
      url: "https://github.com/",
    },
    {
      title: "Teams are debating whether AI features are now table stakes",
      source: "X",
      tag: "DRAMA",
      url: "https://x.com/",
    },
    {
      title: "A new model benchmark is reshaping product roadmaps",
      source: "Reddit",
      tag: "BREAKTHROUGH",
      url: "https://www.reddit.com/",
    },
  ];
};

module.exports = {
  getMockHotItems,
};

