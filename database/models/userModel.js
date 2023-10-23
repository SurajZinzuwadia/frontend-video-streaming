const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  avatarUrl: {
    type: String,
    default: `/assets/images/avatars/avatar_1.jpg`,
  },
  isVerified: {
    type: Boolean,
    default: true,
  },
  isLive: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    enum: ["active", "banned"],
    default: "active",
    required: true,
  },
  subscribers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  subscribed: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

const User = mongoose.model("User", userSchema);

module.exports = User;
