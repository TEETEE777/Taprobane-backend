const User = require("../models/user.model");

// Get all sellers
exports.getSellers = async (req, res) => {
  try {
    const sellers = await User.find({ role: "seller" });
    res.json(sellers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Approve seller
exports.approveSeller = async (req, res) => {
  try {
    const { id } = req.params;
    const seller = await User.findByIdAndUpdate(
      id,
      { sellerStatus: "approved" },
      { new: true }
    );
    res.json({ message: "Seller approved", seller });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Reject seller
exports.rejectSeller = async (req, res) => {
  try {
    const { id } = req.params;
    const seller = await User.findByIdAndUpdate(
      id,
      { sellerStatus: "rejected" },
      { new: true }
    );
    res.json({ message: "Seller rejected", seller });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Block / Unblock seller
exports.toggleSellerStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const seller = await User.findById(id);

    if (!seller || seller.role !== "seller") {
      return res.status(404).json({ error: "Seller not found" });
    }

    seller.isActive = !seller.isActive;
    await seller.save();

    res.json({
      message: `Seller ${
        seller.isActive ? "unblocked" : "blocked"
      } successfully`,
      seller,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
