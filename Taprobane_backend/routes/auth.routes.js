const express = require("express");
const passport = require("passport");
const {
  googleCallback,
  getCurrentUser,
  logout,
} = require("../controllers/auth.controller");

const router = express.Router();

// Step 1: Google login
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account",
    session: false,
  })
);

// Step 2: Google callback
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: "/" }),
  googleCallback
);

// Step 3: Get current user (JWT)
router.get("/me", getCurrentUser);

// Step 4: Logout (optional)
router.get("/logout", logout);

module.exports = router;
