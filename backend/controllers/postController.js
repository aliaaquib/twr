const {
  createPost,
  deletePostById,
  getAllPosts,
  getFeaturedPost,
  getPostById,
} = require("../services/postService");

const createManualPost = async (req, res, next) => {
  try {
    const post = await createPost(req.body || {});
    res.status(201).json(post);
  } catch (error) {
    next(error);
  }
};

const listPosts = async (_req, res, next) => {
  try {
    const posts = await getAllPosts();
    res.json(posts);
  } catch (error) {
    next(error);
  }
};

const readFeaturedPost = async (_req, res, next) => {
  try {
    const post = await getFeaturedPost();
    res.json(post || null);
  } catch (error) {
    next(error);
  }
};

const readPost = async (req, res, next) => {
  try {
    const post = await getPostById(req.params.id);
    res.json(post);
  } catch (error) {
    next(error);
  }
};

const deletePost = async (req, res, next) => {
  try {
    await deletePostById(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createManualPost,
  deletePost,
  listPosts,
  readFeaturedPost,
  readPost,
};
