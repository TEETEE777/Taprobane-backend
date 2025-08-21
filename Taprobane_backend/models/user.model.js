const mongoose = require("mongoose");
const UserSchema = mongoose.Schema(
  {
    fullName: {
      type: String,
      required: function () {
        return !this.googleId;
      },
    },
    email: {
      type: String,
      required: [true, "email is required"],
      unique: [true, "email is already taken"],
    },
    password: {
      type: String,
      required: function () {
        return !this.googleId; // required only if not Google login
      },
    },
    role: {
      type: String,
      enum: ["buyer", "seller", "admin"],
      default: "buyer",
    },
    googleId: { type: String },
    photo: { type: String },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", UserSchema);
