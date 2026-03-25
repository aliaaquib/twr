const mongoose = require("mongoose");

const Post = require("../models/Post");
const createHttpError = require("../utils/httpError");

const createPost = async ({
  title,
  week,
  thisWeek,
  idea,
  signals,
  isFeatured = false,
  isSeeded = false,
}) => {
  const trimmedTitle = title?.trim();
  const trimmedWeek = week?.trim();
  const trimmedThisWeek = thisWeek?.trim();
  const trimmedIdea = idea?.trim();
  const normalizedSignals = Array.isArray(signals)
    ? signals.map((signal) => String(signal).trim()).filter(Boolean)
    : [];
  const featured = Boolean(isFeatured);
  const seeded = Boolean(isSeeded);

  if (!trimmedTitle || !trimmedWeek || !trimmedThisWeek || !trimmedIdea || normalizedSignals.length === 0) {
    throw createHttpError(
      400,
      "Title, week, thisWeek, idea, and at least one signal are required."
    );
  }

  const existingPost = await Post.findOne({ week: trimmedWeek }).lean();

  if (existingPost) {
    throw createHttpError(409, `A post for ${trimmedWeek} already exists.`);
  }

  try {
    if (featured) {
      await Post.updateMany({ isFeatured: true }, { $set: { isFeatured: false } });
    }

    return await Post.create({
      title: trimmedTitle,
      week: trimmedWeek,
      thisWeek: trimmedThisWeek,
      idea: trimmedIdea,
      signals: normalizedSignals,
      isFeatured: featured,
      isSeeded: seeded,
    });
  } catch (error) {
    if (error?.code === 11000) {
      throw createHttpError(409, `A post for ${trimmedWeek} already exists.`);
    }

    throw error;
  }
};

const getAllPosts = async () => {
  return Post.find({ isFeatured: false }).sort({ createdAt: -1 }).lean();
};

const getFeaturedPost = async () => {
  return Post.findOne({ isFeatured: true }).sort({ createdAt: -1 }).lean();
};

const getPostById = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw createHttpError(400, "Invalid post ID.");
  }

  const post = await Post.findById(id).lean();

  if (!post) {
    throw createHttpError(404, "Post not found.");
  }

  return post;
};

const getPostByWeek = async (week) => {
  return Post.findOne({ week }).lean();
};

const deletePostById = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw createHttpError(400, "Invalid post ID.");
  }

  const post = await Post.findById(id).lean();

  if (!post) {
    throw createHttpError(404, "Post not found.");
  }

  if (post.isSeeded) {
    throw createHttpError(403, "Seeded posts cannot be deleted");
  }

  await Post.findByIdAndDelete(id);

  return post;
};

module.exports = {
  createPost,
  deletePostById,
  getAllPosts,
  getFeaturedPost,
  getPostById,
  getPostByWeek,
};
