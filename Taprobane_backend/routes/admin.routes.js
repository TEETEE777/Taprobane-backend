const express = require("express");
const router = express.Router();
const {
  getStats,
  getUsers,
  toggleUserStatus,
  getSellers,
  toggleSellerStatus,
  getSellerProducts,
} = require("../controllers/admin.controller");
const {
  authenticate,
  authorizeRoles,
} = require("../middleware/authmiddleware");
// Admin-only routes
router.get("/stats", authenticate, authorizeRoles("admin"), getStats);
router.get("/users", authenticate, authorizeRoles("admin"), getUsers);
router.put(
  "/users/:id/toggle",
  authenticate,
  authorizeRoles("admin"),
  toggleUserStatus
);
// Get all sellers
router.get("/sellers", authenticate, authorizeRoles("admin"), getSellers);

// Block/Unblock a seller
router.put(
  "/sellers/:id/toggle",
  authenticate,
  authorizeRoles("admin"),
  toggleSellerStatus
);

// Optional: Get all products by a seller
router.get(
  "/sellers/:id/products",
  authenticate,
  authorizeRoles("admin"),
  getSellerProducts
);

module.exports = router;
