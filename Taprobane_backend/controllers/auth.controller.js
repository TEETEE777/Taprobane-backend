const jwt = require("jsonwebtoken");

// Google callback → generate JWT and redirect to Angular
exports.googleCallback = (req, res) => {
  const token = jwt.sign(
    {
      user: {
        id: req.user._id,
        email: req.user.email,
        name: req.user.fullName,
        role: req.user.role,
      },
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "7d" }
  );

  res.redirect(`http://localhost:4200/auth/google/callback?token=${token}`);
};

// Get current user from JWT (optional for frontend)
exports.getCurrentUser = (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "Unauthorized" });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    res.json(decoded.user);
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

// Logout (for session-based fallback, optional)
exports.logout = (req, res) => {
  req.logout(() => {
    res.json({ message: "Logged out" });
  });
};

// Middleware to protect routes
exports.verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "Unauthorized" });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
