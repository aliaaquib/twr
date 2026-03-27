export const dedupePosts = (posts) => {
  const seen = new Set();

  return posts.filter((post) => {
    if (!post?._id || seen.has(post._id)) {
      return false;
    }

    seen.add(post._id);
    return true;
  });
};
