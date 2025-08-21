const express = require("express");
const router = express.Router();
const contactController = require("../controllers/contact.controller");

// POST: send message
router.post("/", contactController.sendMessage);

// GET: get all messages (optional - admin)
router.get("/", contactController.getMessages);

module.exports = router;
