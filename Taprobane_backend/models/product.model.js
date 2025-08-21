const mongoose = require("mongoose");
const ProductSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
    },
    price: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    thumbnail: {
      type: String,
      required: false,
    },
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // Eco-score inputs
    materialType: { type: String, required: true },
    packagingType: { type: String, required: true },
    carbonSource: { type: String, required: true },

    // Calculated fields
    materialScore: { type: Number },
    packagingScore: { type: Number },
    carbonScore: { type: Number },
    ecoScore: { type: Number },
    stock: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", ProductSchema);

module.exports = Product;
