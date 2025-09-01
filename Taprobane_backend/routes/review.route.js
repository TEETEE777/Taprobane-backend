const express = require("express");
const router = express.Router();
const {
  addReview,
  getReviewsByProduct,
  getAllReviews,
} = require("../controllers/review.controller");

router.post("/", addReview);
router.get("/all", getAllReviews);
router.get("/:productId", getReviewsByProduct);

module.exports = router;
