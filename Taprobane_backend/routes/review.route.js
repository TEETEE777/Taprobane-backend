const express = require("express");
const router = express.Router();
const {
  addReview,
  getReviewsByProduct,
} = require("../controllers/review.controller");

router.post("/", addReview);
router.get("/:productId", getReviewsByProduct);

module.exports = router;
