const express = require("express");
const {
  registerUser,
  loginUser,
  currentUser,
  resetPassword,
  getSellerStatus,
} = require("../controllers/user.controller");
const { authenticate } = require("../middleware/authmiddleware");
const verifyRecaptcha = require("../middleware/recaptcha.middleware");
const router = express.Router();

router.post("/register", verifyRecaptcha(), registerUser);

router.post("/login", verifyRecaptcha(), loginUser);

router.get("/current", authenticate, currentUser);
router.get("/:id/status", getSellerStatus);
router.post("/reset-password", resetPassword);
router.post("/refresh-token", (req, res) => {
  const { token } = req.body;
  if (!token || !refreshTokens.includes(token)) {
    return res
      .status(403)
      .json({ message: "Refresh token not found or invalid" });
  }

  try {
    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    const accessToken = jwt.sign(
      { user: { id: decoded.id } },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1m" }
    );
    res.json({ accessToken });
  } catch (err) {
    return res.status(403).json({ message: "Invalid refresh token" });
  }
});

router.post("/logout", (req, res) => {
  const { token } = req.body;
  refreshTokens = refreshTokens.filter((t) => t !== token);
  res.status(200).json({ message: "Logged out successfully" });
});

module.exports = router;
