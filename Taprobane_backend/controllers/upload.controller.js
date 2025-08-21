const path = require("path");
const multer = require("multer");

// Configure where to store uploaded images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // You must create the uploads folder manually
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueName + ext); // Example: 1698909893.jpg
  },
});

const upload = multer({ storage });

// Middleware to handle single file upload with key 'image'
const uploadSingle = upload.single("image");

const uploadImage = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const imageUrl = `/uploads/${req.file.filename}`;
  res.status(201).json({ imageUrl });
};

module.exports = { uploadSingle, uploadImage };
