export const formatDate = (value) =>
  new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));

export const getPreview = (content, length = 180) => {
  const plainText = content.replace(/\n+/g, " ").trim();

  if (plainText.length <= length) {
    return plainText;
  }

  return `${plainText.slice(0, length).trim()}...`;
};

export const getReadingTime = (post) => {
  const text = [
    post?.title || "",
    post?.thisWeek || "",
    post?.idea || "",
    ...(Array.isArray(post?.signals) ? post.signals : []),
  ]
    .join(" ")
    .trim();

  const wordCount = text ? text.split(/\s+/).filter(Boolean).length : 0;
  const minutes = Math.max(1, Math.ceil(wordCount / 180));

  return `${minutes} min read`;
};

export const getTagClasses = (tag) => {
  const normalized = String(tag || "").toUpperCase();

  if (normalized === "BREAKTHROUGH") {
    return "bg-emerald-500/16 text-emerald-300 ring-1 ring-inset ring-emerald-400/20";
  }

  if (normalized === "DRAMA") {
    return "bg-orange-500/16 text-orange-200 ring-1 ring-inset ring-orange-300/20";
  }

  if (normalized === "TOOL") {
    return "bg-sky-500/16 text-sky-200 ring-1 ring-inset ring-sky-300/20";
  }

  return "bg-white/10 text-white/70 ring-1 ring-inset ring-white/10";
};
