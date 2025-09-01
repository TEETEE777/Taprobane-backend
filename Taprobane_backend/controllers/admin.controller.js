const User = require("../models/user.model");
const Product = require("../models/product.model");
const Order = require("../models/order.model");
const mongoose = require("mongoose");

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
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }
    const user = await User.findById(req.params.id);

    if (!user) return res.status(404).json({ error: "User not found" });

    user.isActive = !user.isActive;
    await user.save({ validateBeforeSave: false });

    res.json({
      message: `User ${user.isActive ? "unblocked" : "blocked"}`,
      user,
    });
  } catch (err) {
    console.error("Toggle user error:", err);
    res.status(500).json({ error: "Failed to update user status" });
  }
};

// Get all sellers
exports.getSellers = async (req, res) => {
  try {
    const sellers = await User.find({ role: "seller" }).sort({ createdAt: -1 });
    res.json(sellers);
  } catch (err) {
    console.error("Get sellers error:", err);
    res.status(500).json({ error: "Failed to fetch sellers" });
  }
};

// Block/Unblock seller
exports.toggleSellerStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const seller = await User.findOne({ _id: id, role: "seller" });

    if (!seller) return res.status(404).json({ error: "Seller not found" });

    seller.isActive = !seller.isActive;
    await seller.save({ validateBeforeSave: false });

    res.json({
      message: `Seller ${seller.isActive ? "unblocked" : "blocked"}`,
      seller,
    });
  } catch (err) {
    console.error("Toggle seller error:", err);
    res.status(500).json({ error: "Failed to update seller status" });
  }
};

// Get all products by a seller
exports.getSellerProducts = async (req, res) => {
  try {
    const { id } = req.params;
    const products = await Product.find({ seller: id }).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    console.error("Get seller products error:", err);
    res.status(500).json({ error: "Failed to fetch seller products" });
  }
};
