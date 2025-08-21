const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const Product = require("./models/product.model.js");
const productRoute = require("./routes/product.route.js");
const userRoute = require("./routes/user.route.js");
const orderRoutes = require("./routes/order.routes.js");
const stripeRoutes = require("./routes/stripe.routes");
const reviewRoute = require("./routes/review.route.js");
const uploadRoutes = require("./routes/upload.routes");
const contactRoutes = require("./routes/contact.routes");
const blogRoutes = require("./routes/blog.routes");
const adminRoutes = require("./routes/admin.routes");
const path = require("path");
const app = express();
const session = require("express-session");
const passport = require("passport");
const cors = require("cors");
require("dotenv").config();
require("./config/passport");

const authRoutes = require("./routes/auth.routes.js");

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:4200",
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.urlencoded({ extended: false }));

app.use(passport.initialize());

// Routes
app.use("/api/products", productRoute);
app.use("/api/users", userRoute);
app.use("/api/orders", orderRoutes);
app.use("/api/stripe", stripeRoutes);
app.use("/api/reviews", reviewRoute);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/blogs", blogRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("hello world from Node API");
});

// Connect to MongoDB
mongoose
  .connect(
    "mongodb+srv://admin:T1OlAaVU4a1st3tD@taprobanedb.ucl3m.mongodb.net/Taprobane?retryWrites=true&w=majority&appName=taprobaneDB"
  )

  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(3000, () => {
      console.log("server is running on port 3000");
    });
  })

  .catch(() => {
    console.log("Connection failed");
  });
