const express = require("express");
const router = express.Router();
const {
  getStats,
  getUsers,
  toggleUserStatus,
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

module.exports = router;
