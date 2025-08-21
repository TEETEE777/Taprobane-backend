const User = require("../models/user.model");
const Product = require("../models/product.model");
const Order = require("../models/order.model");

// Get dashboard stats
exports.getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalSellers = await User.countDocuments({ role: "seller" });
    const totalBuyers = await User.countDocuments({ role: "buyer" });
    const totalAdmins = await User.countDocuments({ role: "admin" });
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();

    res.json({
      totalUsers,
      totalSellers,
      totalBuyers,
      totalAdmins,
      totalProducts,
      totalOrders,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch stats" });
  }
};

// Get all users (for management)
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

// Block/Unblock a user
exports.toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) return res.status(404).json({ error: "User not found" });

    user.isActive = !user.isActive;
    await user.save();

    res.json({
      message: `User ${user.isActive ? "unblocked" : "blocked"}`,
      user,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to update user status" });
  }
};
