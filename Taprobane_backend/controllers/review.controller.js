const Review = require("../models/review.model");

// Add a new review
exports.addReview = async (req, res) => {
  try {
    const { productId, userId, userEmail, rating, comment } = req.body;

    // Prevent duplicate reviews
    const existing = await Review.findOne({ productId, userId });
    if (existing) {
      return res
        .status(400)
        .json({ message: "You have already reviewed this product" });
    }

    const review = await Review.create({
      productId,
      userId,
      userEmail,
      rating,
      comment,
    });
    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ error: "Failed to add review" });
  }
};

// Get reviews for a product
exports.getReviewsByProduct = async (req, res) => {
  try {
    const productId = req.params.productId;
    const reviews = await Review.find({ productId }).sort({ createdAt: -1 });
    res.status(200).json(reviews);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
};
