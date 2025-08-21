const Blog = require("../models/blog.model");
const mongoose = require("mongoose");

// Create a blog post (Admin only)
exports.createBlog = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const { title, excerpt, content, imageUrl, category, tags } = req.body;

    if (!title || !content) {
      return res
        .status(400)
        .json({ message: "Title and content are required" });
    }

    const blog = new Blog({
      title,
      excerpt, // Will auto-generate if missing (model hook)
      content,
      imageUrl, // Will set default if missing
      category: category || "General",
      tags: tags || [],
      authorId: req.user.id,
    });

    const savedBlog = await blog.save();
    res.status(201).json(savedBlog);
  } catch (error) {
    console.error("Error creating blog:", error.message);
    res.status(500).json({ message: "Failed to create blog post" });
  }
};

// Get all blog posts
exports.getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find()
      .populate("authorId", "name email")
      .sort({ createdAt: -1 });
    res.status(200).json(blogs);
  } catch (error) {
    console.error("Error fetching blogs:", error.message);
    res.status(500).json({ message: "Failed to fetch blogs" });
  }
};

// Get single blog post
exports.getBlogById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid blog ID" });
    }

    const blog = await Blog.findById(req.params.id).populate(
      "authorId",
      "name email"
    );
    if (!blog) {
      return res.status(404).json({ message: "Blog post not found" });
    }
    res.status(200).json(blog);
  } catch (error) {
    console.error("Error fetching blog:", error.message);
    res.status(500).json({ message: "Failed to fetch blog post" });
  }
};

// Update blog post (Admin only)
exports.updateBlog = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid blog ID" });
    }

    const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!updatedBlog) {
      return res.status(404).json({ message: "Blog post not found" });
    }

    res.status(200).json(updatedBlog);
  } catch (error) {
    console.error("Error updating blog:", error.message);
    res.status(500).json({ message: "Failed to update blog post" });
  }
};

// Delete blog post (Admin only)
exports.deleteBlog = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid blog ID" });
    }

    const deletedBlog = await Blog.findByIdAndDelete(req.params.id);
    if (!deletedBlog) {
      return res.status(404).json({ message: "Blog post not found" });
    }

    res.status(200).json({ message: "Blog post deleted successfully" });
  } catch (error) {
    console.error("Error deleting blog:", error.message);
    res.status(500).json({ message: "Failed to delete blog post" });
  }
};
