const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
let refreshTokens = [];

const registerUser = async (req, res) => {
  try {
    const { fullName, email, password, role = "buyer" } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please enter email and password" });
    }

    const userAvailable = await User.findOne({ email });
    if (userAvailable) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("hashedPassword", hashedPassword);

    const user = await User.create({
      fullName,
      email,
      password: hashedPassword,
      role,
      sellerStatus: role === "seller" ? "pending" : undefined,
      isActive: true,
    });
    console.log(`user created ${user}`);

    if (user) {
      return res.status(201).json({
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      });
    } else {
      return res.status(400).json({ message: "Invalid user" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    // Authentication logic here
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please enter email and password" }); // Single response for missing fields
    }

    console.log("Attempting login for:", email);
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" }); // Single response if user is not found
    }

    // Compare password with the stored hash
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" }); // Single response for invalid password
    }
    if (user.role === "seller") {
      if (user.sellerStatus === "pending") {
        return res.status(403).json({
          message:
            "Your seller account is pending approval. Please wait for admin approval.",
        });
      }

      if (user.sellerStatus === "rejected") {
        return res.status(403).json({
          message: "Your seller account has been rejected. Contact support.",
        });
      }

      if (!user.isActive) {
        return res.status(403).json({
          message: "Your seller account is blocked.",
        });
      }
    }

    // Generate the access token
    const accessToken = jwt.sign(
      {
        user: {
          email: user.email,
          id: user._id,
          role: user.role,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1h" }
    );
    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );
    refreshTokens.push(refreshToken);

    res.status(200).json({
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
    });
    // Return the access token
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" }); // Single response for server error
  }
};

const currentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please enter email and password" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getSellerStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select("sellerStatus");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ sellerStatus: user.sellerStatus });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch seller status" });
  }
};

module.exports = {
  registerUser,
  loginUser,
  currentUser,
  resetPassword,
  getSellerStatus,
};
