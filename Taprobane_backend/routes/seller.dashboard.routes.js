const express = require("express");
const router = express.Router();
const sellerDashboardController = require("../controllers/seller.dashboard.controller");

// Seller summary (KPIs)
router.get("/summary/:sellerId", sellerDashboardController.getSellerSummary);

// Export CSV
router.get("/report/:sellerId", sellerDashboardController.exportSellerReport);
// seller.dashboard.routes.js
router.get(
  "/recent-orders/:sellerId",
  sellerDashboardController.getRecentOrders
);

module.exports = router;
