const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      sellerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      name: String,
      image: String,
      color: String,
      price: Number,
      quantity: Number,
    },
  ],
  total: Number,
  deliveryFee: {
    type: Number,
    default: 0,
  },
  grandTotal: {
    type: Number,
    default: 0,
  },
  delivery: {
    firstName: String,
    lastName: String,
    address: String,
    email: String,
    phone: String,
    notes: String,
  },
  status: {
    type: String,
    default: "Pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  shippingStatus: {
    type: String,
    enum: ["Pending", "Processing", "Shipped", "In Transit", "Delivered"],
    default: "Pending",
  },
  paymentMethod: String, // 'cod', 'paypal', 'mastercard'
  paymentStatus: {
    type: String,
    default: "pending", // 'paid', 'failed'
  },
});

module.exports = mongoose.model("Order", orderSchema);
