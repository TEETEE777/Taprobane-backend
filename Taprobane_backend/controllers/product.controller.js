const Product = require("../models/product.model");
const mongoose = require("mongoose");

const getProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: "Invalid product ID" });
  }
};
function calculateEcoScores(materialType, packagingType, carbonSource) {
  const materialScores = {
    "organic cotton": 100,
    bamboo: 90,
    jute: 85,
    metal: 60,
    plastic: 20,
  };

  const packagingScores = {
    paper: 80,
    "recycled cardboard": 90,
    plastic: 30,
    "no packaging": 100,
  };

  const carbonScores = {
    local: 100,
    regional: 70,
    imported: 30,
  };

  const materialScore = materialScores[materialType.toLowerCase()] || 0;
  const packagingScore = packagingScores[packagingType.toLowerCase()] || 0;
  const carbonScore = carbonScores[carbonSource.toLowerCase()] || 0;

  const ecoScore = Math.round(
    materialScore * 0.4 + packagingScore * 0.3 + carbonScore * 0.3
  );

  return { materialScore, packagingScore, carbonScore, ecoScore };
}

const createProduct = async (req, res) => {
  try {
    const {
      name,
      price,
      description,
      stock,
      thumbnail,
      materialType,
      packagingType,
      carbonSource,
      category,
      sellerId,
    } = req.body;

    if (
      !name ||
      !price ||
      !description ||
      stock === undefined ||
      !materialType ||
      !packagingType ||
      !carbonSource ||
      !category ||
      !sellerId
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const { materialScore, packagingScore, carbonScore, ecoScore } =
      calculateEcoScores(materialType, packagingType, carbonSource);

    const product = await Product.create({
      name,
      price,
      description,
      stock,
      thumbnail,
      materialType,
      packagingType,
      carbonSource,
      category,
      sellerId,
      materialScore,
      packagingScore,
      carbonScore,
      ecoScore,
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    let updates = req.body;
    // If eco score fields are being updated, recalculate
    if (updates.materialType || updates.packagingType || updates.carbonSource) {
      const { materialScore, packagingScore, carbonScore, ecoScore } =
        calculateEcoScores(
          updates.materialType || "",
          updates.packagingType || "",
          updates.carbonSource || ""
        );
      updates = {
        ...updates,
        materialScore,
        packagingScore,
        carbonScore,
        ecoScore,
      };
    }

    const product = await Product.findByIdAndUpdate(id, updates, {
      new: true,
    });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const updatedProduct = await Product.findById(id);
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const getProductsBySeller = async (req, res) => {
  const { sellerId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(sellerId)) {
    return res.status(400).json({ message: "Invalid seller ID" });
  }

  try {
    const products = await Product.find({ sellerId }).sort({ createdAt: -1 });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsBySeller,
};
