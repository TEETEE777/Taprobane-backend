const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    excerpt: { type: String }, // Optional preview
    content: { type: String, required: true },
    imageUrl: {
      type: String,
      default: "https://via.placeholder.com/800x400?text=Taprobane+Blog",
    },
    category: { type: String, default: "General" },
    tags: [{ type: String }],

    // Reference to User model (admin or seller)
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    // Optional fallback for author name if not using a user reference
    author: { type: String, default: "Taprobane" },
  },
  { timestamps: true }
);

// Auto-generate excerpt if not provided
blogSchema.pre("save", function (next) {
  if (!this.excerpt && this.content) {
    this.excerpt = this.content.substring(0, 150) + "...";
  }
  next();
});

module.exports = mongoose.model("Blog", blogSchema);
