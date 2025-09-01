const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsBySeller,
} = require("../controllers/product.controller");

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // save files in /uploads folder
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}${ext}`);
  },
});
const upload = multer({ storage });

// Routes
router.get("/", getProducts);
router.get("/:id", getProduct);
router.post("/", createProduct);
router.put("/:id", upload.single("thumbnail"), updateProduct); // <-- handle file
router.delete("/:id", deleteProduct);
router.get("/seller/:sellerId", getProductsBySeller);

module.exports = router;
