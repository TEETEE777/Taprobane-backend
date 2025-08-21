const Order = require("../models/order.model");
const Product = require("../models/product.model");
const mongoose = require("mongoose");
// Place a new order
exports.placeOrder = async (req, res) => {
  const { items, delivery, total, deliveryFee, userId } = req.body;
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ error: "Invalid userId" });
  }

  try {
    // Map items to include sellerId from product
    const itemsWithSeller = await Promise.all(
      items.map(async (item) => {
        const product = await Product.findById(item.productId);
        if (!product) {
          throw new Error(`Product not found: ${item.productId}`);
        }
        return {
          ...item,
          sellerId: product.sellerId, // ✅ attach sellerId
        };
      })
    );

    const newOrder = new Order({
      userId,
      items: itemsWithSeller,
      delivery,
      total,
      deliveryFee,
      grandTotal: total + deliveryFee,
      paymentMethod: "not-selected",
      paymentStatus: "pending",
      shippingStatus: "Pending",
    });

    const saved = await newOrder.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to place order" });
  }
};

// Get all orders
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch orders" });
  }
};

// Get single order by ID
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch order" });
  }
};

// Update order status
exports.updateOrderStatus = async (req, res) => {
  try {
    const updated = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to update status" });
  }
};

exports.getUserOrders = async (req, res) => {
  const { userId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ error: "Invalid userId" });
  }
  try {
    const orders = await Order.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching user orders:", error.message);
    res.status(500).json({ error: "Failed to fetch user orders" });
  }
};

exports.updatePayment = async (req, res) => {
  try {
    const { paymentMethod, paymentStatus } = req.body;
    const updated = await Order.findByIdAndUpdate(
      req.params.id,
      { paymentMethod, paymentStatus },
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ error: "Order not found" });
    }
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to update payment" });
  }
};

exports.updateShippingStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { shippingStatus: status },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ error: "Order not found" });
    }

    res
      .status(200)
      .json({ message: "Shipping status updated", order: updatedOrder });
  } catch (error) {
    res.status(500).json({ error: "Failed to update shipping status" });
  }
};

exports.getOrdersBySeller = async (req, res) => {
  const { sellerId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(sellerId)) {
    return res.status(400).json({ error: "Invalid sellerId" });
  }

  try {
    const sellerObjectId = new mongoose.Types.ObjectId(sellerId);

    const orders = await Order.find({ "items.sellerId": sellerObjectId }).sort({
      createdAt: -1,
    });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch seller orders" });
  }
};
