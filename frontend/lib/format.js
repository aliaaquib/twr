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
    return "bg-stone-100 text-stone-700 ring-1 ring-inset ring-stone-300 dark:bg-stone-800 dark:text-stone-300 dark:ring-stone-700";
  }

  if (normalized === "DRAMA") {
    return "bg-stone-100 text-stone-700 ring-1 ring-inset ring-stone-300 dark:bg-stone-800 dark:text-stone-300 dark:ring-stone-700";
  }

  if (normalized === "TOOL") {
    return "bg-stone-100 text-stone-700 ring-1 ring-inset ring-stone-300 dark:bg-stone-800 dark:text-stone-300 dark:ring-stone-700";
  }

  return "bg-stone-100 text-stone-700 ring-1 ring-inset ring-stone-300 dark:bg-stone-800 dark:text-stone-300 dark:ring-stone-700";
};
