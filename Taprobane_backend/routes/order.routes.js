const express = require("express");
const router = express.Router();
const {
  placeOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  updatePayment,
  getUserOrders,
  updateShippingStatus,
  getOrdersBySeller,
} = require("../controllers/order.controller");

// Routes
router.post("/", placeOrder);
router.get("/", getAllOrders);
router.get("/:id", getOrderById);
router.patch("/:id/status", updateOrderStatus);
router.put("/:id/payment", updatePayment);
router.put("/:id/shipping-status", updateShippingStatus);
router.get("/user/:userId", getUserOrders);
router.get("/seller/:sellerId", getOrdersBySeller);

module.exports = router;
