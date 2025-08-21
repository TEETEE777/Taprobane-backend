const express = require("express");
const router = express.Router();
const {
  uploadSingle,
  uploadImage,
} = require("../controllers/upload.controller");

router.post("/", uploadSingle, uploadImage);

module.exports = router;
