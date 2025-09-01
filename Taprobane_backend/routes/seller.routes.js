const express = require("express");
const router = express.Router();
const sellerController = require("../controllers/seller.controller");

// GET all sellers
router.get("/", sellerController.getSellers);

// Approve seller
router.put("/:id/approve", sellerController.approveSeller);

// Reject seller
router.put("/:id/reject", sellerController.rejectSeller);

// Block/Unblock seller
router.put("/:id/toggle", sellerController.toggleSellerStatus);

module.exports = router;
