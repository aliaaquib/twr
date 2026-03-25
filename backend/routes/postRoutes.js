const express = require("express");

const { loginAdmin } = require("../controllers/adminController");
const { createManualHotItem, listHotItems } = require("../controllers/hotController");
const {
  createManualPost,
  deletePost,
  listPosts,
  readFeaturedPost,
  readPost,
} = require("../controllers/postController");
const { requireAdmin } = require("../middleware/adminAuth");

const router = express.Router();

router.post("/admin/login", loginAdmin);
router.post("/posts", requireAdmin, createManualPost);
router.get("/posts/featured", readFeaturedPost);
router.get("/posts", listPosts);
router.get("/posts/:id", readPost);
router.delete("/posts/:id", requireAdmin, deletePost);
router.get("/hot", listHotItems);
router.post("/hot", requireAdmin, createManualHotItem);

module.exports = router;
