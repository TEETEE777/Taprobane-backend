const express = require("express");
const router = express.Router();
const {
  createBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
} = require("../controllers/blog.controller");
const {
  authenticate,
  authorizeRoles,
} = require("../middleware/authmiddleware");

// Public routes
router.get("/", getAllBlogs);
router.get("/:id", getBlogById);

// Admin only routes
router.post("/", authenticate, authorizeRoles("admin"), createBlog);
router.put("/:id", authenticate, authorizeRoles("admin"), updateBlog);
router.delete("/:id", authenticate, authorizeRoles("admin"), deleteBlog);

module.exports = router;
